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
    tooltipSpan.id = `syscolors-tooltip-${elementId.includes("deprecated") ? "deprecated" : ""}${mode}${index}`;

    let cardInnerDiv = document.createElement('div');
    cardInnerDiv.className = "syscolors-card-inner";
    /*if (elementId == "syscolors-deprecated-table") {
        cardDiv.className = "syscolors-row-card syscolors-tall-row";
    } else {
        cardDiv.className = "syscolors-row-card";
    }*/
    // Apply background color to inner div, so as to not affect cardDiv's big left border color!
    cardInnerDiv.style.backgroundColor = systemColorSet[index].color;
    cardInnerDiv.appendChild(nameSpan);
    cardInnerDiv.appendChild(descSpan);
    cardInnerDiv.appendChild(rgbaSpan);

    let cardDiv = document.createElement('div');
    if ((elementId == "syscolors-deprecated-light") || (elementId == "syscolors-deprecated-dark")) {
        cardDiv.className = "syscolors-card syscolors-tall-row";
    } else {
        cardDiv.className = "syscolors-card";
    }
    cardDiv.appendChild(categorySpan);
    cardDiv.appendChild(tooltipSpan);
    cardDiv.appendChild(cardInnerDiv);
    if (
        document.getElementById(elementId) === null) {
        console.error("Element " + elementId + " not found!");
    }
    else {
        document.getElementById(elementId).appendChild(cardDiv);
    }

    // Card is built & complete. Now update colors based on what the browser actually used. 
    let computedStyle = getComputedStyle(cardInnerDiv);
    let color = computedStyle.backgroundColor;
    let rgbValues = color.match(/\d+/g).map(Number);
    let [r, g, b] = rgbValues;
    cardInnerDiv.style.color = getContrastingColor(r, g, b);

    if (systemColorSet[index].color === "HighlightText" && mode === "dark") {
        console.warn("WORKAROUND: HighLightText contrasting color (for dark grid " + color + ") was forcibly set to " + getContrastingColor(r, g, b));
        cardInnerDiv.style.backgroundColor = color;// BUG: Without this, background was same as text color!!!
        //cardDiv.style.color = "white";
        //console.warn("HighLightText style reset to " + cardDiv.style.color);
    }
    let hexValues = rgbValues.map(value => value.toString(16).padStart(2, '0')).join('');
    rgbaSpan.innerHTML = ` [${color} #${hexValues}]`;
    rgbaSpan.innerHTML = " [" + color + " #" + r + g + b + "]";


    tooltipSpan.innerHTML = nameSpan.outerHTML + "<br/>" + descSpan.outerHTML + "<br/>"
    //+ categorySpan.outerHTML + "<br/>" 
    function handleTooltipClick(nameSpan, descSpan, categorySpan, modeOrLight, rgbaOrDark, tooltipSpan) {
        let textToCopy = nameSpan.innerText + descSpan.innerText
            + "\ncategory: " + categorySpan.innerText
            + (typeof modeOrLight === 'string' ? "\n" + modeOrLight + " color " + rgbaOrDark.innerText : "\nlight mode: " + modeOrLight + "\ndark mode: " + rgbaOrDark);
        copyTextToClipboard(textToCopy, tooltipSpan.id);
    }
    + mode + " mode color: " + rgbaSpan.outerHTML + clickText;
    tooltipSpan.addEventListener('click', handleTooltipClick.bind(null, nameSpan, descSpan, categorySpan, mode, rgbaSpan, tooltipSpan));
});

// Create an RGBA key in the json file for download
tooltipSpan.addEventListener('click', handleTooltipClick.bind(null, nameSpan, descSpan, categorySpan, mode, rgbaSpan, tooltipSpan));
    }

// Define the handleTooltipClick function separately
function handleTooltipClick(nameSpan, descSpan, categorySpan, modeOrLight, rgbaOrDark, tooltipSpan) {
    let textToCopy = nameSpan.innerText + descSpan.innerText
        + "\ncategory: " + categorySpan.innerText
        + (typeof modeOrLight === 'string' ? "\n" + modeOrLight + " color " + rgbaOrDark.innerText : "\nlight mode: " + modeOrLight + "\ndark mode: " + rgbaOrDark);
    copyTextToClipboard(textToCopy, tooltipSpan.id);
}
    } else if (elementId == "syscolors-grid-dark" || elementId == "syscolors-deprecated-dark") {
    systemColorSet[index].darkModeRGBA = color + "= #" + r + g + b;
}
}


// These cards look more like rows - & are used by TABLES
function createColorRow(systemColorSet, index, elementId) {

    let nameSpan = document.createElement('span');
    nameSpan.className = "syscolors-name-span";
    nameSpan.innerHTML = systemColorSet[index].color;
    const lightText = nameSpan.cloneNode(true);
    const darkText = nameSpan.cloneNode(true);

    const descSpan = document.createElement('span');
    descSpan.className = "syscolors-desc-span";
    descSpan.innerHTML = ` &mdash; ${systemColorSet[index].desc}`;

    const categorySpan = document.createElement('span');
    categorySpan.className = "syscolors-category-span";
    categorySpan.setAttribute("category", systemColorSet[index].category);
    categorySpan.innerHTML = systemColorSet[index].category.replace(/-/g, "<br/>");

    const tooltipSpan = document.createElement('span');
    tooltipSpan.className = "syscolors-tooltip";
    tooltipSpan.id = `syscolors-row-tooltip-${elementId.includes("deprecated") ? "deprecated" : ""}${index}`;

    const cardDiv = document.createElement('div');
    cardDiv.className = elementId === "syscolors-deprecated-table" ? "syscolors-row-card syscolors-tall-row" : "syscolors-row-card";
    cardDiv.appendChild(tooltipSpan);

    const textDiv = document.createElement('div');
    textDiv.className = "syscolors-row-text";
    textDiv.appendChild(categorySpan);
    textDiv.appendChild(nameSpan);
    textDiv.appendChild(descSpan);

    const lightDiv = document.createElement('div');
    lightDiv.className = "syscolors-row-light";
    lightDiv.style.backgroundColor = systemColorSet[index].color;
    lightDiv.appendChild(lightText);

    const darkDiv = document.createElement('div');
    darkDiv.className = "syscolors-row-dark";
    darkDiv.style.backgroundColor = systemColorSet[index].color;
    darkDiv.appendChild(darkText);

    cardDiv.appendChild(textDiv);
    cardDiv.appendChild(lightDiv);
    cardDiv.appendChild(darkDiv);

    const parentElement = document.getElementById(elementId);
    if (parentElement === null) {
        console.error(`Element ${elementId} not found!`);
    } else {
        parentElement.appendChild(cardDiv);
    }

    // This card is built & complete. 
    // Now update colors based on what the browser actually used.
    nameSpan.innerHTML = systemColorSet[index].color;
    let computedStyleLight = getComputedStyle(lightDiv);
    const colorLight = computedStyleLight.backgroundColor;
    let rgbValuesLight = colorLight.match(/\d+/g).map(Number);
    let [r, g, b] = rgbValuesLight;
    lightDiv.style.color = getContrastingColor(r, g, b);
    const lightHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    const light = `${colorLight} ${lightHex}`;
    lightText.outerHTML += `<span class='syscolors-color-span'><br/>${light}</span>`;

    let computedStyleDark = getComputedStyle(darkDiv);
    const colorDark = computedStyleDark.backgroundColor;
    let rgbValuesDark = colorDark.match(/\d+/g).map(Number);
    [r, g, b] = rgbValuesDark;
    darkDiv.style.color = getContrastingColor(r, g, b);
    if (systemColorSet[index].color === "HighlightText") {
        console.warn(`HighLightText contrasting color (in dark mode for rows of ${colorDark}) was set to ${getContrastingColor(r, g, b)}`);
        darkDiv.style.background = colorDark;
    }
    const darkHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    const dark = `${colorDark} ${darkHex}`;
    darkText.outerHTML += `<span class='syscolors-color-span'><br/>${dark}</span>`;
    darkText.outerHTML += `<span class='syscolors-color-span'><br/>${dark}</span>`;

    tooltipSpan.innerHTML = `${nameSpan.outerHTML}<br/>${descSpan.outerHTML}<br/>light mode: ${light}<br/>dark mode: ${dark}${clickText}`;
    tooltipSpan.addEventListener('click', function () {
        copyTextToClipboard(`${nameSpan.innerText}${descSpan.innerText}\ncategory: ${categorySpan.innerText}\nlight mode: ${light}\ndark mode: ${dark}`, tooltipSpan.id);
    });
}
