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
