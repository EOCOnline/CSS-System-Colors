// Verbose is used to control the level of logging output: 0 = none, 1 = some, 2 = all
const verbose = 2;

document.addEventListener("DOMContentLoaded", function () {
  if (verbose > 1) console.clear();
  if (verbose > 1) console.log("DOM fully loaded and parsed");
  readSystemColors();
});

async function readSystemColors() {
  // avoid CORS errors when reading a local file!
  fetch("css-system-colors.json")
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
      console.error("Fetch error: " + error.message);
    });
}

function processJson(json) {
  if (verbose > 1) console.log("Processing JSON");
  console.log("%c" + "Read system colors file", "color:aqua;font-weight:bold;");

  json.info.useragent = navigator.userAgent;
  json.info.timeStamp = new Date().toLocaleString();

  console.log("currentColors: " + json.currentColors.length);
  json.currentColors = generateSystemColors(json.currentColors, "syscolors-grid");
  let newJson = Object.assign({}, json.info, json.currentColors);
  setupDownload(newJson);

  console.log("deprecatedColors: " + json.deprecatedColors.length);
  newJson = Object.assign({}, json.info, generateSystemColors(json.deprecatedColors, "syscolors-deprecated-grid", jsonDeprecated));
  setupDownload(newJson, 'deprecated');
}

// https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
function setupDownload(json, validity = "current") {
  let storageObj = JSON.parse(json);
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storageObj));
  let dlAnchorElem = document.getElementById('syscolors-download-' + validity);
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "CssSystemColors-" + validity + ".json");
  // dlAnchorElem.click(); // auto-download: user doesn't even have to click the button!
}


// Process a list of system-colors: displaying it & building up JSON object with RGBA values for this userAgent
function generateSystemColors(systemColorSet, elementID, newJson) {
  console.table(systemColorSet);
  console.log("Self reported navigator.userAgent: '" + navigator.userAgent + "'");
  let i = 0;

  for (const index in Object.keys(systemColorSet)) {

    //if (verbose) console.log("color: " + systemColorSet[index].color);
    let RGBA = nameToRgba(systemColorSet[index].color);
    if (verbose) console.log("RGBA of " + systemColorSet[index].color + " is " + RGBA);
    systemColorSet[index].rgba = RGBA;


    let nameSpan = document.createElement('span');
    nameSpan.className = "syscolors-color-span";
    nameSpan.style.color = systemColorSet[index].color;
    // background needs a contrasting color
    nameSpan.backgroundColor = colorIsLight(RGBA[0], RGBA[1], RGBA[2]) ? 'black' : 'white';
    //nameSpan.style.backgroundColor = "#" + RGBA[0].toString(16) + RGBA[1].toString(16) + RGBA[2].toString(16);
    nameSpan.innerHTML = systemColorSet[index].color;

    descSpan = document.createElement('span');
    descSpan.className = "syscolors-desc-span";
    descSpan.innerHTML = " (" + systemColorSet[index].desc + ") ";

    rgbaSpan = document.createElement('span');
    rgbaSpan.className = "syscolors-rgba-span";
    rgbaSpan.innerHTML = RGBA;

    let nameDiv = document.createElement('div');
    nameDiv.className = "syscolors-name-div";
    nameDiv.style.color = systemColorSet[index].color;
    nameDiv.style.backgroundColor = "#" + RGBA[0].toString(16) + RGBA[1].toString(16) + RGBA[2].toString(16);
    nameDiv.appendChild(nameSpan);
    nameDiv.appendChild(descSpan);
    nameDiv.appendChild(rgbaSpan);


    // How to come up with contrasting color for text?
    // https://css-tricks.com/methods-contrasting-text-backgrounds/
    // https://codepen.io/thebabydino/pen/JNWqLL
    // https://stackoverflow.com/questions/1855884/determine-font-color-based-on-background-color


    /*
    https://blog.jim-nielsen.com/2021/css-relative-colors/
    https://developer.mozilla.org/en-US/docs/Web/CSS/color_value/rgb
    https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors
    https://fullystacked.net/color-mix-and-relative-color/
    https://developer.chrome.com/blog/css-relative-color-syntax/#invert_a_color
    https://developer.chrome.com/blog/css-relative-color-syntax/
    */

    // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/getPropertyValue#syntax
    // console.error("color was set to: " + nameDiv.style.getPropertyValue("color"));

    //getPropertyValue("color", systemColors[index].color);
    // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors
    //newDiv.style.Color = rgb(from systemColors[index].color 200 g b);;
    //newDiv.style.Color = getContrastingColor(newDiv);
    document.getElementById(elementID).appendChild(nameDiv);
    i++;
    //}
  }
  if (verbose > 1) console.log("Processed " + i + " colors.");
  return newJson
}

// See: http://stackoverflow.com/a/1855903/186965
// https://css-tricks.com/methods-contrasting-text-backgrounds/ & https://codepen.io/thebabydino/pen/JNWqLL
// calcs contrasting color
function colorIsLight(r, g, b) {
  // Counting the perceptive luminance
  // human eye favors green color... 
  var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  console.log(a);
  return (a < 0.5);
}

function nameToRgba(name) {
  var canvas = document.createElement('canvas');
  var context = canvas.getContext('2d');
  context.fillStyle = name;
  context.fillRect(0, 0, 1, 1);
  return context.getImageData(0, 0, 1, 1).data;
}

function colorFromRgb(r, g, b) {
  return 'rgb(' + r + ',' + g + ',' + b + ')';
};

function getContrastingColor(element) {
  let rgb1 = element.style.backgroundColor;
  let rgb = rgb1.match(/\d+/g);
  if (verbose > 1) console.log("rgb: " + rgb);
  if (rgb === null) {
    rgb = 'fff';
  }
  //var bgColor = colorFromRgb(bgRgb[0], bgRgb[1], bgRgb[2]);
  let textColor = colorIsLight(rgb[0], rgb[1], rgb[2]) ? 'black' : 'white';

  //el.setAttribute('style', 'background-color: ' + bgColour + '; color: ' + textColour);
  //c.appendChild(el);
}