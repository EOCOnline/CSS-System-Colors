const clickText = "&nbsp; &nbsp; <strong>(Click to copy)</strong>";
const clickedText = "&nbsp; &nbsp; <strong>(Copied!)</strong>";


// Build up an HTML card for each color & attach to the DOM - used by GRIDS
function createColorCard(systemColorSet, index, elementId) {

    let mode = (elementId.includes("dark")) ? 'dark' : 'light'; // syscolors-grid-dark
    let nameSpan = document.createElement('span');
    nameSpan.className = "syscolors-name-span";
    nameSpan.innerHTML = systemColorSet[index].color;

    let descSpan = document.createElement('span');
    descSpan.className = "syscolors-desc-span";
    descSpan.innerHTML = " &mdash; " + systemColorSet[index].desc;

    let categorySpan = document.createElement('span');
    categorySpan.className = "syscolors-category-span";
    // add attribute to span
    categorySpan.setAttribute("category", systemColorSet[index].category);
    categorySpan.innerHTML = systemColorSet[index].category.replace(/-/g, "<br/>");

    let rgbaSpan = document.createElement('span');
    rgbaSpan.className = "syscolors-rgba-span";

    let tooltipSpan = document.createElement('span');
    tooltipSpan.className = "syscolors-tooltip";
    tooltipSpan.id = "syscolors-tooltip-" + index;

    let cardInnerDiv = document.createElement('div');
    cardInnerDiv.className = "syscolors-card-inner";
    // Apply background color to inner div, so as to not affect cardDiv's big left border color!
    cardInnerDiv.style.backgroundColor = systemColorSet[index].color;
    cardInnerDiv.appendChild(nameSpan);
    cardInnerDiv.appendChild(descSpan);
    cardInnerDiv.appendChild(rgbaSpan);

    let cardDiv = document.createElement('div');
    cardDiv.className = "syscolors-card";
    cardDiv.appendChild(categorySpan);
    cardDiv.appendChild(tooltipSpan);
    cardDiv.appendChild(cardInnerDiv);
    if (
        document.getElementById(elementId) === null) {
        console.error("Element " + elementId + " not found!");
    } else
        document.getElementById(elementId).appendChild(cardDiv);

    // Card is built & complete. 
    // Now update colors based on what the browser actually used. getComputedStyle() is an expensive operation BTW.
    let color = getComputedStyle(cardInnerDiv).backgroundColor;
    let r = color.match(/\d+/g)[0];
    let g = color.match(/\d+/g)[1];
    let b = color.match(/\d+/g)[2];
    cardInnerDiv.style.color = getContrastingColor(r, g, b);

    if (systemColorSet[index].color === "HighlightText" && mode === "dark") {
        console.warn("HighLightText contrasting color (for dark grid " + color + ") was set to " + getContrastingColor(r, g, b));
        cardInnerDiv.style.backgroundColor = color;// BUG: Without this, background was same as text color!!!
        //cardDiv.style.color = "white";
        //console.warn("HighLightText style reset to " + cardDiv.style.color);
    }
    r = parseInt(r).toString(16).padStart(2, '0');
    g = parseInt(g).toString(16).padStart(2, '0');
    b = parseInt(b).toString(16).padStart(2, '0');
    rgbaSpan.innerHTML = " [" + color + " #" + r + g + b + "]";


    tooltipSpan.innerHTML = nameSpan.outerHTML + "<br/>" + descSpan.outerHTML + "<br/>"
        //+ categorySpan.outerHTML + "<br/>" 
        + mode + " mode color: " + rgbaSpan.outerHTML + clickText;

    tooltipSpan.addEventListener('click', function () {
        copyTextToClipboard(nameSpan.innerText + descSpan.innerText
            + "\ncategory: " + categorySpan.innerText
            + "\n" + mode + " color " + rgbaSpan.innerText, tooltipSpan.id);
    });

    // Create an RGBA key in the json file for download
    if (elementId == "syscolors-grid-light" || elementId == "syscolors-deprecated-light") {
        systemColorSet[index].lightModeRGBA = color + "= #" + r + g + b;
    } else if (elementId == "syscolors-grid-dark" || elementId == "syscolors-deprecated-dark") {
        systemColorSet[index].darkModeRGBA = color + "= #" + r + g + b;
    }
}


// These cards look more like rows - & are used by TABLES
function createColorRow(systemColorSet, index, elementId) {

    let nameSpan = document.createElement('span');
    nameSpan.className = "syscolors-name-span";
    nameSpan.innerHTML = systemColorSet[index].color;
    let lightText = nameSpan.cloneNode(true);
    let darkText = nameSpan.cloneNode(true);

    let descSpan = document.createElement('span');
    descSpan.className = "syscolors-desc-span";
    descSpan.innerHTML = " &mdash; " + systemColorSet[index].desc;

    let categorySpan = document.createElement('span');
    categorySpan.className = "syscolors-category-span";
    // add attribute to span
    categorySpan.setAttribute("category", systemColorSet[index].category);
    categorySpan.innerHTML = systemColorSet[index].category.replace(/-/g, "<br/>");

    let tooltipSpan = document.createElement('span');
    tooltipSpan.className = "syscolors-tooltip";
    tooltipSpan.id = "syscolors-row-tooltip-" + index;

    let cardDiv = document.createElement('div');
    if (elementId == "syscolors-deprecated-table") {
        cardDiv.className = "syscolors-row-card syscolors-tall-row";
    } else {
        cardDiv.className = "syscolors-row-card";
    }
    cardDiv.appendChild(tooltipSpan);

    let textDiv = document.createElement('div');
    textDiv.className = "syscolors-row-text";
    textDiv.appendChild(categorySpan);
    textDiv.appendChild(nameSpan);
    textDiv.appendChild(descSpan);

    let lightDiv = document.createElement('div');
    lightDiv.className = "syscolors-row-light";
    lightDiv.style.backgroundColor = systemColorSet[index].color;
    lightDiv.appendChild(lightText);

    let darkDiv = document.createElement('div');
    darkDiv.className = "syscolors-row-dark";
    darkDiv.style.backgroundColor = systemColorSet[index].color;
    darkDiv.appendChild(darkText);

    cardDiv.appendChild(textDiv);
    cardDiv.appendChild(lightDiv);
    cardDiv.appendChild(darkDiv);

    if (
        document.getElementById(elementId) === null) {
        console.error("Element " + elementId + " not found!");
    } else {
        document.getElementById(elementId).appendChild(cardDiv);
    }

    // This card is built & complete. 
    // Now update colors based on what the browser actually used. getComputedStyle() is an expensive operation BTW.
    nameSpan.innerHTML = systemColorSet[index].color;

    let colorLight = getComputedStyle(lightDiv).backgroundColor;
    let r = colorLight.match(/\d+/g)[0];
    let g = colorLight.match(/\d+/g)[1];
    let b = colorLight.match(/\d+/g)[2];
    lightDiv.style.color = getContrastingColor(r, g, b);
    r = parseInt(r).toString(16).padStart(2, '0');
    g = parseInt(g).toString(16).padStart(2, '0');
    b = parseInt(b).toString(16).padStart(2, '0');
    let light = colorLight + " #" + r + g + b;
    lightText.outerHTML += "<span class='syscolors-color-span'><br/>" + light + "</span>";

    let colorDark = getComputedStyle(darkDiv).backgroundColor;
    r = colorDark.match(/\d+/g)[0];
    g = colorDark.match(/\d+/g)[1];
    b = colorDark.match(/\d+/g)[2];
    darkDiv.style.color = getContrastingColor(r, g, b);
    if (systemColorSet[index].color === "HighlightText") {
        console.warn("HighLightText contrasting color (in dark mode for rows of " + colorDark + ") was set to " + getContrastingColor(r, g, b));
        darkDiv.style.background = colorDark; // BUG: Without this, background was same as text color!!!
        //darkDiv.style.color = "red";
        //console.warn("HighLightText style reset to " + darkDiv.style.color);
    }
    r = parseInt(r).toString(16).padStart(2, '0');
    g = parseInt(g).toString(16).padStart(2, '0');
    b = parseInt(b).toString(16).padStart(2, '0');
    let dark = colorDark + " #" + r + g + b;
    darkText.outerHTML += "<span class='syscolors-color-span'><br/>" + dark + "</span>";

    tooltipSpan.innerHTML = nameSpan.outerHTML + "<br/>" + descSpan.outerHTML + "<br/>"
        //+ categorySpan.outerHTML + //"<br/>" 
        + "light mode: " + light + "<br/>dark mode: " + dark
        + clickText;
    tooltipSpan.addEventListener('click', function () {
        copyTextToClipboard(nameSpan.innerText + descSpan.innerText
            + "\ncategory: " + categorySpan.innerText
            + "\nlight mode: " + light + "\ndark mode: " + dark, tooltipSpan.id);
    });
}
