// Uses KaTeX for math rendering
// Uses Ace js for code block editing

{
	var tempEditors = [];
	var numberOfTempEditors = 0;
    // Cache for rendered math expressions
}
const mathCache = new Map();

// Parsing
function parseMarkdown(markdown) {
    // Escape-symbol dollar-signs
	markdown = markdown.replace(/\\\$/g, "@@DOLLARSIGN@@");
	
	// Escape code blocks
    const codeBlocks = [];
    markdown = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (_, language, code) => {
        codeBlocks.push({ language, code });
        return `@@CODE${codeBlocks.length - 1}@@`; // Temporary placeholder
    });
    
    // Escape inline code
    const inLineCodeBlocks = [];
    markdown = markdown.replace(/`(.+?)`/g, (_, code) => {
        inLineCodeBlocks.push(code);
        return `@@INLINE${inLineCodeBlocks.length - 1}@@`; // Temporary placeholder
    });
	
    // Escape math sections
    const mathSections = [];
    markdown = markdown.replace(/(\$\$.*?\$\$|\$[^\n]*?\$|\\\[.*?\\\]|\\\(.*?\\\))/gms, (match) => {
        mathSections.push(match);
        return `@@MATH${mathSections.length - 1}@@`; // Temporary placeholder
    });
    
    
    // Quotes and em-dashes
    markdown = markdown.replace(/(^|[-\u2014\s(\["])'/g, "$1\u2018");       // opening singles
    markdown = markdown.replace(/'/g, "\u2019");                            // closing singles & apostrophes
    markdown = markdown.replace(/(^|[-\u2014/\[(\u2018\s])"/g, "$1\u201c"); // opening doubles
    markdown = markdown.replace(/"/g, "\u201d");                            // closing doubles
    markdown = markdown.replace(/ -- /g, " \u2014 "); 

    // Convert headings
    markdown = markdown.replace(/^(#+) (.*)$\n{0,1}/gim, 
		(match, hashtags,content) => {
			const level = Math.min(hashtags.length, 6);
			return `<h${level}>${content}</h${level}>`;
		}
	);
   
	// Tables
	{
		// Convert Markdown tables to HTML with alignment support
		markdown = markdown.replace(/^[\t ]*\|(.+)\|\n[\t ]*\|([-:| ]+)\|\n[\t ]*((?:[\t ]*\|.+\|\n?)*)/gm, (match, headerRow, alignRow, bodyRows) => {
			const headers = headerRow.split('|').map(h => h.trim());
			const aligns = alignRow.split('|').map(a => {
				if (/^:-+:/g.test(a)) return 'center';
				if (/^-+:/g.test(a)) return 'right';
				if (/^:-+/g.test(a)) return 'left';
				return null; // Default alignment
			});

			// Process header row
			const headerHtml = headers.map((header, i) => {
				const alignStyle = aligns[i] ? ` style="text-align: ${aligns[i]}"` : '';
				return `<th${alignStyle}>${header}</th>`;
			}).join('');

			// Process body rows
			const bodyHtml = bodyRows.trim().split('\n').map(row => {
				const cells = row.split('|').slice(1, -1).map(cell => cell.trim());
				return `<tr>${cells.map((cell, i) => {
					const alignStyle = aligns[i] ? ` style="text-align: ${aligns[i]}"` : '';
					return `<td${alignStyle}>${cell}</td>`;
				}).join('')}</tr>`;
			}).join('');

			// Combine into a complete table
			return `<table><thead><tr>${headerHtml}</tr></thead><tbody>${bodyHtml}</tbody></table>`;
		});
	}

    // Convert bold text
    markdown = markdown.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Convert italic text
    markdown = markdown.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Convert underlined text
    markdown = markdown.replace(/__(.*?)__/gim, '<u>$1</u>');
    
    // Convert strikethrough text
    markdown = markdown.replace(/~~(.*?)~~/gim, '<s>$1</s>');
    
    // Horizontal rule
    markdown = markdown.replace(/^----* *$/gm, '<hr></hr>');
    
    // Highlight
    markdown = markdown.replace(/==(?:\[(.*?)\])?(.*?)==/g, (match, color, text) => {
		if (color) {
			return `<span class="highlight" style="background-color:${color};">${text}</span>`;
		} else {
			return `<span class="highlight">${text}</span>`;
    }});
    
    // Text-color
    markdown = markdown.replace(/(?<!\<\!)--(?:\[(.*?)\])?(.*?)--/g, (match, color, text) => {
		if (color) {
			return `<span style="color:${color};">${text}</span>`;
		} else {
			return `<span>${text}</span>`;
    }});

    // Replaces \qed with a qed symbol
    markdown = markdown.replace(/\\qed/g, "<div class='qed'>&#8718;</div>");
	
	// Unordered lists with indentation
	{
		markdown = markdown.replace(/^( *)([-*] .*)$/gm, (match, indent, content) => {
			const level = Math.floor(indent.replace(/\t/g, '    ').length / 4); // Convert tabs to spaces and calculate level
			return `<li_unord level="${level}">${content.slice(2)}</li_unord>`;
		});

		// Group consecutive list items into nested <ul> blocks based on level
		markdown = markdown.replace(/(<li_unord level="\d+">.*?<\/li_unord>\n?)+/g, (match) => {
			const items = match.trim().split(/\n+/);
			let currentLevel = -1;
			let result = '';

			items.forEach((item) => {
				const level = parseInt(item.match(/level="(\d+)"/)[1]);
				if (level > currentLevel) {
					result += '<ul>'.repeat(level - currentLevel);
				} else if (level < currentLevel) {
					result += '</ul>'.repeat(currentLevel - level);
				}
				currentLevel = level;
				result += item.replace(/ level="\d+"/, ''); // Remove level attribute for final HTML
			});

			result += '</ul>'.repeat(currentLevel + 1); // Close remaining open <ul> tags
			return result;
		});

		// Replace intermediary tags with standard <li> tags
		markdown = markdown.replace(/<li_unord>/g, '<li>').replace(/<\/li_unord>/g, '</li>');
	}

	// Ordered lists
	{
		// Temporarily replace ordered list items with their number preserved, considering indentation
		markdown = markdown.replace(/^( *)(\d+)\.\s+(.*)$/gm, (match, spaces, number, content) => {
			const level = Math.floor(spaces.replace(/\t/g, '    ').length / 4); // Convert tabs to spaces and calculate level
			return `<li_ord level="${level}" value="${number}">${content}</li_ord>`;
		});

		// Group consecutive list items into nested <ol> blocks based on their indentation level
		markdown = markdown.replace(/(<li_ord.*?<\/li_ord>\n?)+/g, (match) => {
			const items = match.split('\n').filter(Boolean);
			let currentLevel = 0;
			const stack = [];
			const output = [];

			items.forEach((item) => {
				const levelMatch = item.match(/level="(\d+)"/);
				const level = levelMatch ? parseInt(levelMatch[1], 10) : 0;

				if (level > currentLevel) {
					stack.push(`<ol>`);
					output.push(stack[stack.length - 1]);
				} else if (level < currentLevel) {
					for (let i = 0; i < currentLevel - level; i++) {
						output.push(`</ol>`);
						stack.pop();
					}
				}
				currentLevel = level;
				output.push(item.replace(/ level="\d+"/, '')); // Remove level attribute
			});

			// Close any remaining open lists
			while (stack.length > 0) {
				output.push(`</ol>`);
				stack.pop();
			}

			// Wrap the whole output with an <ol> if it's not nested already
			return `<ol>${output.join('\n')}</ol>`;
		});

		// Replace intermediary tags with standard <li> tags, preserving the value attribute
		markdown = markdown.replace(/<li_ord(.*?)>/g, '<li$1>').replace(/<\/li_ord>/g, '</li>');
	}

	// Convert images
	// markdown = markdown.replace(/!\[(.*?)\]\((.*?)\)/gim, '<img src="$2" alt="$1"></img>');
	// New convert images - has options for align and float
    markdown = markdown.replace(/!\[(.*?)\](?:\{(.[^\}]*?)\})?\((.*?)\)/g, (match, alt, options, src) => {
            if(options === undefined){
                return `<img src="${src}" alt="${alt}"></img>`;
            }
            
            if(options.includes('float')) {
                return `<img src="${src}" alt="${alt}" style="${options}"></img>`;
            }
            
            if(options.includes('right')) {
                return `<div style="width:'100%'; text-align: right;"><img src="${src}" alt="${alt}"></img></div>`;
            } else if(options.includes('center')) {
                return `<div style="width:'100%'; text-align: center;"><img src="${src}" alt="${alt}"></img></div>`;
            }
            
            return `<img src="${src}" alt="${alt}"></img>`;
        }
    );
    // Convert links
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');
    
    // Block qoutes
    markdown = markdown.replace(/^>[ \t]*\n{0,1}([\S]+[\s\S]*?)\n$/gm, '<blockquote>$1</blockquote>');
    markdown = markdown.replace(/^>[ \t]*\n{0,1}(.*)/g, '<blockquote>$1</blockquote>');
    
    
    // Convert double newlines to paragraphs
    markdown = markdown.replace(/\n\n+/g, '</br></br>');
    // Convert more than 2 space + newlines to breaks
    markdown = markdown.replace(/ [ ]+\n+/g, '</br>');

    //~ // Wrap entire text in a paragraph if not already wrapped
    //~ markdown = `<p>${markdown.trim()}</p>`.replace(/<p><\/p>/g, ''); // Remove empty paragraphs

    // Remove extra line breaks
    markdown = markdown.replace(/\n$/gim, '');
    
    // Restore inline code
    markdown = markdown.replace(/@@INLINE(\d+)@@/g, (_, index) => {
		const codeExpression = escapeHTML(inLineCodeBlocks[parseInt(index)]);
		return `<code>${codeExpression}</code>`;
	});
	
    // Restore dollar-signs
	markdown = markdown.replace(/@@DOLLARSIGN@@/g, "$");

	// Render and restore math sections
    markdown = markdown.replace(/@@MATH(\d+)@@/g, (_, index) => {
        var mathExpression = mathSections[parseInt(index)];
        mathExpression=mathExpression.replace(/@@DOLLARSIGN@@/g, "\\$");

        // Check if math expression is already rendered
        if (mathCache.has(mathExpression)) {
            return mathCache.get(mathExpression);
        }
        

        // Render math expression
        let renderedMath;
        try {
            if (mathExpression.startsWith('$$')) {
                // Block math
                renderedMath = `<div class="katex-block">${katex.renderToString(mathExpression.slice(2, -2).trim(), { displayMode: true , macros: katexMacros})}</div>`;
            } else if (mathExpression.startsWith('\\[')) {
                // Block math with \[
                renderedMath = `<div class="katex-block">${katex.renderToString(mathExpression.slice(2, -2).trim(), { displayMode: true , macros: katexMacros })}</div>`;
            } else if (mathExpression.startsWith('\\(')) {
				// Inline math
                renderedMath = `<span class="katex-inline">${katex.renderToString(mathExpression.slice(2, -2).trim(), {macros: katexMacros})}</span>`;
            } else {
                // Inline math
                renderedMath = `<span class="katex-inline">${katex.renderToString(mathExpression.slice(1, -1).trim(), {macros: katexMacros})}</span>`;
            }
        } catch (error) {
			// log error for math, and render the text in red.
            console.error("Error rendering math:", error);
            renderedMath = `<span style="color:red;">${mathExpression};</span>` // Fallback to raw math expression
        }

        // Cache the rendered output
        mathCache.set(mathExpression, renderedMath);
        return renderedMath;
    });
    
    // Clear out old code blocks
    for (var i = 0; i < tempEditors.length; i++){
		tempEditors[i].destroy();
		tempEditors[i].container.remove();
	}
    
	tempEditors = [];
    // Restore code blocks
    numberOfTempEditors = 0;
    markdown = markdown.replace(/@@CODE(\d+)@@/g, (_, index) => {
        var { language, code } = codeBlocks[parseInt(index)];
        tempEditors[numberOfTempEditors] = language;
        numberOfTempEditors++;
        code = escapeHTML(code);
        if(code.endsWith("\n")){code = code.slice(0,-1)}
        return `<div id='code-block-${numberOfTempEditors-1}' class='code-block-output'">${code}</div>`;
    });
    
    return markdown.trim();
}

// Utility function to escape HTML for code blocks
function escapeHTML(string) {
    return string.replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
}

// This will need to be messed with if we wish to change the font-size
function createTempEditor(idNumber, language) {
	var id = 'code-block-' + idNumber;
	var tempEditor = ace.edit(id.toString());
	tempEditor.getSession().setUseWorker(false);
    if (colorScheme == 'dark-mode'){
        tempEditor.setTheme("ace/theme/solarized_dark");
    } else {
        tempEditor.setTheme("ace/theme/iplastic");
    }
	tempEditor.session.setMode("ace/mode/"+language);
	tempEditor.setOptions({
        readOnly: true,
        highlightActiveLine: false,
        highlightGutterLine: false
    });
	tempEditor.renderer.$cursorLayer.element.style.display = "none";
	var editorHeight = tempEditor.session.getLength();
	var lineHeight = 14;
	document.getElementById(id.toString()).style.height = editorHeight*lineHeight+20+'pt';
    tempEditor.renderer.setScrollMargin(13,0);
	tempEditors[idNumber] = tempEditor;
}
