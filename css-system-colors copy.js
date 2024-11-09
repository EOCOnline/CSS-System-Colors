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
            if (verbose > 1) {
                console.log("Self reported navigator.userAgent: " + navigator.userAgent);
                if (navigator.userAgentData) {
                    console.log("navigator.userAgentData: " + navigator.userAgentData);
                    console.log("navigator.userAgentData.brands: " + navigator.userAgentData.brands);

                    console.log("navigator.userAgentData.uaList: " + navigator.userAgentData.uaList);
                    console.log("navigator.userAgentData.uaList.length: " + navigator.userAgentData.uaList.length);
                    console.log("navigator.userAgentData.uaList[0]: " + navigator.userAgentData.uaList[0]);
                    console.log("navigator.userAgentData.uaList[0].uaFullVersion: " + navigator.userAgentData.uaList[0].uaFullVersion);
                    console.log("navigator.userAgentData.uaList[0].uaMinorVersion: " + navigator.userAgentData.uaList[0].uaMinorVersion);
                    console.log("navigator.userAgentData.uaList[0].uaName: " + navigator.userAgentData.uaList[0].uaName);
                    console.log("navigator.userAgentData.uaList[0].uaPlatform: " + navigator.userAgentData.uaList[0].uaPlatform);
                    console.log("navigator.userAgentData.uaList[0].uaVersion: " + navigator.userAgentData.uaList[0].uaVersion);
                    console.log("navigator.userAgentData.uaList[0].uaFullVersion: " + navigator.userAgentData.uaList[0].uaFullVersion);

                    console.log("navigator.userAgentData.platform: " + (navigator.userAgentData.platform ? navigator.userAgentData.platform : "undefined"));
                } else {
                    console.log("navigator.userAgentData: undefined");
                }
            }
            console.log("navigator.platform (deprecated): " + (navigator.userAgentData.platform ? navigator.userAgentData.platform : "undefined"));
        }
            if (verbose > 1) console.log("currentColors: " + json.currentColors.length);
    generateSystemColors(json.currentColors, "syscolors-grid");
    if (verbose > 1) console.log("\n\ndeprecatedColors: " + json.deprecatedColors.length);
    generateSystemColors(json.deprecatedColors, "syscolors-deprecated-grid");
})
        .catch (error => {
    console.error("Fetch error: " + error.message);
});
    }
    .catch (error => {
    console.error("Fetch error: " + error.message);
});
}

// Generate flexgrid of system-colors
function generateSystemColors(systemColorSet, elementID) {
    let i = 0;
    for (const index in systemColorSet) {

        if (verbose > 2) console.log("color: " + systemColorSet[index].color);
        if (systemColorSet.hasOwnProperty(index)) {
            let RGBA = nameToRgba(systemColorSet[index].color);
            if (verbose > 1) console.log("RGBA of " + systemColorSet[index].color + " is " + RGBA);

            let nameDiv = document.createElement('div');
            nameDiv.className = "syscolors-name-div";
            nameDiv.appendChild(document.createTextNode(systemColorSet[index].color));
            nameDiv.style.color = systemColorSet[index].color;
            nameDiv.style.backgroundColor = "#" + RGBA[0].toString(16) + RGBA[1].toString(16) + RGBA[2].toString(16);


            let descDiv = document.createElement('div');
            descDiv.className = "syscolors-desc-div";
            descDiv.innerHTML = systemColorSet[index].desc;
            descDiv.style.color = systemColorSet[index].color;
            nameDiv.appendChild(descDiv);

            let newDiv = document.createElement('div');
            newDiv.className = "syscolors-div";
            nameDiv.innerHTML = systemColorSet[index].color;
            nameDiv.appendChild(newDiv);
            let descSpan = document.createElement('span');
            descSpan.className = "syscolors-desc-div";
            descSpan.innerHTML = systemColorSet[index].desc;
            nameDiv.appendChild(descSpan);






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
        }
    }
    if (verbose > 1) console.log("Processed " + i + " colors.");
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