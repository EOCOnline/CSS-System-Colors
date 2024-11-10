// logLevel is used to control the level of logging output: 0 = none, 1 = some, 2 = all
const logLevel = 2;

// https://javascript.plainenglish.io/how-to-trigger-download-of-a-file-via-an-html-button-using-javascript-55f53a4111ce
/*
const submit = document.getElementById('submitButton');
let contrastSlider = document.getElementById('syscolors-contrast');
const contrastValue = contrastSlider.value;//document.getElementById('syscolors-contrast-value');

contrastSlider.addEventListener('input', function () {
  contrastValue.innerHTML = contrastSlider.value;
  updateContrast({ value: contrastSlider.value });
});

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

/////////////////////////////////////////////////////////////////////////////////////





document.addEventListener("DOMContentLoaded", function () {
  if (logLevel > 1) console.clear();
  if (logLevel > 1) console.log("DOM fully loaded and parsed");
  // set contrast to auto value
  updateContrast({ value: 95 });
  readSystemColors();
});

function updateContrast(el) {
  let contrast = el.value;
  // set root style to have filter: contrast(80%);
  document.documentElement.style.setProperty('--contrast', contrast);
  document.querySelector("#syscolors-container").style.contrast = contrast + 'em';
  document.querySelector("#syscolors-contrast").value = contrast;
  document.querySelector("#syscolors-contrast-value").innerHTML = contrast;
}

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

let currentColorsJson = {};
let deprecatedColorsJson = {};
function processJson(json) {
  if (logLevel > 1) console.log("Processing JSON");
  console.log("%c" + "Read system colors file", "color:aqua;font-weight:bold;");

  json.info.useragent = navigator.userAgent;
  json.info.timeStamp = new Date().toLocaleString();

  console.log("currentColors: " + json.currentColors.length);
  json.currentColors = generateSystemColors(json.currentColors, "syscolors-grid");
  let newJson = Object.assign({}, json.info, json.currentColors);
  currentColorsJson = newJson;
  // setupDownload(newJson);

  console.log("deprecatedColors: " + json.deprecatedColors.length);
  newJson = Object.assign({}, json.info, generateSystemColors(json.deprecatedColors, "syscolors-deprecated-grid", json.deprecatedColors));
  deprecatedColorsJson = newJson;
  // setupDownload(newJson, 'deprecated');
}

// https://stackoverflow.com/questions/19721439/download-json-object-as-a-file-from-browser
function setupDownload(json, validity = "current") {
  let storageObj = json;
  let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(storageObj));
  let dlAnchorElem = document.getElementById('syscolors-download-' + validity);
  dlAnchorElem.setAttribute("href", dataStr);
  dlAnchorElem.setAttribute("download", "CssSystemColors-" + validity + ".json");
  // dlAnchorElem.click(); // auto-download: user doesn't even have to click the button!
  return;
}


function downloadCurrentColors() {
  //let curColor = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(currentColorsJson));
  let curColor = JSON.stringify(currentColorsJson);
  downloadJSON(curColor, 'CSS_System_Colors.json');
}

function downloadDeprecatedColors() {
  //let depColor = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(deprecatedColorsJson));
  let depColor = JSON.stringify(deprecatedColorsJson);
  downloadJSON(depColor, 'CSS_Deprecated_Colors.json');
}
/*
public IActionResult Download(){
  var download = Serialize(_context.Users, new JsonSerializerSettings());
  return File(download, "application/json", "file.json");}


private byte[] Serialize(object value, JsonSerializerSettings jsonSerializerSettings)
{  var result = JsonConvert.SerializeObject(value, jsonSerializerSettings);
  return Encoding.UTF8.GetBytes(result);}
*/


// Process a list of system-colors: displaying it & building up JSON object with RGBA values for this userAgent
function generateSystemColors(systemColorSet, elementID, newJson) {
  console.table(systemColorSet);
  console.log("Self reported navigator.userAgent: '" + navigator.userAgent + "'");
  let i = 0;

  for (const index of Object.keys(systemColorSet)) {

    //if (logLevel) console.log("color: " + systemColorSet[index].color);
    let RGBA = nameToRgba(systemColorSet[index].color);
    if (logLevel) console.log("RGBA of " + systemColorSet[index].color + " is " + RGBA);
    systemColorSet[index].rgba = RGBA;


    let nameSpan = document.createElement('span');
    nameSpan.className = "syscolors-color-span";
    nameSpan.style.color = systemColorSet[index].color;
    // background needs a contrasting color
    nameSpan.style.backgroundColor = colorIsLight(RGBA[0], RGBA[1], RGBA[2]) ? 'black' : 'white';
    //nameSpan.style.backgroundColor = "#" + RGBA[0].toString(16) + RGBA[1].toString(16) + RGBA[2].toString(16);
    nameSpan.innerHTML = systemColorSet[index].color;

    let descSpan = document.createElement('span');
    descSpan.className = "syscolors-desc-span";
    descSpan.innerHTML = " (" + systemColorSet[index].desc + ") ";

    let rgbaSpan = document.createElement('span');
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
  if (logLevel > 1) console.log("Processed " + i + " colors.");
  return newJson;
}

// See: http://stackoverflow.com/a/1855903/186965
// https://css-tricks.com/methods-contrasting-text-backgrounds/ & https://codepen.io/thebabydino/pen/JNWqLL
// calcs contrasting color
function colorIsLight(r, g, b) {
  // Counting the perceptive luminance
  // human eye favors green color... 
  var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  if (logLevel > 1) console.log(a);
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
  if (logLevel > 1) console.log("rgb: " + rgb);
  if (rgb === null) {
    rgb = 'fff';
  }
  //var bgColor = colorFromRgb(bgRgb[0], bgRgb[1], bgRgb[2]);
  let textColor = colorIsLight(Number(rgb[0]), Number(rgb[1]), Number(rgb[2])) ? 'black' : 'white';
  element.style.color = textColor;
  return textColor;
}