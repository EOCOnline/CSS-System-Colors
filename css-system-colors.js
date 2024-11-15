/******************************************* 
 * 
 * Main Action Flow™: these routines!
 */

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


/**************************************
 * Get the JSON data with system colors from the local file
 */

// FETCH JSON file -- if this HTML is being 'served'
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

// READ JSON File -- if this HTML is being opened directly by a browser
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


/**************************************
 * Create the System Colors panels
 */
let currentColorsJson = { "info": {}, "currentColors": [] };
let deprecatedColorsJson = { "info": {}, "deprecatedColors": [] };

// Create the various panels for display, with some pre-processing of the JSON
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
    // save the JSON data for download
    currentColorsJson.info = structuredClone(json.info);
    currentColorsJson.currentColors = structuredClone(json.currentColors);

    // & again for the Deprecated Color Grid...
    console.log("deprecatedColors: " + json.deprecatedColors.length);
    document.getElementById("syscolors-deprecated-summary").innerText = "Deprecated System Color (" + json.deprecatedColors.length + ") Grid";
    // json.deprecatedColors = 
    generateSystemColors(json.deprecatedColors, "syscolors-deprecated-light");
    json.deprecatedColors = generateSystemColors(json.deprecatedColors, "syscolors-deprecated-dark");
    // save the JSON data for download
    deprecatedColorsJson.info = structuredClone(json.info);
    deprecatedColorsJson.deprecatedColors = structuredClone(json.deprecatedColors);
  } catch (error) {
    console.error("Error building the color panels: " + error.message);
  }
}


// Process a list of system-colors, creating HTML cards for display
function generateSystemColors(systemColorSet, elementID) {
  console.table(systemColorSet);
  let i = 0;
  if (!systemColorSet) {
    console.error("No systemColorSet object!");
    return;
  }

  // Sort colors by category (or leave as in the file: alphabetically)
  // TODO: This is happening more than once, do it in parent routine instead...
  if (sortByCategory) systemColorSet.sort((a, b) => (a.category > b.category) ? 1 : -1);

  for (const index of Object.keys(systemColorSet)) {
    // NOTE: As I read the spec, prefixing with system- should work, but doesn't
    // let color = "system-" + systemColorSet[index].color 
    let color = systemColorSet[index].color;

    if (elementID === "syscolors-table") {
      createColorRow(systemColorSet, index, "syscolors-table");
    } else if (elementID === "syscolors-deprecated-table") {
      createColorRow(systemColorSet, index, "syscolors-deprecated-table");
    } else {
      createColorCard(systemColorSet, index, elementID); //, RGBA);
    }

    i++;
  }
  if (logLevel > 1) console.log("Processed " + i + " colors.");
  return systemColorSet;
}