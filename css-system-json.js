/**
 * #region: System Colors JSON Data
 * systemColorsJson contains the system colors data from the standard.
 * 'systemColorsJson.info' contains metadata about the colors.
 * 'systemColorsJson.currentColors' contains the current system color array.
 * '.systemColorsJson.deprecatedColors' contains the deprecated system color array.
 * Reading this from a file is problematic due to CORS issues.
 * This global structure is updated by the 'processJson' function.
 */
let systemColorsJson =
{
    "info": {
        "credit": "Created by eoc.online CSS System Colors tool: https://github.com/eoconline/css-system-colors"
    },
    "currentColors": [
        {
            "color": "AccentColor",
            "desc": "Background of accented user interface controls.",
            "category": "interface"
        },
        {
            "color": "AccentColorText",
            "desc": "Text of accented user interface controls.",
            "category": "interface"
        },
        {
            "color": "ActiveText",
            "desc": "Text in active links. For light backgrounds, traditionally red.",
            "category": "links"
        },
        {
            "color": "ButtonBorder",
            "desc": "The base border color for push buttons.",
            "category": "input-button"
        },
        {
            "color": "ButtonFace",
            "desc": "The face background color for push buttons.",
            "category": "input-button"
        },
        {
            "color": "ButtonText",
            "desc": "Text on push buttons.",
            "category": "input-button"
        },
        {
            "color": "Canvas",
            "desc": "Background of application content or documents.",
            "category": "general"
        },
        {
            "color": "CanvasText",
            "desc": "Text in application content or documents.",
            "category": "general"
        },
        {
            "color": "Field",
            "desc": "Background of input fields.",
            "category": "input"
        },
        {
            "color": "FieldText",
            "desc": "Text in input fields.",
            "category": "input"
        },
        {
            "color": "GrayText",
            "desc": "Disabled text. (Often, but not necessarily, gray.)",
            "category": "general"
        },
        {
            "color": "Highlight",
            "desc": "Background of selected text, for example from : :selection.",
            "category": "selection"
        },
        {
            "color": "HighlightText",
            "desc": "Text of selected text.",
            "category": "selection"
        },
        {
            "color": "LinkText",
            "desc": "Text in non-active, non-visited links. For light backgrounds, traditionally blue.",
            "category": "links"
        },
        {
            "color": "Mark",
            "desc": "Background of text that has been specially marked (such as by the HTML mark element).",
            "category": "general"
        },
        {
            "color": "MarkText",
            "desc": "Text that has been specially marked (such as by the HTML mark element).",
            "category": "general"
        },
        {
            "color": "SelectedItem",
            "desc": "Background of selected items, for example a selected checkbox.",
            "category": "selection"
        },
        {
            "color": "SelectedItemText",
            "desc": "Text of selected items.",
            "category": "selection"
        },
        {
            "color": "VisitedText",
            "desc": "Text in visited links. For light backgrounds, traditionally purple.",
            "category": "links"
        }
    ],
    "deprecatedColors": [
        {
            "color": "ActiveBorder",
            "desc": "Active window border. Same as ButtonBorder",
            "category": "window"
        },
        {
            "color": "ActiveCaption",
            "desc": "Active window caption. Same as Canvas",
            "category": "window"
        },
        {
            "color": "AppWorkspace",
            "desc": "Background color of multiple document interface. Same as Canvas",
            "category": "MDI"
        },
        {
            "color": "Background",
            "desc": "Desktop background. Same as Canvas.",
            "category": "window"
        },
        {
            "color": "ButtonHighlight",
            "desc": "The color of the border facing the light source for 3-D elements that appear 3-D due to one layer of surrounding border. Same as ButtonFace.",
            "category": "input-button"
        },
        {
            "color": "ButtonShadow",
            "desc": "The color of the border away from the light source for 3-D elements that appear 3-D due to one layer of surrounding border. Same as ButtonFace.",
            "category": "input-button"
        },
        {
            "color": "CaptionText",
            "desc": "Text in caption, size box, and scrollbar arrow box. Same as CanvasText.",
            "category": "window"
        },
        {
            "color": "InactiveBorder",
            "desc": "Inactive window border. Same as ButtonBorder.",
            "category": "window"
        },
        {
            "color": "InactiveCaption",
            "desc": "Inactive window caption. Same as Canvas.",
            "category": "window"
        },
        {
            "color": "InactiveCaptionText",
            "desc": "Color of text in an inactive caption. Same as GrayText.",
            "category": "window"
        },
        {
            "color": "InfoBackground",
            "desc": "Background color for tooltip controls. Same as Canvas.",
            "category": "tooltip"
        },
        {
            "color": "InfoText",
            "desc": "Text color for tooltip controls. Same as CanvasText.",
            "category": "tooltip"
        },
        {
            "color": "Menu",
            "desc": "Menu background. Same as Canvas.",
            "category": "window"
        },
        {
            "color": "MenuText",
            "desc": "Text in menus. Same as CanvasText.",
            "category": "window"
        },
        {
            "color": "Scrollbar",
            "desc": "Scroll bar gray area. Same as Canvas.",
            "category": "window"
        },
        {
            "color": "ThreeDDarkShadow",
            "desc": "The color of the darker (generally outer) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonBorder.",
            "category": "3D"
        },
        {
            "color": "ThreeDFace",
            "desc": "The face background color for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonFace.",
            "category": "3D"
        },
        {
            "color": "ThreeDHighlight",
            "desc": "The color of the lighter (generally outer) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonBorder.",
            "category": "3D"
        },
        {
            "color": "ThreeDLightShadow",
            "desc": "The color of the darker (generally inner) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonBorder.",
            "category": "3D"
        },
        {
            "color": "ThreeDShadow",
            "desc": "The color of the lighter (generally inner) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonBorder.",
            "category": "3D"
        },
        {
            "color": "Window",
            "desc": "Window background. Same as Canvas.",
            "category": "window"
        },
        {
            "color": "WindowFrame",
            "desc": "Window frame. Same as ButtonBorder.",
            "category": "window"
        },
        {
            "color": "WindowText",
            "desc": "Text in windows. Same as CanvasText.",
            "category": "window"
        }
    ]
};

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