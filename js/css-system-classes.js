// This table should reflect (be derived from?!) css-system-colors.css
const classTable = {
    "grouped": [
        {
            "name": "Canvas",
            "description": "Application content or documents",
            "color": "CanvasText",
            "background-color": "Canvas"
        },
        {
            "name": "Accent",
            "description": "Accented user interface controls",
            "color": "AccentColorText",
            "background-color": "AccentColor"
        },
        {
            "name": "Field",
            "description": "Input fields",
            "color": "FieldText",
            "background-color": "Field"
        },
        {
            "name": "Mark",
            "description": "Text that has been specially marked (such as by the HTML mark element)",
            "color": "MarkText",
            "background-color": "Mark"
        },
        {
            "name": "Button",
            "description": "Push buttons",
            "color": "ButtonText",
            "background-color": "ButtonFace",
            "border-color": "ButtonBorder"
        },
        {
            "name": "SelectedItem",
            "description": "Selected items",
            "color": "SelectedItemText",
            "background-color": "SelectedItem"
        },
        {
            "name": "::Selection",
            "description": "Selected text",
            "color": "HighlightText",
            "background-color": "Highlight"
        },
        {
            "name": "Link",
            "description": "Links",
            "color": "LinkText", /* non-active, non-visited links */
            "active-color": "ActiveText", /* active, non-visited links */
            "visited-color": "VisitedText" /* visited links */
        },
        {
            "name": "GrayText",
            "description": "Disabled text",
            "color": "GrayText"
        }
    ],
    "individual": [
        {
            "name": "system-Canvas",
            "description": "Background of application content or documents",
            "background-color": "Canvas"
        },
        {
            "name": "system-CanvasText",
            "description": "Text in application content or documents",
            "color": "CanvasText"
        },
        {
            "name": "system-AccentColor",
            "description": "Background of accented user interface controls",
            "background-color": "AccentColor"
        },
        {
            "name": "system-AccentColorText",
            "description": "Text of accented user interface controls",
            "color": "AccentColorText"
        },
        {
            "name": "system-Field",
            "description": "Background of input fields",
            "background-color": "Field"
        },
        {
            "name": "system-FieldText",
            "description": "Text in input fields",
            "color": "FieldText"
        },
        {
            "name": "system-ButtonBorder",
            "description": "The base border color for push buttons",
            "border-color": "ButtonBorder"
        },
        {
            "name": "system-ButtonFace",
            "description": "The face background color for push buttons",
            "background-color": "ButtonFace"
        },
        {
            "name": "system-ButtonText",
            "description": "Text on push buttons",
            "color": "ButtonText"
        },
        {
            "name": "system-LinkText",
            "description": "Text in non-active, non-visited links",
            "color": "LinkText"
        },
        {
            "name": "system-ActiveText",
            "description": "Text in active links",
            "color": "ActiveText"
        },
        {
            "name": "system-VisitedText",
            "description": "Text in visited links",
            "color": "VisitedText"
        },
        {
            "name": "system-GrayText",
            "description": "Disabled text",
            "color": "GrayText"
        },
        {
            "name": "system-Mark",
            "description": "Background of text that has been specially marked (such as by the HTML mark element)",
            "background-color": "Mark",
        },
        {
            "name": "system-MarkText",
            "description": "Text of specially marked text",
            "color": "MarkText"
        },
        {
            "name": "system-SelectedItem",
            "description": "Background of selected items",
            "background-color": "SelectedItem"
        },
        {
            "name": "system-SelectedItemText",
            "description": "Text of selected items",
            "color": "SelectedItemText"
        },
        {
            "name": "system-::Selection  NEEDS VERIFICATION!",
            "description": "Background of selected text",
            "background-color": "Highlight",
            "color": "HighlightText"
        },
        {
            "name": "system-Highlight",
            "description": "Background of selected text",
            "background-color": "Highlight",
        },
        {
            "name": "system-HighlightText",
            "description": "Text of selected text",
            "color": "HighlightText"
        }
    ]
};

function BuildClassCards() {
    let container = document.getElementById(`syscolors-class-grouped`);
    GenerateClassCards(container, classTable.grouped);
    //container = document.getElementById(`syscolors-class-individual`);
    //GenerateClassCards(container, classTable.individual);

    classTable.individual.forEach(group => {
        document.getElementById(`syscolors-class-individual`).appendChild(
            GenerateClassCard(group));
    });
}

function GenerateClassCards(container, segment) {
    segment.forEach(group => {

        let prettyClassName = group.name;
        if (group.name.startsWith("system-")) {
            prettyClassName = "system-<br/>" + group.name.replace("system-", "");
        }

        let styles = group['color'] ? `color:<b>${group['color']}</b>` : ``;
        styles += group['background-color'] ? `<br/>background-color:<b>${group['background-color']}</b>` : ``;
        styles += group['border-color'] ? `<br/>border-color:<b>${group['border-color']}</b>` : ``;
        styles += group['active-color'] ? `<br/>active-color:<b>${group['active-color']}</b>` : ``;
        styles += group['visited-color'] ? `<br/>visited-color:<b>${group['visited-color']}</b>` : ``;

        let contrastText = "";
        if ((group.name == "system-Canvas") ||
            (group.name == "system-Field") ||
            (group.name == "system-ButtonFace")) {
            // ensure that the color is visible on the background
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
        container.appendChild(card);
    });
}

function GenerateClassCard(group) {
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