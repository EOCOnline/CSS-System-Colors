const clickText = "&nbsp; &nbsp; <strong>(Click to copy)</strong>";
const clickedText = "&nbsp; &nbsp; <strong>(Copied!)</strong>";

function generateClassCard(className, color) {
    let classCard;
    let categorySpan;
    let nameSpan;
    let descSpan;
    let detailsSpan;
    let contrastingBackground = "";

    if (className !== "") {
        classCard = className.name;
        categorySpan = className.name;
        nameSpan = className.description;
        detailsSpan = 'Sample';

        // get all currentColors with category of className.name
        let colors = systemColorsJson.currentColors.filter(color => color.category === className.name);

        descSpan = "<ul class='classList'>";
        colors.forEach(color => {
            descSpan += "<li>" + color['style'] + "</li>";
        });
        descSpan += "</ul>";
    } else {
        classCard = "system-" + color.systemColor;
        categorySpan = color.category;
        nameSpan = color.systemColor;
        descSpan = color.desc;
        detailsSpan = color.style;

        if ((color.category == "Canvas") ||
            (color.category == "Field") ||
            (color.category == "ButtonFace")) {
            contrastingBackground = `Canvas`;
        }
    }

    let card = document.createElement('div');
    card.className = `syscolors-class-card ${classCard}`;
    card.innerHTML = `
<div class="syscolors-cell-text">
  <span class="syscolors-category-span">${categorySpan}</span>
  <span class="syscolors-name-span">${nameSpan}</span>
  <span class="syscolors-desc-span">${descSpan}</span>
</div>

<div class="syscolors-cell-light ${classCard} ${contrastingBackground}"><span class="syscolors-details-span">${detailsSpan}</span></div>
<div class="syscolors-cell-dark ${classCard} ${contrastingBackground}"><span class="syscolors-details-span">${detailsSpan}</span></div>`;
    return card;
}


// These cards are wider, like 'rows' - & are used by TABLES
function createTableCard(color, elementId) {

    let nameSpan = document.createElement('span');
    nameSpan.className = "syscolors-name-span";
    nameSpan.innerHTML = color.systemColor;
    const lightText = nameSpan.cloneNode(true);
    const darkText = nameSpan.cloneNode(true);

    const descSpan = document.createElement('span');
    descSpan.className = "syscolors-desc-span";
    descSpan.innerHTML = ` &mdash; ${color.desc} `;

    const categorySpan = document.createElement('span');
    categorySpan.className = "syscolors-category-span";
    categorySpan.setAttribute("category", color.category);
    categorySpan.innerHTML = color.category.replace(/-/g, "<br/>");

    const tooltipSpan = document.createElement('span');
    tooltipSpan.className = "syscolors-tooltip";
    tooltipSpan.id = `syscolors-row-tooltip-${elementId.includes("deprecated") ? "deprecated" : ""}${color.systemColor} `;

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
    lightDiv.style.backgroundColor = color.systemColor;
    lightDiv.appendChild(lightText);

    const darkDiv = document.createElement('div');
    darkDiv.className = "syscolors-row-dark";
    darkDiv.style.backgroundColor = color.systemColor;
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
    let r, g, b, a = 1;
    nameSpan.innerHTML = color.systemColor;
    let computedStyleLight = getComputedStyle(lightDiv);
    const colorLight = computedStyleLight.backgroundColor;
    let rgbaValuesLight = colorLight.match(/[\d.]+/g).map(Number);
    [r, g, b] = rgbaValuesLight;
    if (rgbaValuesLight.length == 4) {
        a = Math.round(rgbaValuesLight[3] * 255);
    }
    lightDiv.style.color = getContrastingColor(r, g, b); // NOTE:  ignores alpha channel
    const lightHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a ? a.toString(16).padStart(2, '0') : ''} `;
    const light = `${colorLight} ${lightHex} `;
    lightText.outerHTML += `<span class='syscolors-color-span'><br />${light}</span> `;

    let computedStyleDark = getComputedStyle(darkDiv);
    const colorDark = computedStyleDark.backgroundColor;
    let rgbaValuesDark = colorDark.match(/[\d.]+/g).map(Number);
    [r, g, b] = rgbaValuesDark;
    if (rgbaValuesDark.length == 4) {
        a = Math.round(rgbaValuesDark[3] * 255);
    }
    darkDiv.style.color = getContrastingColor(r, g, b);
    if (color.systemColor === "HighlightText") {
        console.warn(`HighLightText contrasting color(in dark mode for rows of ${colorDark}) was set to ${getContrastingColor(r, g, b)} `);
        darkDiv.style.backgroundColor = colorDark;
        //darkDiv.style.color = "red";
    }
    const darkHex = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}${a ? a.toString(16).padStart(2, '0') : ''} `;
    const dark = `${colorDark} ${darkHex} `;
    darkText.outerHTML += `<span class='syscolors-color-span'><br />${dark}</span> `;

    tooltipSpan.innerHTML = `${nameSpan.outerHTML} <br />${descSpan.outerHTML} <br />light mode: ${light} <br />dark mode: ${dark}${clickText} `;
    tooltipSpan.addEventListener('click', function () {
        copyTextToClipboard(`${nameSpan.innerText}${descSpan.innerText} \ncategory: ${categorySpan.innerText} \nlight mode: ${light} \ndark mode: ${dark} `, tooltipSpan.id);
    });
}



// Build up an HTML card for each color & attach to the DOM - used by GRIDS
function createGridCard(color, elementId) {

    let isDarkMode = elementId.includes("dark");
    let mode = isDarkMode ? 'dark' : 'light';
    let nameSpan = document.createElement('span');
    nameSpan.className = "syscolors-name-span";
    nameSpan.innerHTML = color.systemColor;

    let descSpan = document.createElement('span');
    descSpan.className = "syscolors-desc-span";
    descSpan.innerHTML = " &mdash; " + color.desc;

    let categorySpan = document.createElement('span');
    categorySpan.className = "syscolors-category-span";
    // add attribute to span
    categorySpan.setAttribute("category", color.category);
    categorySpan.innerHTML = color.category.replace(/-/g, "<br/>");

    let rgbaSpan = document.createElement('span');
    rgbaSpan.className = "syscolors-rgba-span";

    let tooltipSpan = document.createElement('span');
    tooltipSpan.className = "syscolors-tooltip";
    tooltipSpan.id = `syscolors-tooltip-${elementId.includes("deprecated") ? "deprecated" : ""}${mode}${color.systemColor} `;

    let cardInnerDiv = document.createElement('div');
    cardInnerDiv.className = "syscolors-card-inner";

    let cardDiv = document.createElement('div');
    cardDiv.className = elementId.includes("deprecated") ? "syscolors-card syscolors-tall-row" : "syscolors-card";

    // Apply background color to inner div, so as to not affect cardDiv's big left border color!
    cardInnerDiv.style.backgroundColor = color.systemColor;
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
    let backColor = computedStyle.backgroundColor;
    let rgbaValues = backColor.match(/[\d.]+/g).map(Number);
    let [r, g, b] = rgbaValues;
    let a = 255
    if (rgbaValues.length == 4) {
        a = Math.round(rgbaValues[3] * 255);
    }
    cardInnerDiv.style.color = getContrastingColor(r, g, b);

    if (color.systemColor === "HighlightText" && mode === "dark") {
        console.warn("WORKAROUND: HighLightText contrasting color (for dark grid " + color + ") forcibly set to " + getContrastingColor(r, g, b));
        cardInnerDiv.style.backgroundColor = "black"; // Ensures background color is set correctly, not to the text color.
        //cardInnerDiv.style.backgroundColor = getContrastingColor(r, g, b); // Ensures background color is set correctly, not to the text color.
        //cardInnerDiv.style.color = "brown";
        // console.warn("HighLightText style reset to " + cardDiv.style.color);
    }
    let hexValues = "#" + r.toString(16).padStart(2, '0') + g.toString(16).padStart(2, '0') + b.toString(16).padStart(2, '0') + (a != 255 ? a.toString(16).padStart(2, '0') : '');
    rgbaSpan.innerHTML = ` [rgba(${rgbaValues}) = ${hexValues}]`;
    tooltipSpan.innerHTML = `${nameSpan.outerHTML} <br />${descSpan.outerHTML} <br />${mode} mode color: ${rgbaSpan.outerHTML}${clickText} `;

    let textToCopy = nameSpan.innerText + descSpan.innerText
        + "\ncategory: " + categorySpan.innerText
        + "\n" + mode + " color " + rgbaSpan.innerText;
    tooltipSpan.addEventListener('click', function () {
        copyTextToClipboard(textToCopy, tooltipSpan.id);
    });

    if (mode === "light") { // syscolors-grid-light || syscolors-deprecated-light
        color.lightModeRGBA = rgbaSpan.innerHTML;
    } else { // syscolors-grid-dark || syscolors-deprecated-dark
        color.darkModeRGBA = rgbaSpan.innerHTML;
    }
}
