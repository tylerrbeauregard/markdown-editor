{
	var body = document.body;
	var html = document.documentElement;
	var handler = document.querySelector('.handler');
	var dragbar = document.querySelector('.dragbar');
	var wrapper = handler.closest('.wrapper');
	var leftBox = wrapper.querySelector('.box');
	var rightBox = document.getElementById("right");
	var output = document.getElementById("output");

	// Global vars
	var isHandlerDragging = false;
	var navbarHeight = 50;
	var showLeft = true;
	var tempEditors = [];
	var numberOfTempEditors = 0;
	var contentSaved = true;
}

// Big print listener
document.addEventListener('keyup', (e) => {
	if(e.ctrlKey && e.keyCode == 80){
		printDiv('output');
	}
});

document.addEventListener('mousedown', function(e) {
  // If mousedown event is fired from .handler, toggle flag to true
  if (e.target === handler || e.target === dragbar) {
    isHandlerDragging = true;
  }
});

document.addEventListener('mousemove', function(e) {
  // Don't do anything if dragging flag is false
  if (!isHandlerDragging) {
    return false;
  }
  
  // Turn off user select while dragging
  if(output.style.MozUserSelect !== undefined){output.style.MozUserSelect = "none";}
  if(output.style.userSelect !== undefined){output.style.userSelect = "none";}
  if(output.style.webkitUserSelect !== undefined){output.style.webkitUserSelect = "none";}

  // Get offset
  var containerOffsetLeft = wrapper.offsetLeft;

  // Get x-coordinate of pointer relative to container
  var pointerRelativeXpos = e.clientX - containerOffsetLeft;
  
  // Arbitrary minimum width set on box A, otherwise its inner content will collapse to width of 0
  var leftBoxminWidth = 0;

  // Resize box A
  // * 8px is the left/right spacing between .handler and its inner pseudo-element
  // * Set flex-grow to 0 to prevent it from growing
  leftBox.style.width = (Math.max(leftBoxminWidth, pointerRelativeXpos - 8)) + 'px';
  leftBox.style.flexGrow = 0;
  leftBox.style.flexShrink = 0;
});

document.addEventListener('mouseup', function(e) {
  // Turn off dragging flag when user mouse is up
  isHandlerDragging = false;
  
  // Turn on user select when finished
  if(output.style.MozUserSelect !== undefined){output.style.MozUserSelect = "auto";}
  if(output.style.userSelect !== undefined){output.style.userSelect = "auto";}
  if(output.style.webkitUserSelect !== undefined){output.style.webkitUserSelect = "auto";}
});

var editor = ace.edit("editor");
editor.getSession().setUseWorker(false);
editor.setTheme("ace/theme/solarized_dark");
editor.session.setMode("ace/mode/markdown");

editor.commands.addCommand({
  name: 'reload-editor',
  bindKey: {
    win: 'Ctrl-Space',
    mac: 'Command-Space'
  },
  exec: function(editor) {
    documentUpdate(editor, 'output');
  },
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({
  name: 'reload-editor-2',
  bindKey: {
    win: 'Ctrl-S',
    mac: 'Command-S'
  },
  exec: function(editor) {
    documentUpdate(editor, 'output');
  },
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({
  name: 'reload-editor-3',
  bindKey: {
    win: 'Ctrl-Enter',
    mac: 'Command-Enter'
  },
  exec: function(editor) {
    documentUpdate(editor, 'output');
  },
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({
  name: 'print',
  bindKey: {
    win: 'Ctrl-P',
    mac: 'Command-P'
  },
  exec: function(editor) {
    printDiv('output');
  },
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({
  name: 'save',
  bindKey: {
    win: 'Ctrl-Shift-S',
    mac: 'Command-Shift-S'
  },
  exec: saveToFile,
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({ // Bold
  name: 'bold',
  bindKey: {
    win: 'Ctrl-B',
    mac: 'Command-B'
  },
  exec: bold,
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({ // Underline
  name: 'underline',
  bindKey: {
    win: 'Ctrl-U',
    mac: 'Command-U'
  },
  exec: underline,
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({ // Italicize
  name: 'italicize',
  bindKey: {
    win: 'Ctrl-I',
    mac: 'Command-I'
  },
  exec: italicize,
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({ // math
  name: 'math1',
  bindKey: {
    win: 'Ctrl-4',
    mac: 'Command-4'
  },
  exec: wrapWithDollarSigns,
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({ // math
  name: 'math2',
  bindKey: {
    win: 'Ctrl-Shift-4',
    mac: 'Command-Shift-4'
  },
  exec: wrapWithDollarSigns,
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({ // math 3
  name: 'math3',
  bindKey: {
    win: '$',
  },
  exec: wrapWithDollarSigns,
  readOnly: false // false if this command should not apply in readOnly mode
});

function bold(editor) {
	// If there is no selection
	if( editor.selection.isEmpty() ){
		var editorPosition = editor.getCursorPosition();
		editor.session.insert(editorPosition, "** **");
		return;
	}
	// Otherwise there is 
	selectionRange = editor.getSelectionRange();
	editor.session.insert(selectionRange.end, "**");
	editor.session.insert(selectionRange.start, "**");
}
function italicize(editor) {
	// If there is no selection
	if( editor.selection.isEmpty() ){
		var editorPosition = editor.getCursorPosition();
		editor.session.insert(editorPosition, "* *");
		return;
	}
	// Otherwise there is 
	selectionRange = editor.getSelectionRange();
	editor.session.insert(selectionRange.end, "*");
	editor.session.insert(selectionRange.start, "*");
}
function underline(editor) {
	// If there is no selection
	if( editor.selection.isEmpty() ){
		var editorPosition = editor.getCursorPosition();
		editor.session.insert(editorPosition, "__ __");
		return;
	}
	// Otherwise there is 
	selectionRange = editor.getSelectionRange();
	editor.session.insert(selectionRange.end, "__");
	editor.session.insert(selectionRange.start, "__");
}
function wrapWithDollarSigns(editor) {
	// If there is no selection
	if( editor.selection.isEmpty() ){
		var editorPosition = editor.getCursorPosition();
		editor.session.insert(editorPosition, "$");
		editor.moveCursorToPosition({row: editor.getCursorPosition().row,column: editor.getCursorPosition().column + 1})
		return;
	}
	// Otherwise there is 
	selectionRange = editor.getSelectionRange();
	editor.session.insert(selectionRange.end, "$");
	editor.session.insert(selectionRange.start, "$");
}

// Cache for rendered math expressions
const mathCache = new Map();

// Parsing
function parseMarkdown(markdown) {
	markdown = markdown.replace(/\\\$/g, "@@DOLLARSIGN@@");
	
	// Escape code blocks
    const codeBlocks = [];
    markdown = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (_, language, code) => {
        codeBlocks.push({ language, code });
        return `@@CODE${codeBlocks.length - 1}@@`; // Temporary placeholder
    });
    
    const inLineCodeBlocks = [];
    markdown = markdown.replace(/`(.*?)`/g, (_, code) => {
        inLineCodeBlocks.push(code);
        return `@@INLINE${inLineCodeBlocks.length - 1}@@`; // Temporary placeholder
    });
	
    // Escape math sections
    const mathSections = [];
    markdown = markdown.replace(/(\$\$.*?\$\$|\$[^\n]*?\$|\\\[.*?\\\]|\\\(.*?\\\))/gms, (match) => {
        mathSections.push(match);
        return `@@MATH${mathSections.length - 1}@@`; // Temporary placeholder
    });

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
    markdown = markdown.replace(/~(.*?)~/gim, '<s>$1</s>');
    
    // Horizontal rule
    markdown = markdown.replace(/^----* *$/gm, '<hr></hr>');
    
    // Highlight
    markdown = markdown.replace(/==(?:\[(.*?)\])?(.*?)==/g, (match, color, text) => {
		if (color) {
			return `<span style="background-color:${color};">${text}</span>`;
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
            console.error("Error rendering math:", error);
            renderedMath = mathExpression; // Fallback to raw math expression
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

function createTempEditor(idNumber, language) {
	var id = 'code-block-' + idNumber;
	var tempEditor = ace.edit(id.toString());
	tempEditor.getSession().setUseWorker(false);
	tempEditor.setTheme("ace/theme/solarized_dark");
	tempEditor.session.setMode("ace/mode/"+language);
	tempEditor.setOptions({readOnly: true, highlightActiveLine: false, highlightGutterLine: false});
	tempEditor.renderer.$cursorLayer.element.style.display = "none";
	var editorHeight = tempEditor.session.getLength();
	var lineHeight = 14;
	document.getElementById(id.toString()).style.height = editorHeight*lineHeight+3+'pt';
	tempEditors[idNumber] = tempEditor;
}



function documentUpdate(aceEditor, toId) {
	var markdown = aceEditor.getValue();
	var html = parseMarkdown(markdown);
	var outputDiv = document.getElementById(toId);
	outputDiv.innerHTML = html;
	output.style.height = webpageHeight - navbarHeight;
	
	// Creates temp-editors
	for(var idNumber=0; idNumber<numberOfTempEditors; idNumber++) {
		createTempEditor(idNumber, tempEditors[idNumber]);
	}
	
	// Set cookie
	localStorage.setItem("editorContent", markdown);
	contentSaved = true;
}


// Button-bound functions
function printDiv(divId) {
	leftBox.style.width = "0px";
	output.style.overflow = "visible";
	body.style.overflow = "visible";
	
	window.print();
	
	body.style.overflow = "hidden";
	leftBox.style.width = "50%";
	output.style.overflow = "auto";
}

function showhide() {
	if(showLeft){
		document.getElementById("showhide").innerText = "Show";
		leftBox.style.width = "0px";
		showLeft = false;
	} else {
		document.getElementById("showhide").innerText = "Hide";
		leftBox.style.width = "50%";
		showLeft = true;
	}
}

function saveToFile(editor) {
	var HTMLtextToSave = editor.getValue();
    var HTMLhiddenElement = document.createElement("a");
    HTMLhiddenElement.href = 'data:attachment/text,' + encodeURIComponent(HTMLtextToSave);
    HTMLhiddenElement.target = '_blank';
    HTMLhiddenElement.download = 'edit.txt';
    HTMLhiddenElement.click();
    contentSaved = true;
}

// Document elements related to selection window
const customCommandWindow = document.getElementById("customCommandWindow");
const tableBody = document.querySelector("#objectTable tbody");
const newKeyInput = document.getElementById("newKey");
const newValueInput = document.getElementById("newValue");
const addButton = document.getElementById("addButton");
const closeButton = document.getElementById("closeButton");
const openButton = document.getElementById("openButton");

katexMacros = {
	"\\R": "\\mathbb{R}",
	"\\Z": "\\mathbb{Z}",
	"\\N": "\\mathbb{N}",
	"\\C": "\\mathbb{C}",
	"\\Q": "\\mathbb{Q}",
	"\\Log": "\\mathrm{Log}",
	"\\norm": "\\left\\lVert{#1}\\right\\rVert"
}

// Function to render the object as a table
function renderTable() {
	tableBody.innerHTML = ""; // Clear existing rows
	// Delete cache of pre-rendered KaTeX
	mathCache.clear();
	for (const [key, value] of Object.entries(katexMacros)) {
		const row = document.createElement("tr");

		// Key Cell
		const keyCell = document.createElement("td");
		keyCell.contentEditable = "true";
		keyCell.textContent = key;
		row.appendChild(keyCell);

		// Value Cell
		const valueCell = document.createElement("td");
		valueCell.contentEditable = "true";
		valueCell.textContent = value;
		row.appendChild(valueCell);

		// Action Cell
		const actionCell = document.createElement("td");
		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Delete";
		deleteButton.style.backgroundColor = "#ff4d4d";
		deleteButton.style.color = "white";
		deleteButton.style.border = "none";
		deleteButton.style.padding = "5px 10px";
		deleteButton.style.cursor = "pointer";
		deleteButton.style.borderRadius = "5px";
		deleteButton.addEventListener("click", () => {
			delete katexMacros[key]; // Delete the key from the object
			renderTable(); // Re-render the table
		});
		actionCell.appendChild(deleteButton);
		row.appendChild(actionCell);

		// Save changes on blur
		keyCell.addEventListener("blur", () => updateObjectKey(key, keyCell.textContent, valueCell.textContent));
		valueCell.addEventListener("blur", () => updateObjectValue(key, valueCell.textContent));
		
		tableBody.appendChild(row);
	}
}

// Update key in the object
function updateObjectKey(oldKey, newKey, newValue) {
	if (newKey !== oldKey) {
		delete katexMacros[oldKey];
		katexMacros[newKey] = newValue;
	}
}

// Update value in the object
function updateObjectValue(key, newValue) {
	katexMacros[key] = newValue;
}

// Add new key-value pair
addButton.addEventListener("click", () => {
	const newKey = newKeyInput.value.trim();
	const newValue = newValueInput.value.trim();
	if (newKey && !katexMacros.hasOwnProperty(newKey)) {
		katexMacros[newKey] = newValue;
		newKeyInput.value = "";
		newValueInput.value = "";
		renderTable(); // Re-render the table
	} else {
		alert("Invalid or duplicate key!");
	}
});

// Close the custom command window
closeButton.addEventListener("click", () => {
	customCommandWindow.style.display = "none";
});

// Open the custom command window
openButton.addEventListener("click", () => {
	customCommandWindow.style.display = "block";
	renderTable(); // Ensure the table is up-to-date
});

// Initial setup: Hide the custom command window
customCommandWindow.style.display = "none";

window.addEventListener('beforeunload', function (e) {
  // Check if there are unsaved changes
  if (!contentSaved && markdown) {
    e.preventDefault(); // Prevent the page from unloading
    e.returnValue = ''; // Chrome requires a non-empty string
    return 'You have unsaved changes. Are you sure you want to leave?';
  }
});

editor.getSession().on('change', function() {
	contentSaved = false;
})

function loadFromLocalStorage(editor) {
	var editorContent = localStorage.getItem("editorContent");
	if(editorContent) {
		editor.setValue(editorContent);
	}
}

// On document load -- Initiating page
var webpageHeight = Math.max(
	body.scrollHeight, body.offsetHeight, 
	html.clientHeight, html.scrollHeight, html.offsetHeight );

leftBox.style.width = "50%";
leftBox.style.flexGrow = 0;
leftBox.style.flexShrink = 0;
wrapper.style.height = webpageHeight - navbarHeight;
output.style.height = webpageHeight - navbarHeight;

loadFromLocalStorage(editor);

documentUpdate(editor, 'output');

function loadExample() {
	exampleLocation = "./example.md"
	var client = new XMLHttpRequest();
	client.open('GET', exampleLocation);
	client.onreadystatechange = function() {
		editor.setValue(client.responseText);
	}
	client.send();
}
