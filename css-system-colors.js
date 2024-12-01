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

  processJson();
});

/**
 * #region: System Colors JSON Data
 * systemColorsJson contains the system colors data from the standard.
 * 'systemColorsJson.info' contains metadata about the colors.
 * 'systemColorsJson.currentColors' contains the current system color array.
 * '.systemColorsJson.deprecatedColors' contains the deprecated system color array.
 * Reading this from a file is problematic due to CORS issues.
 * This global structure is updated by the 'processJson' function.
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
function processJson() {
  console.log("%c" + "Read system colors file", "color:aqua;font-weight:bold;");
  try {
    systemColorsJson.info.timeStamp = new Date().toLocaleString();
    systemColorsJson.info.userAgent = navigator.userAgent;
    document.getElementById("syscolors-user-agent").innerText = navigator.userAgent;
    sortColors();
    generateColorTables();
    generateColorGrids();
  } catch (error) {
    console.error("Error building the color panels: " + error.message);
  }
}

function sortColors() {
  if (sortByCategory) {
    systemColorsJson.currentColors.sort((a, b) => (a.category > b.category) ? 1 : -1);
    systemColorsJson.deprecatedColors.sort((a, b) => (a.category > b.category) ? 1 : -1);
  } else {
    systemColorsJson.currentColors.sort((a, b) => (a.color > b.color) ? 1 : -1);
    systemColorsJson.deprecatedColors.sort((a, b) => (a.color > b.color) ? 1 : -1);
  }
}

function generateColorTables() {
  generateSystemColors(systemColorsJson.currentColors, "syscolors-table");
  generateSystemColors(systemColorsJson.deprecatedColors, "syscolors-deprecated-table");
}

function generateColorGrids() {
  //console.log("currentColors: " + systemColorsJson.currentColors.length);
  document.getElementById("syscolors-current-summary").innerText = "System Color (" + systemColorsJson.currentColors.length + ") Grid";
  //generateSystemColors(systemColorsJson.currentColors, "syscolors-grid-light");
  //systemColorsJson.currentColors = generateSystemColors(systemColorsJson.currentColors, "syscolors-grid-dark");

  for (const index of Object.keys(systemColorsJson.currentColors)) {
    createColorCard(systemColorsJson.currentColors, index, "syscolors-grid-light");
  }
  for (const index of Object.keys(systemColorsJson.currentColors)) {
    createColorCard(systemColorsJson.currentColors, index, "syscolors-grid-dark");
  }

  // save the JSON data for download
  currentColorsJson.info = structuredClone(systemColorsJson.info);
  currentColorsJson.currentColors = structuredClone(systemColorsJson.currentColors);

  //console.log("deprecatedColors: " + systemColorsJson.deprecatedColors.length);
  document.getElementById("syscolors-deprecated-summary").innerText = "Deprecated System Color (" + systemColorsJson.deprecatedColors.length + ") Grid";
  // generateSystemColors(systemColorsJson.deprecatedColors, "syscolors-deprecated-light");
  // systemColorsJson.deprecatedColors = generateSystemColors(systemColorsJson.deprecatedColors, "syscolors-deprecated-dark");

  for (const index of Object.keys(systemColorsJson.currentColors)) {
    createColorCard(systemColorsJson.deprecatedColors, index, "syscolors-deprecated-light");
  }
  for (const index of Object.keys(systemColorsJson.currentColors)) {
    createColorCard(systemColorsJson.deprecatedColors, index, "syscolors-deprecated-dark");
  }

  deprecatedColorsJson.info = structuredClone(systemColorsJson.info);
  deprecatedColorsJson.deprecatedColors = structuredClone(systemColorsJson.deprecatedColors);
}

// This updates systemColorSet with an RGBA key, in addition to creating HTML cards
function generateSystemColors(systemColorSet, elementID) {
  if (logLevel > 2) console.table(systemColorSet);

  for (const index of Object.keys(systemColorSet)) {
    if (elementID === "syscolors-table") {
      createColorRow(systemColorSet, index, "syscolors-table");
    } else if (elementID === "syscolors-deprecated-table") {
      createColorRow(systemColorSet, index, "syscolors-deprecated-table");
    } else {
      createColorCard(systemColorSet, index, elementID);
    }
  }
  return systemColorSet;
}