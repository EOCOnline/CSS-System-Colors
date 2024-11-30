// This file has utility routines INCIDENTAL TO THE MAIN FLOW

function cloneLightPanel(elementId, cloneId, spanSelector) {
    let light = document.getElementById(elementId);
    if (!light) {
        console.error("No element with ID: " + elementId);
        return;
    }
    let dark = light.cloneNode(true);
    dark.id = cloneId;
    dark.className = "syscolors-inner-container syscolors-dark";
    dark.querySelector(spanSelector).innerText = "Dark";

    light.classList.add("syscolors-inner-container");
    light.classList.add("syscolors-light");
    light.querySelector(spanSelector).innerText = "Light";

    let parent = light.parentNode;
    if (!parent) {
        console.error("No parent element for element with ID: " + elementId);
        return;
    }
    if (logLevel > 1) { console.log("Found Parent with ID: " + parent.id); }
    parent.appendChild(dark);

    if (elementId.includes("demo")) {
        // convert all ID's that start with idLight to idDark
        let lightIds = dark.querySelectorAll("[id^='idLight']");
        for (let i = 0; i < lightIds.length; i++) {
            lightIds[i].id = lightIds[i].id.replace("idLight", "idDark");
            if (logLevel > 1) { console.log(`Converted ID ${i}: to ${lightIds[i].id.toString()}`); }
        }

        // convert all HREF's that start with idLight to idDark
        let lightHRefs = dark.querySelectorAll("[href^='idLight']");
        for (let i = 0; i < lightHRefs.length; i++) {
            lightHRefs[i].href = lightHRefs[i].href.replace("idLight", "idDark");
            if (logLevel > 1) { console.log(`Converted HREF ${i}: to ${lightHRefs[i].href.toString()}`); }
        }
    }
    return dark;
}

function updateContrast(el) {
    syscolorsContainer.style.filter = 'contrast(' + el.value + '%)';
    syscolorsContrast.value = el.value;
    contrastValueId.innerText = el.value;
}

function setPageColorMode(el) {
    // Mostly handled by CSS's color-scheme property
    resetWebPage();

    processJson(systemColorsJson);
    window.location.reload();
}

let sortByCategory = false;
function setSortOrder(val) {
    sortByCategory = val.checked;
    if (logLevel > 1) console.log("Sort by category: " + sortByCategory);
    resetWebPage();
    //fetchSystemColors();
    processJson(systemColorsJson);
}

// https://jscolor.com/docs/
// ToDo: refactor to use a single function for all color pickers
let lightPrimaryPicker;
let lightSecondaryPicker;
let lightContrastPicker;
let darkPrimaryPicker;
let darkSecondaryPicker;
let darkContrastPicker;
let myWebSite;
let lightWebSite;
let darkWebSite;
function setJsColorPicker() {
    jscolor.presets.default = {
        ...jscolor.presets.default,
        'format': 'rgba',
        'borderRadius': 15,
        'borderWidth': 30,
        'padding': 5,
        'shadow': false,
        'backgroundColor': '#333'
    };

    myWebSite = document.getElementsByClassName("myWebSite")[0];
    if (!myWebSite) throw new Error("Website element not found!");

    lightWebSite = document.getElementById("idLightWebSite");
    if (!lightWebSite) throw new Error("Light website not found!");
    //debugger;
    lightPrimaryPicker = document.getElementById('idLightPrimary').jscolor;
    lightPrimaryPicker.onInput = updateLightPrimaryColor;
    lightPrimaryPicker.option({ 'format': 'rgba', 'borderRadius': 15, 'borderWidth': 10, 'padding': 1, 'shadow': false, 'backgroundColor': '#333' });
    let lightPrimaryColor = myWebSite.style.getPropertyValue('--light-primary-rgba');
    console.log("Light Primary Color: " + lightPrimaryColor);
    lightPrimaryPicker.fromRGBA(lightPrimaryColor);

    lightSecondaryPicker = document.getElementById('idLightSecondary').jscolor;
    lightSecondaryPicker.onInput = updateLightSecondaryColor;
    lightSecondaryPicker.fromRGBA(myWebSite.style.getPropertyValue('--light-secondary-rgba'));
    console.log("Light Secondary Color: " + myWebSite.style.getPropertyValue('--light-secondary-rgba'));

    lightContrastPicker = document.getElementById('idLightContrast').jscolor;
    lightContrastPicker.onInput = updateLightContrastColor;
    lightContrastPicker.fromRGBA(myWebSite.style.getPropertyValue('--light-contrast-rgba'));
    console.log("Light Contrast Color: " + myWebSite.style.getPropertyValue('--light-contrast-rgba'));


    darkWebSite = document.getElementById("idDarkWebSite");
    if (!darkWebSite) throw new Error("Dark website not found!");

    darkPrimaryPicker = document.getElementById('idDarkPrimary').jscolor;
    /*  
        if (!darkPrimaryPicker) { throw new Error("idDarkPrimaryPicker.jscolor not found!"); }
       
        darkPrimaryPicker.onInput = updateDarkPrimaryColor;
        darkPrimaryPicker.fromRGBA(myWebSite.style.getPropertyValue('--dark-primary-rgba'));
    
        darkSecondaryPicker = document.getElementById('idDarkSecondary').jscolor;
        darkSecondaryPicker.onInput = updateDarkSecondaryColor;
        darkSecondaryPicker.fromRGBA(myWebSite.style.getPropertyValue('--dark-secondary-rgba'));
    
        darkContrastPicker = document.getElementById('idDarkContrast').jscolor;
        darkContrastPicker.onInput = updateDarkContrastColor;
        darkContrastPicker.fromRGBA(myWebSite.style.getPropertyValue('--dark-contrast-rgba'));
    */
    jscolor.trigger('input');  // triggers 'onInput' on all color pickers when they are ready
    console.log("JSColorPicker installed!");
}

function updateLightPrimaryColor() {
    console.log("Light Primary Color: " + lightPrimaryPicker.toRGBAString());
    lightWebSite.style.setProperty('--light-primary',
        `rgba(${round(lightPrimaryPicker.channels.r)}, 
        ${round(lightPrimaryPicker.channels.g)}, 
        ${round(lightPrimaryPicker.channels.b)}, 
        ${round(lightPrimaryPicker.channels.a)})`);
}

function updateLightSecondaryColor() {
    console.log("Light Secondary Color: " + lightSecondaryPicker.toRGBAString());
    lightWebSite.style.setProperty('--light-secondary',
        `rgba(${round(lightSecondaryPicker.channels.r)}, 
        ${round(lightSecondaryPicker.channels.g)}, 
        ${round(lightSecondaryPicker.channels.b)}, 
        ${round(lightSecondaryPicker.channels.a)})`);
}

function updateLightContrastColor() {
    console.log("Light Contrast Color: " + lightContrastPicker.toRGBAString());
    lightWebSite.style.setProperty('--light-contrast',
        `rgba(${round(lightContrastPicker.channels.r)},
        ${round(lightContrastPicker.channels.g)},
        ${round(lightContrastPicker.channels.b)},
        ${round(lightContrastPicker.channels.a)})`);
}


function updateDarkPrimaryColor() {
    console.log("Dark Primary Color: " + darkPrimaryPicker.toRGBAString());
    darkWebSite.style.setProperty('--dark-primary',
        `rgba(${round(darkPrimaryPicker.channels.r)},
        ${round(darkPrimaryPicker.channels.g)},
        ${round(darkPrimaryPicker.channels.b)},
        ${round(darkPrimaryPicker.channels.a)})`);
}

function updateDarkSecondaryColor() {
    console.log("Dark Secondary Color: " + darkSecondaryPicker.toRGBAString());
    darkWebSite.style.setProperty('--dark-secondary',
        `rgba(${round(darkSecondaryPicker.channels.r)},
        ${round(darkSecondaryPicker.channels.g)},
        ${round(darkSecondaryPicker.channels.b)},
        ${round(darkSecondaryPicker.channels.a)})`);
}

function updateDarkContrastColor() {
    console.log("Dark Contrast Color: " + darkContrastPicker.toRGBAString());
    darkWebSite.style.setProperty('--dark-contrast',
        `rgba(${round(darkContrastPicker.channels.r)},
        ${round(darkContrastPicker.channels.g)},
        ${round(darkContrastPicker.channels.b)},
        ${round(darkContrastPicker.channels.a)})`);
}


function round(val) {
    return Math.round(val * 100) / 100;
}


function resetWebPage() {
    currentColorsJson = { "info": {}, "currentColors": [] };
    deprecatedColorsJson = { "info": {}, "deprecatedColors": [] };

    // For tables, preserve ONLY the initial cards
    let savedCard = document.getElementsByClassName("syscolors-initial-card")[0].cloneNode(true);
    document.getElementById("syscolors-table").innerHTML = savedCard.outerHTML;

    savedCard = document.getElementsByClassName("syscolors-initial-card")[1].cloneNode(true);
    document.getElementById("syscolors-deprecated-table").innerHTML = savedCard.outerHTML;

    // For grids, preserve ONLY the titles
    document.getElementById("syscolors-grid-light").innerHTML = document.getElementById("syscolors-grid-light").children[0].outerHTML;
    document.getElementById("syscolors-grid-dark").innerHTML = document.getElementById("syscolors-grid-dark").children[0].outerHTML;

    /*
    document.getElementById("syscolors-grid-light").innerHTML = "";
    if (document.getElementById("syscolors-grid-dark")) {
        document.getElementById("syscolors-grid").removeChild(document.getElementById("syscolors-grid-dark"));
    }
 
    // removed too much!!!!
    document.getElementById("syscolors-deprecated-light").innerHTML = "";
    if (document.getElementById("syscolors-deprecated-dark")) {
        document.getElementById("syscolors-deprecated-grid").removeChild(document.getElementById("syscolors-deprecated-dark"))
    }
*/

    // For demos, preserve all the light elements
    //document.getElementById("syscolors-demo-light").innerHTML = "";
    if (document.getElementById("syscolors-demo-dark")) {
        document.getElementById("syscolors-demo").removeChild(document.getElementById("syscolors-demo-dark"))
    }
}




/******************************************* 
 * 
 * Color functions
 */

// TODO: get contrasting colors (not just black/white) with all-css strategy: https://css-tricks.com/methods-contrasting-text-backgrounds/ & https://codepen.io/thebabydino/pen/JNWqLL
// TODO: Try https://www.w3.org/TR/css-color-5/#contrast-color
// from: http://stackoverflow.com/a/1855903/186965  ONLY returns black or white!
function getContrastingColor(r, g, b) {
    //    console.error("Contrasting color of white (#000) is: " + getContrastingColor(0, 0, 0));
    //if (r == 0 && g == 0 && b == 0) return "white";

    // Counting the perceptive luminance
    // The formula for calculating luminance is based on the human eye's sensitivity to different colors.
    // The human eye favors green color, so the coefficients for red, green, and blue are 0.299, 0.587, and 0.114 respectively.
    var a = 1 - (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    if (logLevel > 2) console.log("Perceptive luminance:" + a);
    return ((a < 0.5) ? 'black' : 'white');
}


/*****************************
 * 
 *  Copy text to clipboard
 */

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

const textArea = document.createElement("textarea");
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
        const successful = document.execCommand('copy');
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
        const msg = successful ? 'successful' : 'unsuccessful';
        console.log('Fallback: Copying text command was ' + msg);
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    document.body.removeChild(textArea);
}




/******************************************
 * 
 * Download JSON file
 */

function createFileName(baseName) {
    let date = new Date().toISOString().slice(0, 10);
    let colorModeElement = document.querySelector("#syscolors-page-mode");
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
    const url = URL.createObjectURL(blob);

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