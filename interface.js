{
    var body = document.body;
	var html = document.documentElement;
	var handler = document.querySelector('.handler');
	var dragbar = document.querySelector('.dragbar');
	var wrapper = handler.closest('.wrapper');
	var leftBox = wrapper.querySelector('.box');
	var rightBox = document.getElementById("right");
	var output = document.getElementById("output");
    var lightDarkToggle = document.getElementById("checkbox");
    var themeSelector = document.getElementById("themeSelector");
    
    // Global vars
	var isHandlerDragging = false;
	var navbarHeight = 50;
    
    var colorScheme = body.className;
}

if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
    colorScheme = "light-mode";
    body.className = colorScheme;
    lightDarkToggle.checked = true
}

themeSelector.addEventListener('change', function () {
    var root = document.querySelector(':root');
    root.style.setProperty('--theme-color', themeSelector.value);
});

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

  // Resize editor box
  // * 8px is the left/right spacing between .handler and its inner pseudo-element
  // * Set flex-grow to 0 to prevent it from growing
  leftBox.style.width = (Math.max(leftBoxminWidth, pointerRelativeXpos - 8)) + 'px';
  leftBox.style.flexGrow = 0;
  leftBox.style.flexShrink = 0;

  // Trying to avoid right-side overflow!
  rightBox.style.width = (
    window.innerWidth
    - (Math.max(leftBoxminWidth, pointerRelativeXpos + 15))) + 'px';
});

document.addEventListener('mouseup', function(e) {
  // Turn off dragging flag when user mouse is up
  isHandlerDragging = false;
  
  // Turn on user select when finished
  if(output.style.MozUserSelect !== undefined){output.style.MozUserSelect = "auto";}
  if(output.style.userSelect !== undefined){output.style.userSelect = "auto";}
  if(output.style.webkitUserSelect !== undefined){output.style.webkitUserSelect = "auto";}
});

// Touch events
// Listen for touchstart events
document.addEventListener('touchstart', function(e) {
  // If touchstart event is fired from .handler or .dragbar, toggle flag to true
  var target = document.elementFromPoint(e.clientX, e.clientY);
  if (target === handler || target === dragbar) {
    isHandlerDragging = true;
  }
}, { passive: false });

document.addEventListener('touchmove', function(e) {
  // Prevent the default scrolling behavior when dragging
  e.preventDefault();
  
  //console.log('moving: ' + pointerRelativeXpos);

  // Don't do anything if dragging flag is false
  if (!isHandlerDragging) {
    return false;
  }

  // Turn off user select while dragging
  if (output.style.MozUserSelect !== undefined) {
    output.style.MozUserSelect = "none";
  }
  if (output.style.userSelect !== undefined) {
    output.style.userSelect = "none";
  }
  if (output.style.webkitUserSelect !== undefined) {
    output.style.webkitUserSelect = "none";
  }

  // Get offset
  var containerOffsetLeft = wrapper.offsetLeft;

  // Get x-coordinate of the first touch relative to the container
  var pointerRelativeXpos = e.touches[0].clientX - containerOffsetLeft;

  // Arbitrary minimum width set on box A, otherwise its inner content will collapse to width of 0
  var leftBoxminWidth = 0;

  // Resize box A
  // * 8px is the left/right spacing between .handler and its inner pseudo-element
  // * Set flex-grow to 0 to prevent it from growing
  leftBox.style.width = (Math.max(leftBoxminWidth, pointerRelativeXpos - 8)) + 'px';
  leftBox.style.flexGrow = 0;
  leftBox.style.flexShrink = 0;
}, { passive: false });

document.addEventListener('touchend', function(e) {
  // Turn off dragging flag when the user lifts their finger
  isHandlerDragging = false;

  // Turn on user select when finished
  if (output.style.MozUserSelect !== undefined) {
    output.style.MozUserSelect = "auto";
  }
  if (output.style.userSelect !== undefined) {
    output.style.userSelect = "auto";
  }
  if (output.style.webkitUserSelect !== undefined) {
    output.style.webkitUserSelect = "auto";
  }
}, { passive: false });



// Button-bound functions
function printDiv(divId) {
	leftBox.style.width = "0px";
	output.style.overflow = "visible";
	body.style.overflow = "visible";
	
	window.print();
	
	body.style.overflow = "hidden";
	leftBox.style.width = "50%";
	output.style.overflow = "auto";
    changeColorTheme(colorScheme);
}

function viewOutput() {
    leftBox.style.width = "0px";
}

function viewEditor() {
    // leftBox.style.width = (window.innerWidth - 15) + "px";
    leftBox.style.width = (wrapper.offsetWidth - 15) + "px";
}

function viewCenter() {
    leftBox.style.width = "50%";
}


function saveToFile(editor) {
	var HTMLtextToSave = editor.getValue();
    var HTMLhiddenElement = document.createElement("a");
    HTMLhiddenElement.href = 'data:attachment/text,' + encodeURIComponent(HTMLtextToSave);
    HTMLhiddenElement.target = '_blank';
    HTMLhiddenElement.download = 'edit.md';
    HTMLhiddenElement.click();
    contentSaved = true;
}
