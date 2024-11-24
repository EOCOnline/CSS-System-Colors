/******************************************* 
 * 
 * Main Action Flow™: these routines!
 */

// logLevel is used to control the level of logging output: 0 = none, 1 = some, 2 = all
const logLevel = 1;
const sourceJson = "css-system-colors.json";
let hueValue = 222;


document.addEventListener("DOMContentLoaded", function () {
  if (logLevel > 1) console.clear();
  if (logLevel > 2) console.log("DOM fully loaded and parsed");

  contrastValue = document.getElementById('syscolors-contrast-value');
  syscolorsContrast = document.getElementById("syscolors-contrast");
  syscolorsContainer = document.getElementById("syscolors-outer-container");

  cloneLightPanel("syscolors-demo-light", "syscolors-demo-dark", "H3 .syscolors-demo-mode");
  cloneLightPanel("syscolors-hue-light", "syscolors-hue-dark", "H3 .syscolors-hue-mode");

  document.getElementById("syscolors-demo-light").getElementsByClassName("uniqueUrl")[0].href = "https://eoc.online/?v=" + new Date().getTime();
  document.getElementById("syscolors-demo-dark").getElementsByClassName("uniqueUrl")[0].href = "https://eoc.online/?d=" + new Date().getTime();

  const hueSlider = document.querySelector('#hueSlider');
  const hueDemo = document.querySelector("#syscolors-hue-demo")
  hueSlider.addEventListener("input", () => {
    hueDemo.style.setProperty("--hue", hueSlider.value);
    document.querySelectorAll(".hueValue").forEach((element) => {
      element.innerText = hueSlider.value;
    });
    if (logLevel > 2) console.log("hueSlider.value set to " + hueSlider.value);
  });

  updateContrast({ value: 97.5 });
  //if (logLevel > 2) setTimeout(() => { document.location.reload(); }, 5 * 1000); // force page refresh every 3 seconds while debugging

  processJson(systemColorsJson);

});


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

    // Sort colors by category (or leave as in the file: alphabetically)
    if (sortByCategory) {
      json.currentColors.sort((a, b) => (a.category > b.category) ? 1 : -1);
      json.deprecatedColors.sort((a, b) => (a.category > b.category) ? 1 : -1);
    } else {
      json.currentColors.sort((a, b) => (a.color > b.color) ? 1 : -1);
      json.deprecatedColors.sort((a, b) => (a.color > b.color) ? 1 : -1);
    }

    // Generate the System Colors 'Tables' These also trigger updating the Json with an RGBA key.
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
  if (logLevel > 1) console.table(systemColorSet);
  let i = 0;
  if (!systemColorSet) {
    console.error("No systemColorSet object!");
    return;
  }

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

//MUCH easier than reading from a file due to CORS issues 
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