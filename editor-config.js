var editor = ace.edit("editor");
editor.getSession().setUseWorker(false);

function changeColorTheme(theme) {
    body.className = theme;
    colorScheme = theme;
    if(theme == "light-mode") {
        editor.setTheme("ace/theme/iplastic");
        lightDarkToggle.checked = true;
    } else {
        editor.setTheme("ace/theme/solarized_dark");
        lightDarkToggle.checked = false;
    }
}

changeColorTheme(colorScheme);

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const newTheme = (event.matches ? "dark" : "light") + '-mode';
    
    changeColorTheme(newTheme);
});

checkbox.addEventListener('click', function () {
    if(lightDarkToggle.checked) {
        changeColorTheme('light-mode');
    } else {
        changeColorTheme('dark-mode');
    }
});

editor.session.setMode("ace/mode/markdown");
editor.setOptions({
    wrap: true,
    indentedSoftWrap: false,
});

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
editor.commands.addCommand({ // Strikethrough
  name: 'strikethrough',
  bindKey: {
    win: 'Ctrl-Shift-S',
    mac: 'Command-Shift-S'
  },
  exec: strikethrough,
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({ // Strikethrough
  name: 'link',
  bindKey: {
    win: 'Ctrl-K',
    mac: 'Command-K'
  },
  exec: link,
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({ // math
  name: 'math1',
  bindKey: {
    win: 'Ctrl-4',
    mac: 'Command-4'
  },
  exec: inlineMath,
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({ // math
  name: 'math2',
  bindKey: {
    win: 'Ctrl-Shift-4',
    mac: 'Command-Shift-4'
  },
  exec: inlineMath,
  readOnly: false // false if this command should not apply in readOnly mode
});
editor.commands.addCommand({ // math 3
  name: 'math3',
  bindKey: {
    win: '$',
  },
  exec: dollarSignOverload,
  readOnly: false // false if this command should not apply in readOnly mode
});

function bold(editor) {
    // Return focus to the editor
    editor.focus()
	// If there is no selection
	if( editor.selection.isEmpty() ){
		var editorPosition = editor.getCursorPosition();
		editor.session.insert(editorPosition, "****");
        editor.moveCursorToPosition({
            row: editor.getCursorPosition().row,
            column: editor.getCursorPosition().column - 2})
		return;
	}
	// Otherwise there is 
	var selectionRange = editor.getSelectionRange();

    // Check if section is already bolded
    var selectedText = editor.session.getTextRange(selectionRange);
    if( selectedText.startsWith("**") && selectedText.endsWith("**") && selectedText.length >= 4){
      var endTextRange = new ace.Range(
        selectionRange.end.row,
        selectionRange.end.column-2,
        selectionRange.end.row,
        selectionRange.end.column);
      editor.session.remove(endTextRange);

      var startTextRange = new ace.Range(
        selectionRange.start.row,
        selectionRange.start.column,
        selectionRange.start.row,
        selectionRange.start.column+2);
      editor.session.remove(startTextRange);
      return
    }
    // Also need to check outside of selection
    var lineLength = editor.session.getLine(selectionRange.end.row).length;
    // If there's room for the double asterisk
    if( selectionRange.start.column >= 2 && lineLength >= selectionRange.end.column + 2) {
      var startTextRange = new ace.Range(
        selectionRange.start.row,
        selectionRange.start.column-2,
        selectionRange.start.row,
        selectionRange.start.column);

      var endTextRange = new ace.Range(
        selectionRange.end.row,
        selectionRange.end.column,
        selectionRange.end.row,
        selectionRange.end.column+2);

      if(editor.session.getTextRange(startTextRange) == "**"
        && editor.session.getTextRange(endTextRange) == "**") {
          editor.session.remove(endTextRange);
          editor.session.remove(startTextRange);
          return
        }
    }

	editor.session.insert(selectionRange.end, "**");
	editor.session.insert(selectionRange.start, "**");
    // Fix the selection
    var selectionRange = editor.getSelectionRange();
    editor.selection.setRange(
      new ace.Range(
        selectionRange.start.row,
        selectionRange.start.column,
        selectionRange.end.row,
        selectionRange.end.column - 2));
}
function italicize(editor) {
    // Return focus to the editor
    editor.focus()
	// If there is no selection
	if( editor.selection.isEmpty() ){
		var editorPosition = editor.getCursorPosition();
		editor.session.insert(editorPosition, "**");
        editor.moveCursorToPosition({
            row: editor.getCursorPosition().row,
            column: editor.getCursorPosition().column - 1})
		return;
	}
	// Otherwise there is 
	selectionRange = editor.getSelectionRange();
	editor.session.insert(selectionRange.end, "*");
	editor.session.insert(selectionRange.start, "*");
    selectionRange = editor.getSelectionRange();
    editor.selection.setRange(
      new ace.Range(
        selectionRange.start.row,
        selectionRange.start.column,
        selectionRange.end.row,
        selectionRange.end.column - 1));
}
function underline(editor) {
    // Return focus to the editor
    editor.focus()
	// If there is no selection
	if( editor.selection.isEmpty() ){
		var editorPosition = editor.getCursorPosition();
		editor.session.insert(editorPosition, "____");
        editor.moveCursorToPosition({
            row: editor.getCursorPosition().row,
            column: editor.getCursorPosition().column - 2})
		return;
	}
	// Otherwise there is 
	selectionRange = editor.getSelectionRange();
	editor.session.insert(selectionRange.end, "__");
	editor.session.insert(selectionRange.start, "__");
    selectionRange = editor.getSelectionRange();
    editor.selection.setRange(
      new ace.Range(
        selectionRange.start.row,
        selectionRange.start.column,
        selectionRange.end.row,
        selectionRange.end.column - 2));
}
function strikethrough(editor) {
    // Return focus to the editor
    editor.focus()
	// If there is no selection
	if( editor.selection.isEmpty() ){
		var editorPosition = editor.getCursorPosition();
		editor.session.insert(editorPosition, "~~~~");
        editor.moveCursorToPosition({
            row: editor.getCursorPosition().row,
            column: editor.getCursorPosition().column - 2})
		return;
	}
	// Otherwise there is 
	selectionRange = editor.getSelectionRange();
	editor.session.insert(selectionRange.end, "~~");
	editor.session.insert(selectionRange.start, "~~");
    selectionRange = editor.getSelectionRange();
    editor.selection.setRange(
      new ace.Range(
        selectionRange.start.row,
        selectionRange.start.column,
        selectionRange.end.row,
        selectionRange.end.column - 2));
}
function link(editor) {
    // Return focus to the editor
    editor.focus()
    // If there is no selection
	if( editor.selection.isEmpty() ){
		var editorPosition = editor.getCursorPosition();
		editor.session.insert(editorPosition, "[]()");
        editor.moveCursorToPosition({
            row: editor.getCursorPosition().row,
            column: editor.getCursorPosition().column - 1})
		return;
	}
	// Otherwise there is 
	selectionRange = editor.getSelectionRange();
	editor.session.insert(selectionRange.end, "]()");
	editor.session.insert(selectionRange.start, "[");
    editor.moveCursorToPosition({
            row: selectionRange.end.row,
            column: selectionRange.end.column + 3});
    editor.selection.clearSelection()
}
function inlineMath(editor) {
    // Return focus to the editor
    editor.focus()
    // If there is no selection
	if( editor.selection.isEmpty() ){
		var editorPosition = editor.getCursorPosition();
		editor.session.insert(editorPosition, "$$");
		editor.moveCursorToPosition({
            row: editor.getCursorPosition().row,
            column: editor.getCursorPosition().column - 1});
		return;
	}
	// Otherwise there is 
	selectionRange = editor.getSelectionRange();
	editor.session.insert(selectionRange.end, "$");
	editor.session.insert(selectionRange.start, "$");
    selectionRange = editor.getSelectionRange();
    editor.selection.setRange(
      new ace.Range(
        selectionRange.start.row,
        selectionRange.start.column,
        selectionRange.end.row,
        selectionRange.end.column - 1));
}
// This allows us to highlight a selection, press dollar sign and
// wrap it. If nothing is selected, we just type a single $
function dollarSignOverload(editor) {
    // Return focus to the editor
    editor.focus()
	// If there is no selection
	if( editor.selection.isEmpty() ){
		var editorPosition = editor.getCursorPosition();
		editor.session.insert(editorPosition, "$");
		return;
	}
	// Otherwise there is 
	selectionRange = editor.getSelectionRange();
	editor.session.insert(selectionRange.end, "$");
	editor.session.insert(selectionRange.start, "$");
    selectionRange = editor.getSelectionRange();
    editor.selection.setRange(
      new ace.Range(
        selectionRange.start.row,
        selectionRange.start.column,
        selectionRange.end.row,
        selectionRange.end.column - 1));
}
function codeBlock(editor) {
    // Return focus to the editor
    editor.focus()
    // If there is no selection
	if( editor.selection.isEmpty() ){
		var editorPosition = editor.getCursorPosition();
		editor.session.insert(editorPosition, "```language\n\n```");
        editor.moveCursorToPosition({
            row: editor.getCursorPosition().row - 1,
            column: 0});
		return;
	}
	// Otherwise there is 
	selectionRange = editor.getSelectionRange();
	editor.session.insert(selectionRange.end, "\n```\n");
	editor.session.insert(selectionRange.start, "```language\n");
    editor.moveCursorToPosition({
            row: selectionRange.end.row+3,
            column: 0});
    selectionRange = editor.getSelectionRange();
    editor.selection.setRange(
      new ace.Range(
        selectionRange.start.row,
        selectionRange.start.column,
        selectionRange.end.row-1,
        selectionRange.end.column));
}
function addImage(editor) {
    // Return focus to the editor
    editor.focus()
    // If there is no selection
	if( editor.selection.isEmpty() ){
		var editorPosition = editor.getCursorPosition();
		editor.session.insert(editorPosition, "![alt text]()");
        editor.moveCursorToPosition({
            row: editor.getCursorPosition().row,
            column: editor.getCursorPosition().column - 1});
		return;
	}
	// Otherwise there is 
	selectionRange = editor.getSelectionRange();
	editor.session.insert(selectionRange.end, "]()");
	editor.session.insert(selectionRange.start, "![");
    editor.moveCursorToPosition({
            row: selectionRange.end.row,
            column: selectionRange.end.column + 4});
}
