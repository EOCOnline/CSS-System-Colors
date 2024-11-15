const clickText = "&nbsp; &nbsp; (Click to copy)";
const clickedText = "&nbsp; &nbsp; (Copied!)";

// Build up an HTML card for each color & attach to the DOM
function createColorCard(systemColorSet, index, elementID) {//}, RGBA) {

    let nameSpan = document.createElement('span');
    nameSpan.className = "syscolors-color-span";
    nameSpan.innerHTML = systemColorSet[index].color;

    let descSpan = document.createElement('span');
    descSpan.className = "syscolors-desc-span";
    descSpan.innerHTML = " &mdash; " + systemColorSet[index].desc;

    let categorySpan = document.createElement('span');
    categorySpan.className = "`syscolors-category-span`";
    categorySpan.innerHTML = " {" + systemColorSet[index].category + "} ";

    /*
    let rgbaSpan = document.createElement('span');
    rgbaSpan.className = "syscolors-rgba-span";
    rgbaSpan.innerHTML = " [" + RGBA + "]";
  */
    let tooltipSpan = document.createElement('span');
    tooltipSpan.className = "syscolors-tooltip";
    tooltipSpan.id = "syscolors-tooltip-" + index;
    tooltipSpan.innerHTML = nameSpan.outerHTML + "<br/>" + descSpan.outerHTML + "<br/>" + categorySpan.outerHTML //+ "<br/>" + rgbaSpan.outerHTML 
        + clickText;
    tooltipSpan.addEventListener('click', function () {
        copyTextToClipboard(nameSpan.innerText + descSpan.innerText + categorySpan.innerText //+ rgbaSpan.innerText
            , tooltipSpan.id);
    });

    let cardDiv = document.createElement('div');
    cardDiv.className = "syscolors-card";
    cardDiv.style.backgroundColor = systemColorSet[index].color;

    // BUG: Use system colors here?! Or rerun for dark grids...
    //cardDiv.style.color = getContrastingColor(RGBA[0], RGBA[1], RGBA[2]);

    cardDiv.appendChild(nameSpan);
    cardDiv.appendChild(descSpan);
    cardDiv.appendChild(categorySpan);
    //cardDiv.appendChild(rgbaSpan);
    cardDiv.appendChild(tooltipSpan);

    document.getElementById(elementID).appendChild(cardDiv);
}

// These cards  look more like rows of a table...
function createColorRow(systemColorSet, index, elementID) {

    let nameSpan = document.createElement('span');
    nameSpan.className = "syscolors-color-span";
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
    tooltipSpan.id = "syscolors-table-tooltip-" + index;
    tooltipSpan.innerHTML = nameSpan.outerHTML + "<br/>" + descSpan.outerHTML + "<br/>" + categorySpan.outerHTML + //"<br/>" + rgbaSpan.outerHTML 
        + clickText;
    tooltipSpan.addEventListener('click', function () {
        copyTextToClipboard(nameSpan.innerText + descSpan.innerText + categorySpan.innerText //+ rgbaSpan.innerText
            , tooltipSpan.id);
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

    // Update colors based on what the browser actually used. getComputedStyle() is an expensive operation BTW.
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
}
