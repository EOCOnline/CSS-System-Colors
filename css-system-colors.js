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

  contrastValueId = document.getElementById('syscolors-contrast-value');
  syscolorsContrast = document.getElementById("syscolors-contrast");
  syscolorsContainer = document.getElementById("syscolors-outer-container");
  updateContrast({ value: 97.5 });

  cloneLightPanel("syscolors-demo-light", "syscolors-demo-dark", "H3 .syscolors-demo-mode");
  document.getElementById("syscolors-demo-light").getElementsByClassName("uniqueUrl")[0].href = "https://eoc.online/?v=" + new Date().getTime();
  document.getElementById("syscolors-demo-dark").getElementsByClassName("uniqueUrl")[0].href = "https://eoc.online/?d=" + new Date().getTime();
  setJsColorPicker();

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

  processJson(systemColorsJson);
});

/**
 * #region: System Colors JSON Data
 * systemColorsJson contains the system colors data from the standard.
 * 'systemColorsJson.info' contains metadata about the colors.
 * 'systemColorsJson.currentColors' contains the current system color array.
 * '.systemColorsJson.deprecatedColors' contains the deprecated system color array.
 * Reading this from a file is problematic due to CORS issues.
 */
let systemColorsJson =
{
  "info": {
    "copyright": "Created by eoc.online CSS System Colors tool: https://github.com/eoconline/css-system-colors"
  },
  "currentColors": [
    {
      "color": "AccentColor",
      "desc": "Background of accented user interface controls.",
      "category": "interface"
    },
    {
      "color": "AccentColorText",
      "desc": "Text of accented user interface controls.",
      "category": "interface"
    },
    {
      "color": "ActiveText",
      "desc": "Text in active links. For light backgrounds, traditionally red.",
      "category": "links"
    },
    {
      "color": "ButtonBorder",
      "desc": "The base border color for push buttons.",
      "category": "input-button"
    },
    {
      "color": "ButtonFace",
      "desc": "The face background color for push buttons.",
      "category": "input-button"
    },
    {
      "color": "ButtonText",
      "desc": "Text on push buttons.",
      "category": "input-button"
    },
    {
      "color": "Canvas",
      "desc": "Background of application content or documents.",
      "category": "general"
    },
    {
      "color": "CanvasText",
      "desc": "Text in application content or documents.",
      "category": "general"
    },
    {
      "color": "Field",
      "desc": "Background of input fields.",
      "category": "input"
    },
    {
      "color": "FieldText",
      "desc": "Text in input fields.",
      "category": "input"
    },
    {
      "color": "GrayText",
      "desc": "Disabled text. (Often, but not necessarily, gray.)",
      "category": "general"
    },
    {
      "color": "Highlight",
      "desc": "Background of selected text, for example from : :selection.",
      "category": "selection"
    },
    {
      "color": "HighlightText",
      "desc": "Text of selected text.",
      "category": "selection"
    },
    {
      "color": "LinkText",
      "desc": "Text in non-active, non-visited links. For light backgrounds, traditionally blue.",
      "category": "links"
    },
    {
      "color": "Mark",
      "desc": "Background of text that has been specially marked (such as by the HTML mark element).",
      "category": "general"
    },
    {
      "color": "MarkText",
      "desc": "Text that has been specially marked (such as by the HTML mark element).",
      "category": "general"
    },
    {
      "color": "SelectedItem",
      "desc": "Background of selected items, for example a selected checkbox.",
      "category": "selection"
    },
    {
      "color": "SelectedItemText",
      "desc": "Text of selected items.",
      "category": "selection"
    },
    {
      "color": "VisitedText",
      "desc": "Text in visited links. For light backgrounds, traditionally purple.",
      "category": "links"
    }
  ],
  "deprecatedColors": [
    {
      "color": "ActiveBorder",
      "desc": "Active window border. Same as ButtonBorder",
      "category": "window"
    },
    {
      "color": "ActiveCaption",
      "desc": "Active window caption. Same as Canvas",
      "category": "window"
    },
    {
      "color": "AppWorkspace",
      "desc": "Background color of multiple document interface. Same as Canvas",
      "category": "MDI"
    },
    {
      "color": "Background",
      "desc": "Desktop background. Same as Canvas.",
      "category": "window"
    },
    {
      "color": "ButtonHighlight",
      "desc": "The color of the border facing the light source for 3-D elements that appear 3-D due to one layer of surrounding border. Same as ButtonFace.",
      "category": "input-button"
    },
    {
      "color": "ButtonShadow",
      "desc": "The color of the border away from the light source for 3-D elements that appear 3-D due to one layer of surrounding border. Same as ButtonFace.",
      "category": "input-button"
    },
    {
      "color": "CaptionText",
      "desc": "Text in caption, size box, and scrollbar arrow box. Same as CanvasText.",
      "category": "window"
    },
    {
      "color": "InactiveBorder",
      "desc": "Inactive window border. Same as ButtonBorder.",
      "category": "window"
    },
    {
      "color": "InactiveCaption",
      "desc": "Inactive window caption. Same as Canvas.",
      "category": "window"
    },
    {
      "color": "InactiveCaptionText",
      "desc": "Color of text in an inactive caption. Same as GrayText.",
      "category": "window"
    },
    {
      "color": "InfoBackground",
      "desc": "Background color for tooltip controls. Same as Canvas.",
      "category": "tooltip"
    },
    {
      "color": "InfoText",
      "desc": "Text color for tooltip controls. Same as CanvasText.",
      "category": "tooltip"
    },
    {
      "color": "Menu",
      "desc": "Menu background. Same as Canvas.",
      "category": "window"
    },
    {
      "color": "MenuText",
      "desc": "Text in menus. Same as CanvasText.",
      "category": "window"
    },
    {
      "color": "Scrollbar",
      "desc": "Scroll bar gray area. Same as Canvas.",
      "category": "window"
    },
    {
      "color": "ThreeDDarkShadow",
      "desc": "The color of the darker (generally outer) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonBorder.",
      "category": "3D"
    },
    {
      "color": "ThreeDFace",
      "desc": "The face background color for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonFace.",
      "category": "3D"
    },
    {
      "color": "ThreeDHighlight",
      "desc": "The color of the lighter (generally outer) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonBorder.",
      "category": "3D"
    },
    {
      "color": "ThreeDLightShadow",
      "desc": "The color of the darker (generally inner) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonBorder.",
      "category": "3D"
    },
    {
      "color": "ThreeDShadow",
      "desc": "The color of the lighter (generally inner) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonBorder.",
      "category": "3D"
    },
    {
      "color": "Window",
      "desc": "Window background. Same as Canvas.",
      "category": "window"
    },
    {
      "color": "WindowFrame",
      "desc": "Window frame. Same as ButtonBorder.",
      "category": "window"
    },
    {
      "color": "WindowText",
      "desc": "Text in windows. Same as CanvasText.",
      "category": "window"
    }
  ]
};

/**************************************
 * Create the System Colors panels (both tables & grids)
 */

// These save JSON data for possible downloading
let currentColorsJson = { "info": {}, "currentColors": [] };
let deprecatedColorsJson = { "info": {}, "deprecatedColors": [] };

// Create the display panels, with some JSON pre-processing
function processJson(json) {
  console.log("%c" + "Read system colors file", "color:aqua;font-weight:bold;");
  try {
    updateJsonInfo(json);
    document.getElementById("syscolors-user-agent").innerText = navigator.userAgent;
    sortColors(json);
    generateColorTables(json);
    generateColorGrids(json);
  } catch (error) {
    console.error("Error building the color panels: " + error.message);
  }
}

function updateJsonInfo(json) {
  if (json.info) {
    json.info.timeStamp = new Date().toLocaleString();
    json.info.userAgent = navigator.userAgent;
  } else {
    console.error("No info object in JSON file!");
  }
}

function sortColors(json) {
  if (sortByCategory) {
    json.currentColors.sort((a, b) => (a.category > b.category) ? 1 : -1);
    json.deprecatedColors.sort((a, b) => (a.category > b.category) ? 1 : -1);
  } else {
    json.currentColors.sort((a, b) => (a.color > b.color) ? 1 : -1);
    json.deprecatedColors.sort((a, b) => (a.color > b.color) ? 1 : -1);
  }
}

// These also trigger updating the Json with an RGBA key.
function generateColorTables(json) {
  generateSystemColors(json.currentColors, "syscolors-table");
  generateSystemColors(json.deprecatedColors, "syscolors-deprecated-table");
}

function generateColorGrids(json) {
  console.log("currentColors: " + json.currentColors.length);
  document.getElementById("syscolors-current-summary").innerText = "System Color (" + json.currentColors.length + ") Grid";
  generateSystemColors(json.currentColors, "syscolors-grid-light");
  json.currentColors = generateSystemColors(json.currentColors, "syscolors-grid-dark");

  // save the JSON data for download
  currentColorsJson.info = structuredClone(json.info);
  currentColorsJson.currentColors = structuredClone(json.currentColors);

  console.log("deprecatedColors: " + json.deprecatedColors.length);
  document.getElementById("syscolors-deprecated-summary").innerText = "Deprecated System Color (" + json.deprecatedColors.length + ") Grid";
  generateSystemColors(json.deprecatedColors, "syscolors-deprecated-light");
  json.deprecatedColors = generateSystemColors(json.deprecatedColors, "syscolors-deprecated-dark");

  deprecatedColorsJson.info = structuredClone(json.info);
  deprecatedColorsJson.deprecatedColors = structuredClone(json.deprecatedColors);
}


// Process a list of system-colors, creating HTML cards for display
function generateSystemColors(systemColorSet, elementID) {
  if (logLevel > 2) console.table(systemColorSet);

  if (!systemColorSet) {
    console.error("No systemColorSet object!");
    return;
  }

  let i = 0;
  for (const index of Object.keys(systemColorSet)) {
    i++;
    if (elementID === "syscolors-table") {
      createColorRow(systemColorSet, index, "syscolors-table");
    } else if (elementID === "syscolors-deprecated-table") {
      createColorRow(systemColorSet, index, "syscolors-deprecated-table");
    } else {
      createColorCard(systemColorSet, index, elementID);
    }
  }
  if (logLevel > 1) console.log("Processed " + i + " colors.");
  return systemColorSet;
}