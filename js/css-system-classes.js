

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
        }
    ],
    "individual": [
        {
            "name": "Canvas",
            "description": "Application content or documents",
            "color": "CanvasText",
            "background-color": "Canvas"
        },
        {
            "name": "AccentColor",
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
            "name": "Selection",
            "description": "Selected text",
            "color": "HighlightText",
            "background-color": "Highlight"
        }
    ]   
#someID {
        a: link {
            /* non-active, non-visited links */
            color: LinkText;
    }
a:visited {
    /* visited links */
    color: VisitedText;
}

/* NOTE: Doesn't exist at https://www.w3.org/TR/css-color-4/#css-system-colors
a:hover {
  /* hovered links *
  color: FocusText; /* Focused links color *
}
*/

a:focus {
    /* focused links */
    color: ActiveText; /* BUG: no special color?*/
}
a:active {
    /* active links */
    color: ActiveText;
}
}
  .GrayText {
    /* disabled text */
    color: GrayText;
}
]
"IndividualColors": [  
  
  .system - Canvas {
        /* Background of application content or documents */
        background- color: Canvas;
  }
  
  .system - CanvasText {
        /* Text in application content or documents */
        color: CanvasText;
    }

        /*********************************
         * Input elements
         */

        .system - AccentColor {
            /* Background of accented user interface controls */
            background- color: AccentColor;
  }
  
  .system - AccentColorText {
        /* Text of accented user interface controls */
        color: AccentColorText;
    }

        .system - Field {
            /* Background of input fields */
            background- color: Field;
  }
  
  .system - FieldText {
        /* Text in input fields */
        color: FieldText;
    }

        /*********************************
         * Button elements
         */
        .system - ButtonBorder {
            /* The base border color for push buttons */
            color: ButtonBorder;
        }

            .system - ButtonFace {
                /* The face background color for push buttons */
                background- color: ButtonFace;
  }
  
  .system - ButtonText {
        /* Text on push buttons */
        color: ButtonText;
    }

        /*********************************
         * Links
         */

        .system - LinkText {
            /* Text in non-active, non-visited links. For light backgrounds, traditionally blue */
            color: LinkText;
        }

            .system - ActiveText {
                /* Text in active links. For light backgrounds, traditionally red */
                color: ActiveText;
            }

                .system - VisitedText {
                    /* Text in visited links. For light backgrounds, traditionally purple */
                    color: VisitedText;
                }

                    /*********************************
                     * Other miscellaneous
                     */

                    .system - GrayText {
                        /* Disabled text (Often, but not necessarily, gray) */
                        color: GrayText;
                    }

                        .system - Mark {
                            /* Background of text that has been specially marked (such as by the HTML mark element) */
                            background- color: Mark;
  }
  
  .system - MarkText {
        /* Text that has been specially marked (such as by the HTML mark element) */
        color: MarkText;
    }
  
  :: selection {
        /* Text of selected text */
        color: HighlightText;
        /* Background of selected text, for example from : :selection */
        background- color: Highlight;
  }
  
  .system - SelectedItem {
        /* Background of selected items, for example a selected checkbox */
        background- color: SelectedItem;
  }
  
  .system - SelectedItemText {
        /* Text of selected items */
        color: SelectedItemText;
    }

]
    ;


BuildGroupedCards(classTable.grouped);
BuildIndividualCards(classTable.individual);

function BuildGroupedCards(grouped) {
    let container = document.getElementById('grouped');
    grouped.forEach(group => {
        let card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <h2>${group.name}</h2>
            <p>${group.description}</p>
            <div class="color" style="background-color: ${group['background-color']}; color: ${group.color};">
                <span>${group['background-color']}</span>
                <span>${group.color}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function BuildIndividualCards(individual) {
    let container = document.getElementById('individual');
    individual.forEach(color => {
        let card = document.createElement('div');
        card.className = 'card';
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

