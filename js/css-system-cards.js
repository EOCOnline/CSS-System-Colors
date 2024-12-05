const clickText = "&nbsp; &nbsp; <strong>(Click to copy)</strong>";
const clickedText = "&nbsp; &nbsp; <strong>(Copied!)</strong>";

function generateClassCard(group) {
    let prettyClassName = group.name;
    if (group.name.startsWith("system-")) {
        prettyClassName = "system-<br/>" + group.name.replace("system-", "");
    }

    let styles = group['color'] ? `color:<b>${group['color']}</b>` : ``;
    styles += group['background-color'] ? `<br/>background-color:<b>${group['background-color']}</b>` : ``;
    styles += group['border-color'] ? `<br/>border-color:<b>${group['border-color']}</b>` : ``;
    styles += group['active-color'] ? `<br/>active-color:<b>${group['active-color']}</b>` : ``;
    styles += group['visited-color'] ? `<br/>visited-color:<b>${group['visited-color']}</b>` : ``;

    // make text visible on dark backgrounds
    let contrastText = "";
    if ((group.name == "system-Canvas") ||
        (group.name == "system-Field") ||
        (group.name == "system-ButtonFace")) {
        contrastText = `system-CanvasText`;
    }

    let card = document.createElement('div');
    card.className = `syscolors-class-card ${group.name}`;
    card.innerHTML = `
<div class="syscolors-cell-text">
<!-- className="Class" -->
  <span class="syscolors-category-span">${prettyClassName}</span>
  <!--span class="syscolors-name-span"><strong>${group.name}</strong> &mdash; </span-->
  <span class="syscolors-desc-span">${group.description}</span>
</div>
<div class="syscolors-cell-light  ${group.name} ${contrastText}"><span class="syscolors-details-span">${styles}</span></div>
<div class="syscolors-cell-dark  ${group.name} ${contrastText}"><span class="syscolors-details-span">${styles}</span></div>`;
    return card;
}



// These cards are wider, like 'rows' - & are used by TABLES
function createTableCard(systemColorSet, index, elementId) {

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

    tooltipSpan.innerHTML = `${nameSpan.outerHTML}<br/>${descSpan.outerHTML}<br/>light mode: ${light}<br/>dark mode: ${dark}${clickText}`;
    tooltipSpan.addEventListener('click', function () {
        copyTextToClipboard(`${nameSpan.innerText}${descSpan.innerText}\ncategory: ${categorySpan.innerText}\nlight mode: ${light}\ndark mode: ${dark}`, tooltipSpan.id);
    });
}



// Build up an HTML card for each color & attach to the DOM - used by GRIDS
function createGridCard(systemColorSet, index, elementId) {

    let isDarkMode = elementId.includes("dark");
    let mode = isDarkMode ? 'dark' : 'light';
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

    let cardDiv = document.createElement('div');
    cardDiv.className = elementId.includes("deprecated") ? "syscolors-card syscolors-tall-row" : "syscolors-card";

    // Apply background color to inner div, so as to not affect cardDiv's big left border color!
    cardInnerDiv.style.backgroundColor = systemColorSet[index].color;
    cardInnerDiv.appendChild(nameSpan);
    cardInnerDiv.appendChild(descSpan);
    cardInnerDiv.appendChild(rgbaSpan);

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
        console.warn("WORKAROUND: HighLightText contrasting color (for dark grid " + color + ") forcibly set to " + getContrastingColor(r, g, b));
        cardInnerDiv.style.backgroundColor = color; // Ensures background color is set correctly, not to the text color.
        //cardDiv.style.color = "white";
        //console.warn("HighLightText style reset to " + cardDiv.style.color);
    }
    let hexValues = "#" + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0');
    rgbaSpan.innerHTML = ` [${color} #${hexValues}]`;
    //rgbaSpan.innerHTML = " [" + color + " #" + r + g + b + "]";

    tooltipSpan.innerHTML = `${nameSpan.outerHTML}<br/>${descSpan.outerHTML}<br/>${mode} mode color: ${rgbaSpan.outerHTML}${clickText}`;
    // categorySpan.outerHTML + "<br/>" 

    let textToCopy = nameSpan.innerText + descSpan.innerText
        + "\ncategory: " + categorySpan.innerText
        + "\n" + mode + " color " + rgbaSpan.innerText;
    tooltipSpan.addEventListener('click', function () {
        copyTextToClipboard(textToCopy, tooltipSpan.id);
    });

    // Create an RGBA key for the downloadable json file
    let rHex = r.toString(16).padStart(2, '0');
    let gHex = g.toString(16).padStart(2, '0');
    let bHex = b.toString(16).padStart(2, '0');
    if (mode === "light") { // syscolors-grid-light || syscolors-deprecated-light
        systemColorSet[index].lightModeRGBA = color + "= #" + rHex + gHex + bHex;
    } else { // syscolors-grid-dark || syscolors-deprecated-dark
        systemColorSet[index].darkModeRGBA = color + "= #" + rHex + gHex + bHex;
    }
}
