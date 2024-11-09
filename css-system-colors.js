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
            console.log("%c" + "Read system colors file", "color:maroon;font-weight:bold;");
            console.table(json);
            generateSystemColors(json.currentColors, "syscolors-grid");
            generateSystemColors(json.deprecatedColors, "syscolors-deprecated-grid");
        })
        .catch(error => {
            console.error("Fetch error: " + error.message);
        });
}

// Generate flexgrid of system-colors
function generateSystemColors(systemColorSet, elementID) {
    let i = 0;
    for (const index in systemColorSet) {

        if (verbose > 1) console.log("color: " + systemColorSet[index].color);
        if (systemColorSet.hasOwnProperty(index)) {
            let nameDiv = document.createElement('div');
            nameDiv.className = "syscolors-name-div";
            nameDiv.innerHTML = systemColorSet[index].color;
            nameDiv.style.color = systemColorSet[index].color;

            let descDiv = document.createElement('div');
            descDiv.className = "syscolors-desc-div";
            descDiv.innerHTML = systemColorSet[index].desc;
            descDiv.style.color = systemColorSet[index].color;
            nameDiv.appendChild(descDiv);

            // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleDeclaration/getPropertyValue#syntax
            // console.error("color was set to: " + nameDiv.style.getPropertyValue("color"));

            //getPropertyValue("color", systemColors[index].color);
            // https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_colors/Relative_colors
            //newDiv.style.Color = rgb(from systemColors[index].color 200 g b);;
            //newDiv.style.Color = getContrastingColor(newDiv);
            document.getElementById(elementID).appendChild(nameDiv);
            i++;
        }
    }
    if (verbose > 1) console.log("Processed {%1} colors.", i);
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