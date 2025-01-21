// Document variables
var body = document.body,
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

// Show/hide switch
function showhide() {
	if(showLeft){
		leftBox.style.width = "0px";
		output.style.overflow = "visible";
		body.style.overflow = "visible";
		showLeft = false;
		documentUpdate(editor, 'output');
	} else {
		body.style.overflow = "hidden";
		leftBox.style.width = "50%";
		output.style.overflow = "auto";
		showLeft = true;
	}
}

// Drag handlers
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


// Ace editor
var editor = ace.edit("editor");
editor.getSession().setUseWorker(false);
editor.setTheme("ace/theme/solarized_dark");
editor.session.setMode("ace/mode/markdown");

// Ace editor custom key-bindings
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
  exec: function(editor) {
    saveToFile(editor);
  },
  readOnly: false // false if this command should not apply in readOnly mode
});


// Rendering markdown

/* We use a disabled Ace editor for inline code. To handle intiating 
 * and destruction, we use an editor list. Although bad form, before 
 * initiation, we also use tempEditors to hold onto language information
 */
var tempEditors = [];
var numberOfTempEditors = 0;

// Cache for rendered math expressions
const mathCache = new Map();

// Parsing
function parseMarkdown(markdown) {
	// Escape code blocks
    const codeBlocks = [];
    markdown = markdown.replace(/```(\w*)\n([\s\S]*?)```/g, (_, language, code) => {
        codeBlocks.push({ language, code });
        return `@@CODE${codeBlocks.length - 1}@@`; // Temporary placeholder
    });
	
    // Escape math sections
    const mathSections = [];
    markdown = markdown.replace(/(\$\$.*?\$\$|\$.*?\$|\\\[.*?\\\]|\\\(.*?\\\))/gms, (match) => {
        mathSections.push(match);
        return `@@MATH${mathSections.length - 1}@@`; // Temporary placeholder
    });

    // Convert headings
    markdown = markdown.replace(/^### (.*$)/gim, '<h3>$1</h3>');
    markdown = markdown.replace(/^## (.*$)/gim, '<h2>$1</h2>');
    markdown = markdown.replace(/^# (.*$)/gim, '<h1>$1</h1>');

    // Convert bold text
    markdown = markdown.replace(/\*\*(.*?)\*\*/gim, '<strong>$1</strong>');

    // Convert italic text
    markdown = markdown.replace(/\*(.*?)\*/gim, '<em>$1</em>');

    // Convert underlined text
    markdown = markdown.replace(/__(.*?)__/gim, '<u>$1</u>');

    // Convert links
    markdown = markdown.replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2">$1</a>');
    
    // Block qoutes
    markdown = markdown.replace(/^>\s*(.*)$/gm, '<blockquote>$1</blockquote>');

	// unorderd lists
	// Temporarily replace unordered list items
    markdown = markdown.replace(/^\s*- (.*)$/gm, '<li_unord>$1</li_unord>');

    // Group consecutive list items into a <ul> block
    markdown = markdown.replace(/(<li_unord>.*?<\/li_unord>\n?)+/g, (match) => {
        return `<ul>${match}</ul>`;
    });

    // Replace intermediary tags with standard <li> tags
    markdown = markdown.replace(/<li_unord>/g, '<li>').replace(/<\/li_unord>/g, '</li>');
		
	  // Temporarily replace ordered list items with their number preserved
    markdown = markdown.replace(/^\s*(\d+)\.\s+(.*)$/gm, (match, number, content) => {
        return `<li_ord value="${number}">${content}</li_ord>`;
    });

    // Group consecutive list items into an <ol> block
    markdown = markdown.replace(/(<li_ord.*?<\/li_ord>\n?)+/g, (match) => {
        return `<ol>${match}</ol>`;
    });

    // Replace intermediary tags with standard <li> tags, preserving the value attribute
    markdown = markdown.replace(/<li_ord(.*?)>/g, '<li$1>').replace(/<\/li_ord>/g, '</li>');

    // Replace intermediary tags with standard <li> tags
    markdown = markdown.replace(/<li_ord>/g, '<li>').replace(/<\/li_ord>/g, '</li>');
   
    // Convert double newlines to paragraphs
    markdown = markdown.replace(/\n\n+/g, '</p><p>');

    // Wrap entire text in a paragraph if not already wrapped
    markdown = `<p>${markdown.trim()}</p>`.replace(/<p><\/p>/g, ''); // Remove empty paragraphs

    // Remove extra line breaks
    markdown = markdown.replace(/\n$/gim, '');

	// Render and restore math sections
    markdown = markdown.replace(/@@MATH(\d+)@@/g, (_, index) => {
        const mathExpression = mathSections[parseInt(index)];

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
        const { language, code } = codeBlocks[parseInt(index)];
        tempEditors[numberOfTempEditors] = language;
        numberOfTempEditors++;
        return `<div id='code-block-${numberOfTempEditors-1}' class='code-block-output'">${code.trim()}</div>`;
    });
    
    return markdown.trim();
}

// Utility function to escape HTML for code blocks
function escapeHtml(string) {
    return string.replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
}



// KaTeX Macros and Macros handling window
katexMacros = {
	"\\R": "\\mathbb{R}",
	"\\Z": "\\mathbb{Z}",
	"\\N": "\\mathbb{N}",
	"\\C": "\\mathbb{C}",
	"\\Q": "\\mathbb{Q}",
	"\\Log": "\\mathrm{Log}",
	"\\norm": "\\left\\lVert{#1}\\right\\rVert"
}

// Document startup
var height = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );

leftBox.style.width = "50%";
leftBox.style.flexGrow = 0;
leftBox.style.flexShrink = 0;
wrapper.style.height = height - navbarHeight;
output.style.height = height - navbarHeight;

// Initial render
documentUpdate(editor, 'output');
