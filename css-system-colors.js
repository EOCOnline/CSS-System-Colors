// logLevel is used to control the level of logging output: 0 = none, 1 = some, 2 = all
const logLevel = 1;
const sourceJson = "css-system-colors.json";

document.addEventListener("DOMContentLoaded", function () {
  if (logLevel > 1) console.clear();
  if (logLevel > 2) console.log("DOM fully loaded and parsed");

  contrastValue = document.getElementById('syscolors-contrast-value');
  syscolorsContrast = document.getElementById("syscolors-contrast");
  syscolorsContainer = document.getElementById("syscolors-container");

  // duplicate the light theme to dark theme
  let duplicateElement = document.getElementById("syscolors-demo-light").cloneNode(true);
  duplicateElement.id = "syscolors-demo-dark";
  duplicateElement.class = "syscolors-dark";
  document.getElementById("syscolors-demo").appendChild(duplicateElement);
  document.querySelector("#syscolors-demo-light H2 .syscolors-demo-mode").innerText = "Light";
  document.querySelector("#syscolors-demo-dark H2 .syscolors-demo-mode").innerText = "Dark";

  updateContrast({ value: 95 });
  readSystemColors();   // This is where it all starts!
});

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
  readSystemColors();
}

function resetWebPage() {
  currentColorsJson = { "info": {}, "currentColors": [] };
  deprecatedColorsJson = { "info": {}, "deprecatedColors": [] };

  document.getElementById("syscolors-grid-light").innerHTML = "";
  if (document.getElementById("syscolors-grid-dark")) document.getElementById("syscolors-grid").removeChild(document.getElementById("syscolors-grid-dark"))

  document.getElementById("syscolors-deprecated-light").innerHTML = "";
  if (document.getElementById("syscolors-deprecated-dark")) document.getElementById("syscolors-deprecated-grid").removeChild(document.getElementById("syscolors-deprecated-dark"))

  document.getElementById("syscolors-demo-light").innerHTML = "";
  if (document.getElementById("syscolors-demo-dark")) document.getElementById("syscolors-demo").removeChild(document.getElementById("syscolors-demo-dark"))
}


/******************************************* 
 * 
 * Main Action Flow™ are these routines!
 */

// Read JSON File with system colors
async function readSystemColors() {
  try {
    // avoid CORS errors when reading a local file!
    const response = await fetch(sourceJson);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const json = await response.json();
    processJson(json);
  } catch (error) {
    console.error("Fetch error: " + error.message);
  }
}


let currentColorsJson = { "info": {}, "currentColors": [] };
let deprecatedColorsJson = { "info": {}, "deprecatedColors": [] };

// Process the JSON file with system colors
function processJson(json) {
  if (logLevel > 1) console.log("Processing JSON");
  console.log("%c" + "Read system colors file", "color:aqua;font-weight:bold;");

  if (json.info) {
    json.info.timeStamp = new Date().toLocaleString();
    json.info.userAgent = navigator.userAgent;
  } else {
    console.error("No info object in JSON file!");
  }
  document.getElementById("syscolors-user-agent").innerText = navigator.userAgent;

  console.log("currentColors: " + json.currentColors.length);
  document.getElementById("syscolors-current-summary").innerText = "System Colors (" + json.currentColors.length + ")";
  json.currentColors = generateSystemColors(json.currentColors, "syscolors-grid-light");

  // duplicate light theme to dark theme
  let duplicateElement = document.getElementById("syscolors-grid-light").cloneNode(true);
  duplicateElement.id = "syscolors-grid-dark";
  duplicateElement.class = "syscolors-dark";
  document.getElementById("syscolors-grid").appendChild(duplicateElement);
  document.querySelector("#syscolors-grid-light H2 .syscolors-grid-mode").innerText = "Light";
  document.querySelector("#syscolors-grid-dark H2 .syscolors-grid-mode").innerText = "Dark";

  // save the JSON data for download
  currentColorsJson.info = structuredClone(json.info);
  currentColorsJson.currentColors = structuredClone(json.currentColors);


  // & again for the Deprecated Color Grid...
  console.log("deprecatedColors: " + json.deprecatedColors.length);
  document.getElementById("syscolors-deprecated-summary").innerText = "Deprecated System Colors (" + json.deprecatedColors.length + ")";
  json.deprecatedColors = generateSystemColors(json.deprecatedColors, "syscolors-deprecated-light");

  // duplicate light theme to dark theme
  duplicateElement = document.getElementById("syscolors-deprecated-light").cloneNode(true);
  duplicateElement.id = "syscolors-deprecated-dark";
  duplicateElement.class = "syscolors-dark";
  document.getElementById("syscolors-deprecated-grid").appendChild(duplicateElement);
  document.querySelector("#syscolors-deprecated-light H2 .syscolors-grid-mode").innerText = "Light";
  document.querySelector("#syscolors-deprecated-dark H2 .syscolors-grid-mode").innerText = "Dark";

  // save the JSON data for download
  deprecatedColorsJson.info = structuredClone(json.info);
  deprecatedColorsJson.deprecatedColors = structuredClone(json.deprecatedColors);
}


// Process a list of system-colors: get RGBA values for each named color, then create its HTML card to display
function generateSystemColors(systemColorSet, elementID) {
  console.table(systemColorSet);
  let i = 0;
  if (!systemColorSet) {
    console.error("No systemColorSet object!");
    return;
  } else {
    for (const index of Object.keys(systemColorSet)) {
      // NOTE: As I read the spec, prefixing with system- should work, but doesn't
      // let color = "system-" + systemColorSet[index].color 
      let color = systemColorSet[index].color;
      let RGBA = nameToRgba(color);
      if (logLevel > 1) console.log("RGBA of " + color + " is " + RGBA);
      systemColorSet[index].rgba = RGBA;

      createColorCards(systemColorSet, index, elementID, RGBA);
      i++;
    }
    if (logLevel > 1) console.log("Processed " + i + " colors.");
    return systemColorSet;
  }
}


const clickText = "&nbsp; &nbsp; (Click to copy)";
const clickedText = "&nbsp; &nbsp; (Copied!)";

// Build up an HTML card for each color & attach to the DOM
function createColorCards(systemColorSet, index, elementID, RGBA) {

  let nameSpan = document.createElement('span');
  nameSpan.className = "syscolors-color-span";
  nameSpan.innerHTML = systemColorSet[index].color;

  let descSpan = document.createElement('span');
  descSpan.className = "syscolors-desc-span";
  descSpan.innerHTML = " &mdash; " + systemColorSet[index].desc;

  let rgbaSpan = document.createElement('span');
  rgbaSpan.className = "syscolors-rgba-span";
  rgbaSpan.innerHTML = " [" + RGBA + "]";

  let tooltipSpan = document.createElement('span');
  tooltipSpan.className = "syscolors-tooltip";
  tooltipSpan.id = "syscolors-tooltip-" + index;
  tooltipSpan.innerHTML = nameSpan.outerHTML + "<br/>" + descSpan.outerHTML + "<br/>" + rgbaSpan.outerHTML + clickText;
  tooltipSpan.addEventListener('click', function () { copyTextToClipboard(nameSpan.innerText + descSpan.innerText + rgbaSpan.innerText, tooltipSpan.id); });

  let cardDiv = document.createElement('div');
  cardDiv.className = "syscolors-card";
  cardDiv.style.backgroundColor = systemColorSet[index].color;

  // BUG: Use system colors here?! Or rerun for dark grids...
  cardDiv.style.color = getContrastingColor(RGBA[0], RGBA[1], RGBA[2]);

  cardDiv.appendChild(nameSpan);
  cardDiv.appendChild(descSpan);
  cardDiv.appendChild(rgbaSpan);
  cardDiv.appendChild(tooltipSpan);

  document.getElementById(elementID).appendChild(cardDiv);
}


/******************************************* 
 * 
 * Color functions
 */

// TODO: get contrasting colors (not just black/white) with all-css strategy: https://css-tricks.com/methods-contrasting-text-backgrounds/ & https://codepen.io/thebabydino/pen/JNWqLL

// from: http://stackoverflow.com/a/1855903/186965  ONLY returns black or white!
function getContrastingColor(r, g, b) {
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
  let colorModeElement = document.querySelector("#syscolors-lightdark");
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