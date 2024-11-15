// This contains routines for the main program THAT ARE INCIDENTAL TO THE MAIN flow!

function cloneLightPanel(elementId, cloneId, spanSelector) {
    let light = document.getElementById(elementId);
    if (!light) {
        console.error("No element with ID: " + elementId);
        return;
    }
    let dark = light.cloneNode(true);
    dark.id = cloneId;
    dark.className = "syscolors-inner-container syscolors-dark";

    light.classList.add("syscolors-inner-container");
    light.classList.add("syscolors-light");

    let parent = light.parentNode;
    if (!parent) {
        console.error("No parent element found for element with ID: " + elementId);
        return;
    }
    if (logLevel > 1) console.log("Found Parent with ID: " + parent.id);
    parent.appendChild(dark);

    light.querySelector(spanSelector).innerText = "Light";
    dark.querySelector(spanSelector).innerText = "Dark";
    return dark;
}

let contrastValue;
let syscolorsContrast;
let syscolorsContainer;

function updateContrast(el) {
    const contrast = el.value;
    syscolorsContainer.style.filter = 'contrast(' + contrast + '%)';
    syscolorsContrast.value = contrast;
    contrastValue.innerText = contrast;
}

function setColor(el) {
    // Mostly handled by CSS
    resetWebPage();
    fetchSystemColors();
}

let sortByCategory = false;
function setSortOrder(val) {
    sortByCategory = val.checked;
    if (logLevel > 1) console.log("Sort by category: " + sortByCategory);
    resetWebPage();
    fetchSystemColors();
}

function resetWebPage() {
    currentColorsJson = { "info": {}, "currentColors": [] };
    deprecatedColorsJson = { "info": {}, "deprecatedColors": [] };

    saveMe = document.getElementsByClassName("syscolors-save-me")[0].cloneNode(true);
    //debugger;
    document.getElementById("syscolors-table").innerHTML = saveMe.outerHTML;

    document.getElementById("syscolors-grid-light").innerHTML = "";
    if (document.getElementById("syscolors-grid-dark")) document.getElementById("syscolors-grid").removeChild(document.getElementById("syscolors-grid-dark"))

    document.getElementById("syscolors-deprecated-light").innerHTML = "";
    if (document.getElementById("syscolors-deprecated-dark")) document.getElementById("syscolors-deprecated-grid").removeChild(document.getElementById("syscolors-deprecated-dark"))

    document.getElementById("syscolors-demo-light").innerHTML = "";
    if (document.getElementById("syscolors-demo-dark")) document.getElementById("syscolors-demo").removeChild(document.getElementById("syscolors-demo-dark"))
}





/******************************************* 
 * 
 * Color functions
 */

// TODO: get contrasting colors (not just black/white) with all-css strategy: https://css-tricks.com/methods-contrasting-text-backgrounds/ & https://codepen.io/thebabydino/pen/JNWqLL

// from: http://stackoverflow.com/a/1855903/186965  ONLY returns black or white!
function getContrastingColor(r, g, b) {
    //    console.error("Contrasting color of white (#000) is: " + getContrastingColor(0, 0, 0));
    //if (r == 0 && g == 0 && b == 0) return "white";

    // Counting the perceptive luminance
    // The formula for calculating luminance is based on the human eye's sensitivity to different colors.
    // The human eye favors green color, so the coefficients for red, green, and blue are 0.299, 0.587, and 0.114 respectively.
    var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (logLevel > 2) console.log("Perceptive luminance:" + a);
    return ((a < 0.5) ? 'black' : 'white');
}
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// Write a named color to a canvas and read back the RGBA value
function nameToRgba(name) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = name;
    context.fillRect(0, 0, 1, 1);
    const imageData = context.getImageData(0, 0, 1, 1).data;
    if (imageData.length === 4) {
        return imageData;
    } else {
        console.error('Invalid image data');
        return [0, 0, 0, 0]; // Return a default value
    }
    return context.getImageData(0, 0, 1, 1).data;
}


/*****************************
 * 
 *  Copy text to clipboard
 */

// From: https://github.com/DeanMarkTaylor/clipboard-test
function fallbackCopyTextToClipboard(text) {
    var textArea = document.createElement("textarea");
    textArea.value = text;

    // Avoid scrolling to bottom
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        var successful = document.execCommand('copy');
        /**
         * TODO: Experiment with this alternative to the deprecated ExecCommand:
         * navigator.clipboard
            .readText()
            .then(
              (clipText) => (document.querySelector(".editor").innerText += clipText),
            );
          * https://developer.mozilla.org/en-US/docs/Web/API/Document/execCommand
          * https://developer.mozilla.org/en-US/docs/Web/API/Clipboard_API
          */
        var msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}

function copyTextToClipboard(text, id) {
    if (!navigator.clipboard) {
        console.warn('Browser does not support clipboard, using old techniques!');
        fallbackCopyTextToClipboard(text);
        return;
    }
    navigator.clipboard.writeText(text).then(function () {
        console.log('Async: Copying to clipboard was successful!');
        let tooltip = document.getElementById(id);
        if (tooltip) {
            tooltip.innerHTML = tooltip.innerHTML.replace(clickText, clickedText);
        }
    }, function (err) {
        console.error('Could not copy text: ', err);
    });
}


/******************************************
 * 
 * Download JSON file
 */

function createFileName(baseName) {
    let date = new Date().toISOString().slice(0, 10);
    let colorModeElement = document.querySelector("#syscolors-page-mode");
    let colorMode = colorModeElement ? colorModeElement.value : "default";
    let userAgentSummary = navigator.userAgent.replace(/[^a-zA-Z0-9]/g, '');  // TODO: shorten this!
    let fileName = baseName + "_" + date + "_" + colorMode + "_" + userAgentSummary + ".json";
    console.log("Download fileName: " + fileName);
    return fileName;
}

function downloadCurrentColors() {
    downloadJSON(currentColorsJson, createFileName("CSS_System_Colors"));

}

function downloadDeprecatedColors() {
    downloadJSON(deprecatedColorsJson, createFileName("CSS_Deprecated_Colors"));
}

function downloadJSON(data, filename) {
    const json = JSON.stringify(data);
    const blob = new Blob([json], { type: 'application/json' });

    // Create a temporary URL for the file
    let url = URL.createObjectURL(blob);

    // Create a new link element
    const link = document.createElement('a');
    link.setAttribute('download', filename);
    link.href = url;

    // Simulate a click on the link to trigger the download
    document.body.appendChild(link);
    link.click();

    // Clean up the temporary URL and link element
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};