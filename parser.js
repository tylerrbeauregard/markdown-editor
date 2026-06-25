// Uses KaTeX for math rendering
// Uses Prism.js for code blocks
const mathCache = new Map();

function parseMarkdown(markdown) {
    const mathSections = [];
    const codeBlocks = [];
    const inlineCodes = [];
    
    markdown = escapeCodeBlocks(markdown, codeBlocks, inlineCodes);
    markdown = escapeMath(markdown, mathSections);
    
    // LaTeX style quotes
    markdown = markdown.replace(/(?<!`)``(?!`)/gs, "\u201c"); //`` for opening doubles
    markdown = markdown.replace(/''/gs, "\u201d"); //'' for closing doubles
    markdown = markdown.replace(/ -- /gs, " \u2014 "); // em dash
    
    
    // Highlight
    markdown = markdown.replace(/==(?:\[(.*?)\])?(.*?)==/g, (match, color, text) => {
		if (color) {
			return `<mark style="background-color:${color};">${text}</mark>`;
		} else {
			return `<mark class="highlight">${text}</mark>`;
    }});
    
    // Restore code
    markdown = restoreCodeBlocks(markdown, codeBlocks, inlineCodes);
    
    // Parse
    html = marked.parse(markdown);
    
    // Restore Math
    html = restoreMath(html, mathSections);
    
    return html;
}

function escapeMath(markdown, mathSections) {
    // Escape-symbol dollar-signs
	markdown = markdown.replace(/\\\$/g, "@@DOLLARSIGN@@");
    markdown = markdown.replace(/(\$\$.*?\$\$|\$[^\n]*?\$|\\\[.*?\\\]|\\\(.*?\\\))/gms, (match) => {
        // Check if inside code block
        
        mathSections.push(match);
        return `@@MATH${mathSections.length - 1}@@`; // Temporary placeholder
    });
    
    return markdown;
}

function restoreMath(html, mathSections) {
    // Render and restore math sections
    html = html.replace(/@@MATH(\d+)@@/g, (_, index) => {
        var mathExpression = mathSections[parseInt(index)];
        mathExpression = mathExpression.replace(/@@DOLLARSIGN@@/g, "\\$");

        // Check if math expression is already rendered
        if (mathCache.has(mathExpression)) {
            return mathCache.get(mathExpression);
        }


        // Render math expression
        let renderedMath;
        var options = {displayMode: true, macros: katexMacros};
        var tag = "div";
        var renderMode = "block"
        try {
            if (mathExpression.startsWith('$$') || mathExpression.startsWith('\\[')) {
                // Block math $$ or \[
                mathExpression = mathExpression.slice(2, -2);
                options = {displayMode: true, macros: katexMacros};
                tag = "div";
            } else if (mathExpression.startsWith('\\(')) {
				// Inline math \(
                mathExpression = mathExpression.slice(2, -2);
                options = {displayMode: false, macros: katexMacros};
                tag = "span";
            } else {
                // Inline math 
                mathExpression = mathExpression.slice(1, -1);
                options = {displayMode: false, macros: katexMacros};
                tag = "span";
            }
            
            var openTag = "<" + tag + " class=katex-" + renderMode + ">";
            var content = katex.renderToString(mathExpression, options);
            var closeTag = "</" + tag + ">";
            
            renderedMath = openTag + content + closeTag;
        } catch (error) {
			// log error for math, and render the text in red.
            console.error("Error rendering math:", error);
            renderedMath = `<span style="color:red;">${mathExpression};</span>` // Fallback to raw math expression
        }

        // Cache the rendered output
        mathCache.set(mathExpression, renderedMath);
        return renderedMath;
    });
    
    
    // Restore dollar-signs
	html = html.replace(/@@DOLLARSIGN@@/g, "$");
    
    return html;
}

function escapeCodeBlocks(markdown, codeBlocks, inlineCodes) {
    markdown = markdown.replace(/```(?:\w|\-)*\n[\s\S]*?```/g, (codeBlock) => {
        codeBlocks.push(codeBlock);
        return `@@BLOCKCODE${codeBlocks.length - 1}@@`; // Temporary placeholder
    });
    
    // Escape inline code
    // Regex explaination
    // (?<!`) negative lookbehind (no preceeding `)
    // (?!`) negative look behind (no proceeding `)
    // `[^`\r\n]+` look for a single ` anything inside except newlines
    //             or `, and end with `.
    // Complicated to avoid conflict with `` quotes
    markdown = markdown.replace(/(?<!`)`[^`\r\n]+`(?!`)/g, (code) => {
        inlineCodes.push(code);
        return `@@INLINE${inlineCodes.length - 1}@@`; // Temporary placeholder
    });
    
    return markdown;
}

function restoreCodeBlocks(markdown, codeBlocks, inlineCodes) {    
    // Restore inline code
    markdown = markdown.replace(/@@INLINE(\d+)@@/g, (_, index) => {
		return inlineCodes[parseInt(index)];
	});
    
    // Restore Block code
    markdown = markdown.replace(/@@BLOCKCODE(\d+)@@/g, (_, index) => {
        return codeBlocks[parseInt(index)];
    });
    
    return markdown;
}

// Utility function to escape HTML for code blocks
function escapeHTML(string) {
    return string.replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
}
