const classTable = {
    "grouped": [
        // #region(collapsed)
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
        // #endregion
    ],
    "individual": [
        // #region(collapsed)
        {
            "name": "Canvas",
            "description": "Background of application content or documents",
            "background-color": "Canvas"
        },
        {
            "name": "CanvasText",
            "description": "Text in application content or documents",
            "color": "CanvasText"
        },
        {
            "name": "AccentColor",
            "description": "Background of accented user interface controls",
            "background-color": "AccentColor"
        },
        {
            "name": "AccentColorText",
            "description": "Text of accented user interface controls",
            "color": "AccentColorText"
        },
        {
            "name": "Field",
            "description": "Background of input fields",
            "background-color": "Field"
        },
        {
            "name": "FieldText",
            "description": "Text in input fields",
            "color": "FieldText"
        },
        {
            "name": "ButtonBorder",
            "description": "The base border color for push buttons",
            "border-color": "ButtonBorder"
        },
        {
            "name": "ButtonFace",
            "description": "The face background color for push buttons",
            "background-color": "ButtonFace"
        },
        {
            "name": "ButtonText",
            "description": "Text on push buttons",
            "color": "ButtonText"
        },
        {
            "name": "LinkText",
            "description": "Text in non-active, non-visited links",
            "color": "LinkText"
        },
        {
            "name": "ActiveText",
            "description": "Text in active links",
            "color": "ActiveText"
        },
        {
            "name": "VisitedText",
            "description": "Text in visited links",
            "color": "VisitedText"
        },
        {
            "name": "GrayText",
            "description": "Disabled text",
            "color": "GrayText"
        },
        {
            "name": "Mark",
            "description": "Background of text that has been specially marked (such as by the HTML mark element)",
            "background-color": "Mark",
        },
        {
            "name": "MarkText",
            "description": "Text of specially marked text",
            "color": "MarkText"
        },
        {
            "name": "SelectedItem",
            "description": "Background of selected items",
            "background-color": "SelectedItem"
        },
        {
            "name": "SelectedItemText",
            "description": "Text of selected items",
            "color": "SelectedItemText"
        },
        {
            "name": "::Selection  NEEDS VERIFICATION!",
            "description": "Background of selected text",
            "background-color": "Highlight",
            "color": "HighlightText"
        },
        {
            "name": "Highlight",
            "description": "Background of selected text",
            "background-color": "Highlight",
        },
        {
            "name": "HighlightText",
            "description": "Text of selected text",
            "color": "HighlightText"
        }
        // #endregion
    ]
};

function BuildGroupedClassCards(grouped) {
    let container = document.getElementById('syscolors-class-grouped');
    grouped.forEach(group => {
        let card = document.createElement('div');
        card.className = 'syscolors-class-card';

        let cell = `<span class="`;
        cell += group['color'] ? ` color:${['group.color']}` : ``;
        cell += group['background-color'] ? ` background-color:${group['background-color']}` : ``;
        cell += group['border-color'] ? ` border-color:${group['border-color']}` : ``;
        // "active-color": "ActiveText", /* active, non-visited links */
        // "visited-color": "VisitedText" /* visited links */
        cell += `">Some Text</span>`;

        card.innerHTML = `
<div class="syscolors-row-text">
  <span class="syscolors-category-span" className="Class">${group.name}</span>
  <span class="syscolors-color-span"><strong>${group.name}</strong></span>
  <span class="syscolors-desc-span"> &mdash; ${group.description} </span>
</div>
<div class="syscolors-row-light">${cell}</div>
<div class="syscolors-row-dark Canvas">${cell}</div>`;
        container.appendChild(card);
    });
}


function BuildIndividualClassCards(individual) {
    let container = document.getElementById('syscolors-class-individual');
    individual.forEach(color => {
        let card = document.createElement('div');
        card.className = 'syscolors-class-card';
        card.innerHTML = `
            <h2>${color.name}</h2>
            <p>${color.description}</p>
            <div class="color" style="background-color: ${color['background-color']}; color: ${color.color};">
                <span>${color['background-color']}</span>
                <span>${color.color}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

