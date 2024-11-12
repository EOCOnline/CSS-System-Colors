// logLevel is used to control the level of logging output: 0 = none, 1 = some, 2 = all
const logLevel = 1;
const sourceJson = "css-system-colors.json";

document.addEventListener("DOMContentLoaded", function () {
  if (logLevel > 1) console.clear();
  if (logLevel > 1) console.log("DOM fully loaded and parsed");
  // set contrast to auto value
  updateContrast({ value: 95 });
  readSystemColors();
});

const contrastValue = document.getElementById('syscolors-contrast-value');
const syscolorsContrast = document.querySelector("#syscolors-contrast");
const syscolorsContainer = document.querySelector("#syscolors-container");

function updateContrast(el) {
  const contrast = el.value;
  // set root style to have filter: contrast(80%);
  document.documentElement.style.setProperty('--contrast', contrast);

  syscolorsContainer.style.filter = 'contrast(' + contrast + '%)';
  syscolorsContrast.value = contrast;
  contrastValue.innerText = contrast;
}

function setColorMode(el) {
  let mode = el.value;
  if (mode === "auto") {
    document.documentElement.style.removeProperty('--color-mode');
  } else {
    //document.documentElement.style.setProperty('--color-mode', mode);
    //document.querySelector("#syscolors-color-mode").value = mode;
  }
  if (logLevel) console.log("Color mode set to: " + mode);
  // TODO: I believe we HAVE to rerun color table, as RGBA values likely change with change in color mode!
  clearWebPage();
}

function clearWebPage() {
  currentColorsJson = { "info": {}, "currentColors": [] };
  deprecatedColorsJson = { "info": {}, "deprecatedColors": [] };
  document.getElementById("syscolors-grid").innerHTML = "";
  document.getElementById("syscolors-deprecated-grid").innerHTML = "";

  readSystemColors();
}

async function readSystemColors_BROKEN_UNUSED() {
  try {
    // avoid CORS errors when reading a local file!
    const response = await fetch(sourceJson);//, { mode: 'no-cors' }
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const json = await response.json();
    // BUG: Following gets: "Fetch error: NetworkError when attempting to fetch resource."
    processJson(json);
  } catch (error) {
    console.error("Fetch error: " + error.message);
  }
}
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
  json.currentColors = generateSystemColors(json.currentColors, "syscolors-grid");
  currentColorsJson.info = structuredClone(json.info);
  currentColorsJson.currentColors = structuredClone(json.currentColors);

  console.log("deprecatedColors: " + json.deprecatedColors.length);
  document.getElementById("syscolors-deprecated-summary").innerText = "Deprecated System Colors (" + json.deprecatedColors.length + ")";
  json.deprecatedColors = generateSystemColors(json.deprecatedColors, "syscolors-deprecated-grid");
  deprecatedColorsJson.info = structuredClone(json.info);
  deprecatedColorsJson.deprecatedColors = structuredClone(json.deprecatedColors);
}

// Build the HTML grid for display AND get the current RGBA values
// Process a list of system-colors: displaying it & building up JSON object with RGBA values for this userAgent
function generateSystemColors(systemColorSet, elementID) {
  console.table(systemColorSet);
  let i = 0;
  if (!systemColorSet) {
    console.error("No systemColorSet object!");
    return;
  } else {
    for (const index of Object.keys(systemColorSet)) {
      let RGBA = nameToRgba(systemColorSet[index].color);
      if (logLevel > 1) console.log("RGBA of " + systemColorSet[index].color + " is " + RGBA);
      systemColorSet[index].rgba = RGBA;

      createColorCards(systemColorSet, index, elementID, RGBA);
      i++;
    }
    if (logLevel > 1) console.log("Processed " + i + " colors.");
    return systemColorSet;
  }
}

let clickText = "&nbsp; &nbsp; (Click to copy)";
let clickedText = "&nbsp; &nbsp; (Copied!)";
// Create an HTML card for each color
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
  //let curColor = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentColorsJson));
  let curColor = JSON.stringify(currentColorsJson);
  downloadJSON(curColor, createFileName("CSS_System_Colors"));
}

function downloadDeprecatedColors() {
  //let depColor = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deprecatedColorsJson));
  let depColor = JSON.stringify(deprecatedColorsJson);
  downloadJSON(depColor, createFileName("CSS_Deprecated_Colors"));
}

function downloadJSON(data, filename) {
  const json = JSON.stringify(data);
  // Create a new Blob object with the JSON data and set its type
  let blob = new Blob([json], { type: 'application/json' });

  // Create a temporary URL for the file
  var url = URL.createObjectURL(blob);

  // Create a new link element with the download attribute set to the desired filename
  const link = document.createElement('a');
  // TODO: link.setAttribute('download', filename);
  // Set the link's href attribute to the temporary URL
  link.href = url;

  // Simulate a click on the link to trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up the temporary URL and link element
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};