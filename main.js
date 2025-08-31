var contentSaved = true;

function documentUpdate(aceEditor, outputId) {
	var markdown = aceEditor.getValue();
	var html = parseMarkdown(markdown);
	var outputDiv = document.getElementById(outputId);
	outputDiv.innerHTML = html;
	output.style.height = webpageHeight - navbarHeight;
	
	// Creates temp-editors
	for(var idNumber=0; idNumber<numberOfTempEditors; idNumber++) {
		createTempEditor(idNumber, tempEditors[idNumber]);
		const copyButton = document.createElement("button");
		copyButton.textContent = "Copy";
		copyButton.id = "copy" + idNumber;
		copyButton.addEventListener("click", (e) => {
			var copyId = parseInt(e.target.id.slice(4));
			navigator.clipboard.writeText(tempEditors[copyId].getValue()).then(() => {
			copyButton.textContent = "Copied!";
			setTimeout(() => copyButton.textContent = "Copy", 1500);
		}).catch(err => {
			console.error("Copy failed:", err);
		});
		});

		tempEditors[idNumber].container.appendChild(copyButton);
		copyButton.classList.add( "copy-button");
	}
    
    // draw graphs
    drawPictures()
	
	// Set local storage
	localStorage.setItem("editorContent", markdown);
	contentSaved = true;
}


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
