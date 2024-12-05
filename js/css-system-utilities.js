// This file has utility/helper routines INCIDENTAL TO THE MAIN FLOW

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

        lightIds.forEach((lightId, i) => {
            lightId.id = lightId.id.replace("idLight", "idDark");
            if (logLevel > 1) { console.log(`Converted ID ${i}: to ${lightId.id.toString()}`); }
        });

        // convert all HREF's that start with idLight to idDark
        let lightHRefs = dark.querySelectorAll("[href^='idLight']");
        lightHRefs.forEach((lightHRef, i) => {
            lightHRef.href = lightHRef.href.replace("idLight", "idDark");
            if (logLevel > 1) { console.log(`Converted ID ${i}: to ${lightHRef.href.toString()}`); }
        });
        new JSColor('#idDarkPrimary', ({}));
        new JSColor('#idDarkContrast', ({}));
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

    buildDemoPanels();
    buildTableAndGridPanels();
    //window.location.reload();
}

let sortByCategory = false;
function setSortOrder(val) {
    sortByCategory = val.checked;
    if (logLevel > 1) console.log("Sort by category: " + sortByCategory);
    resetWebPage();

    buildDemoPanels();
    buildTableAndGridPanels();
    // window.location.reload();
}

/**
 * Resets the web page/DOM to its original state.
 * This function preserves the initial card for tables and the titles & line breaks for grids.
 * It also removes the dark demo element if it exists.
 * This is useful for resetting the page after changes have been made to the DOM.
 */
function resetWebPage() {
    // For tables, preserve ONLY the initial card
    let savedCard = document.querySelector("#syscolors-table .syscolors-initial-card").cloneNode(true);
    document.getElementById("syscolors-table").innerHTML = savedCard.outerHTML;

    savedCard = document.querySelector("#syscolors-deprecated-table .syscolors-initial-card").cloneNode(true);
    document.getElementById("syscolors-deprecated-table").innerHTML = savedCard.outerHTML;

    // For grids, only preserve panel titles and line breaks
    for (const index of document.getElementsByClassName("syscolors-preserve")) {
        let h2 = index.parentNode;
        let parentDiv = h2.parentNode;
        parentDiv.innerHTML = h2.outerHTML;

        let div = document.createElement('div');
        div.className = 'syscolors-break';
        parentDiv.appendChild(div);
    }

    // Remove the dark demo element if it exists
    const demoDarkElement = document.getElementById("syscolors-demo-dark");
    if (demoDarkElement) {
        document.getElementById("syscolors-demo").removeChild(demoDarkElement);
    }
}
/* #region(collapsed) Color Pickers */
// https://jscolor.com/docs/
let lightPrimaryPicker;
let lightContrastPicker;
let darkPrimaryPicker;
let darkContrastPicker;
function setJsColorPicker() {
    let siteStyle = getComputedStyle(document.getElementById("idLightWebSite"));
    lightPrimaryPicker = setUpPicker('Light', 'Primary', siteStyle);
    lightContrastPicker = setUpPicker('Light', 'Contrast', siteStyle);

    let darkWebSiteElement = document.getElementById("idDarkWebSite");
    siteStyle = getComputedStyle(darkWebSiteElement);
    darkPrimaryPicker = setUpPicker('Dark', 'Primary', siteStyle);
    darkContrastPicker = setUpPicker('Dark', 'Contrast', siteStyle);
}

const opts = {
    'borderRadius': 15,
    'borderWidth': 2,
    'padding': 4,
    'shadow': true,
    'format': 'rgba',
    'alphaChannel': true,
};
function setUpPicker(theme, color, siteStyle) {
    let element = document.getElementById(`id${theme}${color}`);
    if (!element) { throw new Error(`id${theme}${color} not found`); }
    let picker = element.jscolor;
    if (!picker) { throw new Error(`id${theme}${color}.jscolor not found`); }
    picker.onInput = window[`update${theme}${color}Color`];
    if (!picker.fromRGBA(...siteStyle.getPropertyValue(`--${theme.toLowerCase()}-${color.toLowerCase()}-rgba`).match(/\d+(\.\d+)?/g).map(Number)))
        console.error(`Could not set ${theme} ${color} color picker to: ${siteStyle.getPropertyValue(`--${theme.toLowerCase()}-${color.toLowerCase()}-rgba`)}`);
    picker.option(opts);
    return picker;
}

// picker calls these onUpdate() functions when user picks new colors
function updateLightPrimaryColor() {
    updateColor('Light', 'Primary', lightPrimaryPicker);
}

function updateLightContrastColor() {
    updateColor('Light', 'Contrast', lightContrastPicker);
}

function updateDarkPrimaryColor() {
    updateColor('Dark', 'Primary', darkPrimaryPicker);
}

function updateDarkContrastColor() {
    updateColor('Dark', 'Contrast', darkContrastPicker);
}

function updateColor(theme, color, picker) {
    let siteStyle;
    if (theme === 'Light') {
        siteStyle = document.getElementById("idLightWebSite").style;
    } else {
        siteStyle = document.getElementById("idDarkWebSite").style;
    }
    siteStyle.setProperty(`--${theme.toLowerCase()}-${color.toLowerCase()}`,
        `rgba(${round(picker.channels.r)}, 
        ${round(picker.channels.g)}, 
        ${round(picker.channels.b)}, 
        ${round(picker.channels.a)})`);

    if (logLevel > 2) console.log(`${theme} ${color} Color set to: ${picker.toRGBAString()}`);
}

function round(num) {
    return Math.round(num * 100) / 100;
}
/* #endregion */


// #region(collapsed) Color functions
/*******************************************/

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
// #endregion


// #region(collapsed) Copy text to clipboard
/*******************************************/
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
// #endregion


// #region(collapsed) Download JSON
/******************************************/
function createFileName(baseName) {
    let date = new Date().toISOString().slice(0, 10);
    let colorModeElement = document.querySelector("#syscolors-page-mode");
    let colorMode = colorModeElement ? colorModeElement.value : "default";
    let userAgentSummary = navigator.userAgent.replace(/[^a-zA-Z0-9]/g, '');  // TODO: shorten this!
    let fileName = baseName + "_" + date + "_" + colorMode + "_" + userAgentSummary + ".json";
    console.log("Download fileName: " + fileName);
    return fileName;
}

function downloadColors() {
    downloadJSON(downloadableJson, createFileName("CSS_System_Colors"));
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
// #endregion