const clickText = "&nbsp; &nbsp; (Click to copy)";
const clickedText = "&nbsp; &nbsp; (Copied!)";


// Build up an HTML card for each color & attach to the DOM
function createColorCard(systemColorSet, index, elementID) {//}, RGBA) {

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
    tooltipSpan.innerHTML = nameSpan.outerHTML + "<br/>" + descSpan.outerHTML + "<br/>" + categorySpan.outerHTML + "<br/>" + rgbaSpan.outerHTML + clickText;
    tooltipSpan.addEventListener('click', function () {
        copyTextToClipboard(nameSpan.innerText + descSpan.innerText //+ categorySpan.innerText 
            + rgbaSpan.innerText, tooltipSpan.id);
    });

    let cardInnerDiv = document.createElement('div');
    cardInnerDiv.className = "syscolors-card-inner";
    cardInnerDiv.appendChild(categorySpan);
    cardInnerDiv.appendChild(nameSpan);
    cardInnerDiv.appendChild(descSpan);
    cardInnerDiv.appendChild(rgbaSpan);
    cardInnerDiv.appendChild(tooltipSpan);

    let cardDiv = document.createElement('div');
    cardDiv.className = "syscolors-card";
    cardDiv.style.backgroundColor = systemColorSet[index].color;

    cardDiv.appendChild(cardInnerDiv);

    document.getElementById(elementID).appendChild(cardDiv);


    // Card is built & complete. 
    // Now update colors based on what the browser actually used. getComputedStyle() is an expensive operation BTW.
    let color = getComputedStyle(cardDiv).backgroundColor;
    let r = color.match(/\d+/g)[0];
    let g = color.match(/\d+/g)[1];
    let b = color.match(/\d+/g)[2];
    cardDiv.style.color = getContrastingColor(r, g, b);
    r = parseInt(r).toString(16).padStart(2, '0');
    g = parseInt(g).toString(16).padStart(2, '0');
    b = parseInt(b).toString(16).padStart(2, '0');
    rgbaSpan.innerHTML = " [" + color + " #" + r + g + b + "]";
    //  TODO: Add computed color to the JSON file that folks can download
}



// These cards  look more like rows of a table...
function createColorRow(systemColorSet, index, elementID) {

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

    // BUG: This ain't happening!
    let tooltipSpan = document.createElement('span');
    tooltipSpan.className = "syscolors-tooltip";
    tooltipSpan.id = "syscolors-table-tooltip-" + index;
    tooltipSpan.innerHTML = nameSpan.outerHTML + "<br/>" + descSpan.outerHTML + "<br/>" + categorySpan.outerHTML + //"<br/>" + rgbaSpan.outerHTML 
        + clickText;
    tooltipSpan.addEventListener('click', function () {
        copyTextToClipboard(nameSpan.innerText + descSpan.innerText //+ categorySpan.innerText 
            + rgbaSpan.innerText, tooltipSpan.id);
    });

    let cardDiv = document.createElement('div');
    cardDiv.className = "syscolors-row-card";
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

    document.getElementById(elementID).appendChild(cardDiv);


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

    lightText.innerHTML = systemColorSet[index].color + "<br/>" + colorLight + "<br/>" + "#" + r + g + b;

    let colorDark = getComputedStyle(darkDiv).backgroundColor;
    r = colorDark.match(/\d+/g)[0];
    g = colorDark.match(/\d+/g)[1];
    b = colorDark.match(/\d+/g)[2];
    darkDiv.style.color = getContrastingColor(r, g, b);
    r = parseInt(r).toString(16).padStart(2, '0');
    g = parseInt(g).toString(16).padStart(2, '0');
    b = parseInt(b).toString(16).padStart(2, '0');
    darkText.innerHTML = systemColorSet[index].color + "<br/>" + colorDark + "<br/>" + "#" + r + g + b;
    //  TODO: Add computed colors to the JSON file that folks can download
}
