/******************************************* 
 * 
 * Main Action Flow™: these routines!
 */

// logLevel sets debug output: 0 = none, 1 = some, 3 = all
const logLevel = 1;
const sourceJson = "css-system-colors.json";
let hueValue = 222;
let contrastValueId;
let syscolorsContrast;
let syscolorsContainer;

document.addEventListener("DOMContentLoaded", function () {
  if (logLevel > 1) console.clear();
  if (logLevel > 2) console.log("DOM fully loaded and parsed");
  //if (logLevel > 2) setTimeout(() => { document.location.reload(); }, 5 * 1000); // reload page every 5 seconds while editing/debugging
  // use instead: <meta http-equiv="refresh" content="5"> in the head section

  contrastValueId = document.getElementById('syscolors-contrast-value');
  syscolorsContrast = document.getElementById("syscolors-contrast");
  syscolorsContainer = document.getElementById("syscolors-outer-container");
  updateContrast({ value: 97.5 });

  buildClassPanel();
  buildTableAndGridPanels();
  buildDemoPanels();
  buildHuePanel();
});


/**************************************
 * Create the System Colors panels (both tables & grids)
 */

function buildClassPanel() {
  classTable.grouped.forEach(group => {
    document.getElementById(`syscolors-class-grouped`).appendChild(
      generateClassCard(group));
  });

  classTable.individual.forEach(group => {
    document.getElementById(`syscolors-class-individual`).appendChild(
      generateClassCard(group));
  });
}

// This preserves JSON data - with RGBA values - for downloading
let downloadableJson; // = { "info": {}, "currentColors": [], "deprecatedColors": [] };

// Also called after resetWebPage: i.e., changing sort order/color mode
function buildTableAndGridPanels() {
  downloadableJson = structuredClone(systemColorsJson);
  downloadableJson.info.timeStamp = new Date().toLocaleString();
  downloadableJson.info.userAgent = navigator.userAgent;
  document.getElementById("syscolors-user-agent").innerText = navigator.userAgent;

  sortColors();

  // Generate Color Tables
  for (const index of Object.keys(downloadableJson.currentColors)) {
    createTableCard(downloadableJson.currentColors, index, "syscolors-table");
  }
  for (const index of Object.keys(downloadableJson.deprecatedColors)) {
    createTableCard(downloadableJson.deprecatedColors, index, "syscolors-deprecated-table");
  }

  generateGridPanels();
}

function sortColors() {
  if (sortByCategory) {
    downloadableJson.currentColors.sort((a, b) => (a.category > b.category) ? 1 : -1);
    downloadableJson.deprecatedColors.sort((a, b) => (a.category > b.category) ? 1 : -1);
  } else {
    downloadableJson.currentColors.sort((a, b) => (a.color > b.color) ? 1 : -1);
    downloadableJson.deprecatedColors.sort((a, b) => (a.color > b.color) ? 1 : -1);
  }
}

// This updates the downloadableJson with an RGBA key, in addition to creating HTML cards
function generateGridPanels() {
  document.getElementById("syscolors-grid-title").innerText = "System Color (" + downloadableJson.currentColors.length + ") Grid";
  for (const index of Object.keys(downloadableJson.currentColors)) {
    createGridCard(downloadableJson.currentColors, index, "syscolors-grid-light");
    createGridCard(downloadableJson.currentColors, index, "syscolors-grid-dark");
  }

  document.getElementById("syscolors-deprecated-title").innerText = "Deprecated System Color (" + downloadableJson.deprecatedColors.length + ") Grid";
  for (const index of Object.keys(downloadableJson.deprecatedColors)) {
    createGridCard(downloadableJson.deprecatedColors, index, "syscolors-deprecated-light");
    createGridCard(downloadableJson.deprecatedColors, index, "syscolors-deprecated-dark");
  }
}

function buildDemoPanels() {
  cloneLightPanel("syscolors-demo-light", "syscolors-demo-dark", "H3 .syscolors-demo-mode");
  document.getElementById("syscolors-demo-light").getElementsByClassName("uniqueUrl")[0].href = "https://eoc.online/?v=" + new Date().getTime();
  document.getElementById("syscolors-demo-dark").getElementsByClassName("uniqueUrl")[0].href = "https://eoc.online/?d=" + new Date().getTime();
  setJsColorPicker();
}


function buildHuePanel() {
  cloneLightPanel("syscolors-hue-light", "syscolors-hue-dark", "H3 .syscolors-hue-mode");
  const hueSlider = document.querySelector('#hueSlider');
  const hueDemo = document.querySelector("#syscolors-hue-demo")
  hueSlider.addEventListener("input", () => {
    hueDemo.style.setProperty("--hue", hueSlider.value);
    document.querySelectorAll(".hueValue").forEach((element) => {
      element.innerText = hueSlider.value;
    });
    if (logLevel > 2) console.log("hueSlider.value set to " + hueSlider.value);
  });
}