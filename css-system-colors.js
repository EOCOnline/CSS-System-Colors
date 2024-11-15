// logLevel is used to control the level of logging output: 0 = none, 1 = some, 2 = all
const logLevel = 1;
const sourceJson = "css-system-colors.json";

document.addEventListener("DOMContentLoaded", function () {
  if (logLevel > 1) console.clear();
  if (logLevel > 2) console.log("DOM fully loaded and parsed");

  contrastValue = document.getElementById('syscolors-contrast-value');
  syscolorsContrast = document.getElementById("syscolors-contrast");
  syscolorsContainer = document.getElementById("syscolors-container");

  cloneLightPanel("syscolors-demo-light", "syscolors-demo-dark", "H2 .syscolors-demo-mode");
  updateContrast({ value: 97.5 });
  fetchSystemColors();   // This is where it all starts!
});

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
 * Main Action Flow™: these routines!
 */

// fetch JSON File with system colors (i.e., if page is being 'served')
async function fetchSystemColors() {
  try {
    // avoid CORS errors when reading a local file!
    if (logLevel > 1) console.log("Fetching JSON file:" + sourceJson);
    const response = await fetch(sourceJson);
    if (!response.ok) {
      throw new Error("Network response was not ok " + response.statusText);
    }
    const json = await response.json();
    processJson(json);
  } catch (error) {
    console.error("Fetch error: " + error.message);
    console.error("Will use FileReader next, assuming html is a local file");
    try {
      const json = await readJSONFile(sourceJson);
      processJson(json);
    } catch (error) {
      console.error("FileReader error: " + error.message);
    }
  }
}

// read JSON File with system colors (i.e., if page is just being opened directly by a browser)
// BUG: Broken, probably with the new File statement
async function readSystemColors() {
  let file = new File([""], sourceJson, { type: "application/json" });// NOTE: suspect!
  readJSONFile(file).then(
    json => {
      console.log("%c" + "Read system colors file: " + file.name + " with " + file.size + " char", "color:maroon;font-weight:bold;");
      if (!validateJson(json)) {
        console.error("Invalid JSON: " + json);
        alert("Invalid JSON: " + json);
        return;
      }
      try {
        generateSystemColors(json);
      } catch (e) {
        console.error("Error building list of System Colors: " + e.message);
      }
    }
  ).catch(error => {
    console.error("Error reading JSON file: " + error.message);
    alert("Error reading JSON file (" + file.name + "): \n" + error.message);
  });
}

async function readJSONFile(file) {
  return new Promise((resolve, reject) => {
    let fileReader = new FileReader();
    fileReader.onload = event => {
      try {
        const jsonString = event.target.result;
        const json = JSON.parse(jsonString);
        resolve(json);
      } catch (error) {
        alert("Invalid JSON format: " + error.message);
        reject(new Error("Invalid JSON format"));
      }
    };
    fileReader.onerror = error => {
      reject(new Error(`Error reading file ${file.name}: ${error.message}`));
    };
    fileReader.readAsText(file);
  });
}


let currentColorsJson = { "info": {}, "currentColors": [] };
let deprecatedColorsJson = { "info": {}, "deprecatedColors": [] };

// Process the JSON file with system colors
function processJson(json) {
  if (logLevel > 1) console.log("Processing JSON");
  console.log("%c" + "Read system colors file", "color:aqua;font-weight:bold;");
  try {
    if (json.info) {
      json.info.timeStamp = new Date().toLocaleString();
      json.info.userAgent = navigator.userAgent;
    } else {
      console.error("No info object in JSON file!");
    }
    document.getElementById("syscolors-user-agent").innerText = navigator.userAgent;

    // Generate the System Colors 'Tables'
    generateSystemColors(json.currentColors, "syscolors-table");
    generateSystemColors(json.deprecatedColors, "syscolors-deprecated-table");


    // Generate the System Colors 'Grids'
    console.log("currentColors: " + json.currentColors.length);
    document.getElementById("syscolors-current-summary").innerText = "System Color (" + json.currentColors.length + ") Grid";
    //json.currentColors = 
    generateSystemColors(json.currentColors, "syscolors-grid-light");
    json.currentColors = generateSystemColors(json.currentColors, "syscolors-grid-dark");
    //document.getElementById("syscolors-grid-light").querySelector("H2 .syscolors-grid-mode").innerText = "Light";
    //document.getElementById("syscolors-grid-dark").querySelector("H2 .syscolors-grid-mode").innerText = "Dark";

    // cloneLightPanel("syscolors-grid-light", "syscolors-grid-dark", "H2 .syscolors-grid-mode");
    // save the JSON data for download
    currentColorsJson.info = structuredClone(json.info);
    currentColorsJson.currentColors = structuredClone(json.currentColors);


    // & again for the Deprecated Color Grid...
    console.log("deprecatedColors: " + json.deprecatedColors.length);
    document.getElementById("syscolors-deprecated-summary").innerText = "Deprecated System Color (" + json.deprecatedColors.length + ") Grid";
    // json.deprecatedColors = 
    generateSystemColors(json.deprecatedColors, "syscolors-deprecated-light");
    json.deprecatedColors = generateSystemColors(json.deprecatedColors, "syscolors-deprecated-dark");
    //document.getElementById("syscolors-deprecated-light").querySelector("H2 .syscolors-grid-mode").innerText = "Light";
    //document.getElementById("syscolors-deprecated-dark").querySelector("H2 .syscolors-grid-mode").innerText = "Dark";
    //cloneLightPanel("syscolors-deprecated-light", "syscolors-deprecated-dark", "H2 .syscolors-grid-mode");

    // save the JSON data for download
    deprecatedColorsJson.info = structuredClone(json.info);
    deprecatedColorsJson.deprecatedColors = structuredClone(json.deprecatedColors);
  } catch (error) {
    console.error("Error processing JSON: " + error.message);
  }
}


// Process a list of system-colors: get RGBA values for each named color, store in jSON object, then create its HTML card to display
function generateSystemColors(systemColorSet, elementID) {
  console.table(systemColorSet);
  let i = 0;
  if (!systemColorSet) {
    console.error("No systemColorSet object!");
    return;
  }

  // Sort colors by category (or leave as in the file: alphabetically)
  if (sortByCategory) systemColorSet.sort((a, b) => (a.category > b.category) ? 1 : -1);

  for (const index of Object.keys(systemColorSet)) {
    // NOTE: As I read the spec, prefixing with system- should work, but doesn't
    // let color = "system-" + systemColorSet[index].color 
    let color = systemColorSet[index].color;
    /*
    old plan was to draw into canvas element & read back color, but new way is to use getComputedStyle() which takes into account all CSS & styles in place...    
    let RGBA = nameToRgba(color);
    if (logLevel > 1) console.log("RGBA of " + color + " is " + RGBA);
    systemColorSet[index].rgba = RGBA;
*/

    if (elementID === "syscolors-table") {
      createColorRow(systemColorSet, index, "syscolors-table");
    } else {
      createColorCard(systemColorSet, index, elementID); //, RGBA);
    }

    i++;
  }
  if (logLevel > 1) console.log("Processed " + i + " colors.");
  return systemColorSet;
}


const clickText = "&nbsp; &nbsp; (Click to copy)";
const clickedText = "&nbsp; &nbsp; (Copied!)";

// Build up an HTML card for each color & attach to the DOM
function createColorCard(systemColorSet, index, elementID) {//}, RGBA) {

  let nameSpan = document.createElement('span');
  nameSpan.className = "syscolors-color-span";
  nameSpan.innerHTML = systemColorSet[index].color;

  let descSpan = document.createElement('span');
  descSpan.className = "syscolors-desc-span";
  descSpan.innerHTML = " &mdash; " + systemColorSet[index].desc;

  let categorySpan = document.createElement('span');
  categorySpan.className = "`syscolors-category-span`";
  categorySpan.innerHTML = " {" + systemColorSet[index].category + "} ";

  /*
  let rgbaSpan = document.createElement('span');
  rgbaSpan.className = "syscolors-rgba-span";
  rgbaSpan.innerHTML = " [" + RGBA + "]";
*/
  let tooltipSpan = document.createElement('span');
  tooltipSpan.className = "syscolors-tooltip";
  tooltipSpan.id = "syscolors-tooltip-" + index;
  tooltipSpan.innerHTML = nameSpan.outerHTML + "<br/>" + descSpan.outerHTML + "<br/>" + categorySpan.outerHTML //+ "<br/>" + rgbaSpan.outerHTML 
    + clickText;
  tooltipSpan.addEventListener('click', function () {
    copyTextToClipboard(nameSpan.innerText + descSpan.innerText + categorySpan.innerText //+ rgbaSpan.innerText
      , tooltipSpan.id);
  });

  let cardDiv = document.createElement('div');
  cardDiv.className = "syscolors-card";
  cardDiv.style.backgroundColor = systemColorSet[index].color;

  // BUG: Use system colors here?! Or rerun for dark grids...
  //cardDiv.style.color = getContrastingColor(RGBA[0], RGBA[1], RGBA[2]);

  cardDiv.appendChild(nameSpan);
  cardDiv.appendChild(descSpan);
  cardDiv.appendChild(categorySpan);
  //cardDiv.appendChild(rgbaSpan);
  cardDiv.appendChild(tooltipSpan);

  document.getElementById(elementID).appendChild(cardDiv);
}

// These cards  look more like rows of a table...
function createColorRow(systemColorSet, index, elementID) {

  let nameSpan = document.createElement('span');
  nameSpan.className = "syscolors-color-span";
  nameSpan.innerHTML = systemColorSet[index].color;
  let lightText = nameSpan.cloneNode(true);
  let darkText = nameSpan.cloneNode(true);

  let descSpan = document.createElement('span');
  descSpan.className = "syscolors-desc-span";
  descSpan.innerHTML = " &mdash; " + systemColorSet[index].desc;

  let categorySpan = document.createElement('span');
  categorySpan.className = "syscolors-category-span";
  // add attribute to span


  categorySpan.setAttribute("category", systemColorSet[index].category);
  categorySpan.innerHTML = systemColorSet[index].category.replace(/-/g, "<br/>");

  let tooltipSpan = document.createElement('span');
  tooltipSpan.className = "syscolors-tooltip";
  tooltipSpan.id = "syscolors-table-tooltip-" + index;
  tooltipSpan.innerHTML = nameSpan.outerHTML + "<br/>" + descSpan.outerHTML + "<br/>" + categorySpan.outerHTML + //"<br/>" + rgbaSpan.outerHTML 
    + clickText;
  tooltipSpan.addEventListener('click', function () {
    copyTextToClipboard(nameSpan.innerText + descSpan.innerText + categorySpan.innerText //+ rgbaSpan.innerText
      , tooltipSpan.id);
  });

  let cardDiv = document.createElement('div');
  cardDiv.className = "syscolors-row-card";
  cardDiv.appendChild(tooltipSpan);

  let textDiv = document.createElement('div');
  textDiv.className = "syscolors-row-text";
  textDiv.appendChild(categorySpan);
  textDiv.appendChild(nameSpan);
  textDiv.appendChild(descSpan);

  let lightDiv = document.createElement('div');
  lightDiv.className = "syscolors-row-light";
  lightDiv.style.backgroundColor = systemColorSet[index].color;
  lightDiv.appendChild(lightText);

  let darkDiv = document.createElement('div');
  darkDiv.className = "syscolors-row-dark";
  darkDiv.style.backgroundColor = systemColorSet[index].color;
  darkDiv.appendChild(darkText);

  cardDiv.appendChild(textDiv);
  cardDiv.appendChild(lightDiv);
  cardDiv.appendChild(darkDiv);

  document.getElementById(elementID).appendChild(cardDiv);

  // Update colors based on what the browser actually used. getComputedStyle() is an expensive operation BTW.
  nameSpan.innerHTML = systemColorSet[index].color;

  let colorLight = getComputedStyle(lightDiv).backgroundColor;
  let r = colorLight.match(/\d+/g)[0];
  let g = colorLight.match(/\d+/g)[1];
  let b = colorLight.match(/\d+/g)[2];
  lightDiv.style.color = getContrastingColor(r, g, b);
  r = parseInt(r).toString(16).padStart(2, '0');
  g = parseInt(g).toString(16).padStart(2, '0');
  b = parseInt(b).toString(16).padStart(2, '0');

  lightText.innerHTML = systemColorSet[index].color + "<br/>" + colorLight + "<br/>" + "#" + r + g + b;

  let colorDark = getComputedStyle(darkDiv).backgroundColor;
  r = colorDark.match(/\d+/g)[0];
  g = colorDark.match(/\d+/g)[1];
  b = colorDark.match(/\d+/g)[2];
  darkDiv.style.color = getContrastingColor(r, g, b);
  r = parseInt(r).toString(16).padStart(2, '0');
  g = parseInt(g).toString(16).padStart(2, '0');
  b = parseInt(b).toString(16).padStart(2, '0');
  darkText.innerHTML = systemColorSet[index].color + "<br/>" + colorDark + "<br/>" + "#" + r + g + b;
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
  let colorModeElement = document.querySelector("#syscolors-background");
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