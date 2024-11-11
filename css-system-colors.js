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

let contrastValue = document.getElementById('syscolors-contrast-value');
function updateContrast(el) {
  let contrast = el.value;
  // set root style to have filter: contrast(80%);
  document.documentElement.style.setProperty('--contrast', contrast);
  document.querySelector("#syscolors-container").style.filter = 'contrast(' + contrast + '%)';
  document.querySelector("#syscolors-contrast").value = contrast;
  document.querySelector("#syscolors-contrast-value").innerText = contrast;
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
  let currentColorsJson = {};
  let deprecatedColorsJson = {};
  document.getElementById("syscolors-grid").innerHTML = "";
  document.getElementById("syscolors-deprecated-grid").innerHTML = "";

  readSystemColors();
}

// Broken, but recommended method!!!
// get 
async function readSystemColorsBroken() {
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
  // avoid CORS errors when reading a local file!
  fetch(sourceJson)
    .then(response => {
      if (!response.ok) {
        throw new Error("Network response was not ok " + response.statusText);
      }
      return response.json();
    })
    .then(json => {
      processJson(json);
    })
    .catch(error => {
      console.error("Fetch error: " + error.message); //BUG: Fetch error: can't convert undefined to object
    });
}



let currentColorsJson = {};
let deprecatedColorsJson = {};

function processJson(json) {
  if (logLevel > 1) console.log("Processing JSON");
  console.log("%c" + "Read system colors file", "color:aqua;font-weight:bold;");

  json.info.timeStamp = new Date().toLocaleString();
  json.info.useragent = navigator.userAgent;
  document.getElementById("syscolors-user-agent").innerText = navigator.userAgent;

  console.log("currentColors: " + json.currentColors.length);
  document.getElementById("syscolors-current-summary").innerText = "System Colors (" + json.currentColors.length + ")";
  debugger;
  json.currentColors = generateSystemColors(json.currentColors, "syscolors-grid");



  // OK to use shallow copy, as we're not copying objects, just strings & numbers - with current JSON structure
  let Json1 = { ...json.info, currentColors: json.currentColors };
  let Json2 = { ...json.info, currentColors: [...json.currentColors] };
  // BUG: gets: TypeError: can't access property Symbol.iterator, json.currentColors is undefined
  let currentColorsJson3 = { ...json.info, currentColors: [...json.currentColors] };
  let currentColorsJson1 = { ...json.info, ...json.currentColors };

  // This works though not as recommended!
  currentColorsJson = Object.assign({}, json.info, json.currentColors);

  console.log("deprecatedColors: " + json.deprecatedColors.length);
  document.getElementById("syscolors-deprecated-summary").innerText = "Deprecated System Colors (" + json.deprecatedColors.length + ")";


  json.deprecatedColors = generateSystemColors(json.deprecatedColors, "syscolors-deprecated-grid");

  // Broken, but recommended method!!!
  // deprecatedColorsJson = { ...json.info, deprecatedColors: [...json.deprecatedColors] };

  // Works
  deprecatedColorsJson = Object.assign({}, json.info, generateSystemColors(json.deprecatedColors, "syscolors-deprecated-grid", json.deprecatedColors));

  // setupDownload(currentColorsJson);
  // setupDownload(deprecatedColorsJson, 'deprecated');
}

// Build the HTML grid for display AND get the current RGBA values
// Process a list of system-colors: displaying it & building up JSON object with RGBA values for this userAgent
function generateSystemColors(systemColorSet, elementID, newJson) {
  console.table(systemColorSet);
  console.log("Self reported navigator.userAgent: '" + navigator.userAgent + "'");
  let i = 0;
  for (const index of Object.keys(systemColorSet)) { // BUG: gets TypeError: can't convert undefined to object
    let RGBA = nameToRgba(systemColorSet[index].color);
    if (logLevel > 1) console.log("RGBA of " + systemColorSet[index].color + " is " + RGBA);
    systemColorSet[index].rgba = RGBA;

    createColorCards(systemColorSet, index, elementID, RGBA);
    i++;
  }
  if (logLevel > 1) console.log("Processed " + i + " colors.");
  return newJson;
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

// Write a named color to a canvas and read back the RGBA value
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

function nameToRgba(name) {
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = name;
  context.fillRect(0, 0, 1, 1);
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
    tooltip.innerHTML = tooltip.innerHTML.replace(clickText, clickedText);
  }, function (err) {
    console.error('Async: Could not copy text: ', err);
  });
}


/******************************************
 * 
 * Download JSON file
 */

// NOTE: UNUSED!
// https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
function setupDownload(json, validity = "current") {
  let storageObj = json;
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storageObj));
  let dlAnchorElem = document.getElementById('syscolors-download-' + validity);

  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", createFileName("CSS_System_Colors2"));
  // dlAnchorElem.click(); // auto-download: user doesn't even have to click the button!
  return;
}

function createFileName(baseName) {
  let date = new Date().toISOString().slice(0, 10);
  let colorMode = document.querySelector("#syscolors-lightdark").value;
  let userAgentSummary = navigator.userAgent.replace(/[^a-zA-Z0-9]/g, '');  // TODO: shorten this!
  let fileName = baseName + "_" + date + "_" + colorMode + "_" + userAgentSummary + ".json";
  console.log("Download fileName: " + fileName);
  return fileName;
}

function downloadCurrentColors() {
  //let curColor = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentColorsJson));
  let curColor = JSON.stringify(currentColorsJson);
  debugger;
  downloadJSON(curColor, createFileName("CSS_System_Colors"));
}

function downloadDeprecatedColors() {
  //let depColor = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deprecatedColorsJson));
  let depColor = JSON.stringify(deprecatedColorsJson);
  downloadJSON(depColor, createFileName("CSS_Deprecated_Colors"));
}

// https://javascript.plainenglish.io/how-to-trigger-download-of-a-file-via-an-html-button-using-javascript-55f53a4111ce
/*
const submit = document.getElementById('submitButton');
submit.addEventListener('click', function () {
  downloadJSON(data, 'CSS_System_Colors.json');
});
*/
function downloadJSON(data, filename) {
  // Convert the JSON data to a string
  var json = JSON.stringify(data);

  // Create a new Blob object with the JSON data and set its type
  var blob = new Blob([json], { type: 'application/json' });

  // Create a temporary URL for the file
  var url = URL.createObjectURL(blob);

  // Create a new link element with the download attribute set to the desired filename
  var link = document.createElement('a');
  link.setAttribute('download', filename);

  // Set the link's href attribute to the temporary URL
  link.href = url;

  // Simulate a click on the link to trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up the temporary URL and link element
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

};

