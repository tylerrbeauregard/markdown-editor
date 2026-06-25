var contentSaved = true;

function documentUpdate(aceEditor, outputId) {
	var markdown = aceEditor.getValue();
	var html = parseMarkdown(markdown);
	var outputDiv = document.getElementById(outputId);
	outputDiv.innerHTML = html;
	output.style.height = webpageHeight - navbarHeight;
    Prism.highlightAllUnder(outputDiv);
	
	// Set local storage
	localStorage.setItem("editorContent", markdown);
	contentSaved = true;
}


window.addEventListener('beforeunload', function (e) {
  // Check if there are unsaved changes
  if (!contentSaved) {
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

const BASE_PRISM_PATH = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';
Prism.plugins.autoloader.languages_path = BASE_PRISM_PATH;
Prism.plugins.autoloader.use_minified = true;

// On document load -- Initiating page
var webpageHeight = Math.max(
	body.scrollHeight, body.offsetHeight, 
	html.clientHeight, html.scrollHeight, html.offsetHeight );

leftBox.style.width = "50%";
leftBox.style.flexGrow = 0;
leftBox.style.flexShrink = 0;
wrapper.style.height = webpageHeight - navbarHeight;
output.style.height = webpageHeight - navbarHeight;

rightBox.style.width = (
    window.innerWidth
    - (leftBox.offsetWidth + 15)) + 'px';

loadFromLocalStorage(editor);

documentUpdate(editor, 'output');
