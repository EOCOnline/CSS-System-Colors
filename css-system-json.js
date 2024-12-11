/**
 * #region: System Colors JSON Data
 * systemColorsJson contains the system colors data from the standard.
 * * 'systemColorsJson.info' contains metadata.
 * * 'systemColorsJson.categories' contains my NON-STANDARD categorization of system colors.
 * 'systemColorsJson.currentColors' contains the current system color array.
 * '.systemColorsJson.deprecatedColors' contains the deprecated system color array.
 * Changing this a .JSON file would be trivial but causes CORS problems.
 */
const systemColorsJson =
{
    "info": {
        "credit": "Created by eoc.online CSS System Colors tool: https://github.com/eoconline/css-system-colors"
    },
    "categories": [
        {
            "name": "Accent",
            "description": "Accented user interface controls",
        },
        {
            "name": "Button",
            "description": "Push buttons",
        },
        {
            "name": "Canvas",
            "description": "Application content or documents",
        },
        {
            "name": "Disabled",
            "description": "Disabled text",
        },
        {
            "name": "Field",
            "description": "Input fields",
        },
        {
            "name": "Highlight",
            "description": "Selected text",
        },
        {
            "name": "Link",
            "description": "Links",
        },
        {
            "name": "Mark",
            "description": "Text that has been specially marked (such as by the HTML mark element)",
        },
        {
            "name": "Selected",
            "description": "Selected items",
        }
    ],
    "UNUSEDindependentColors": [
        {
            "color": "AccentColor",
            "desc": "Background of accented user interface controls.",
            "category": "Accent"
        },
        {
            "color": "AccentColorText",
            "desc": "Text of accented user interface controls.",
            "category": "Accent"
        },
        {
            "color": "ActiveText",
            "desc": "Text in active links. For light backgrounds, traditionally red.",
            "category": "Link"
        },
        {
            "color": "ButtonBorder",
            "desc": "The base border color for push buttons.",
            "category": "Button"
        },
        {
            "color": "ButtonFace",
            "desc": "The face background color for push buttons.",
            "category": "Button"
        },
        {
            "color": "ButtonText",
            "desc": "Text on push buttons.",
            "category": "Button"
        },
        {
            "color": "Canvas",
            "desc": "Background of application content or documents.",
            "category": "Canvas"
        },
        {
            "color": "CanvasText",
            "desc": "Text in application content or documents.",
            "category": "Canvas"
        },
        {
            "color": "Field",
            "desc": "Background of input fields.",
            "category": "Field"
        },
        {
            "color": "FieldText",
            "desc": "Text in input fields.",
            "category": "Field"
        },
        {
            "color": "GrayText",
            "desc": "Disabled text. (Often, but not necessarily, gray.)",
            "category": "Disabled"
        },
        {
            "color": "Highlight",
            "desc": "Background of selected text, for example from : :selection.",
            "category": "Highlight"
        },
        {
            "color": "HighlightText",
            "desc": "Text of selected text.",
            "category": "Highlight"
        },
        {
            "color": "LinkText",
            "desc": "Text in non-active, non-visited links. For light backgrounds, traditionally blue.",
            "category": "Link"
        },
        {
            "color": "Mark",
            "desc": "Background of text that has been specially marked (such as by the HTML mark element).",
            "category": "Mark"
        },
        {
            "color": "MarkText",
            "desc": "Text that has been specially marked (such as by the HTML mark element).",
            "category": "Mark"
        },
        {
            "color": "SelectedItem",
            "desc": "Background of selected items, for example a selected checkbox.",
            "category": "Selection"
        },
        {
            "color": "SelectedItemText",
            "desc": "Text of selected items.",
            "category": "Selection"
        },
        {
            "color": "VisitedText",
            "desc": "Text in visited links. For light backgrounds, traditionally purple.",
            "category": "Link"
        }
    ],
    "currentColors": [
        {
            "category": "Accent",
            "systemColor": "AccentColor",
            "desc": "Background of accented user interface controls.",
            "style": "background-color: AccentColor"
        },
        {
            "category": "Accent",
            "systemColor": "AccentColorText",
            "desc": "Text of accented user interface controls.",
            "style": "color: AccentColorText",
        },
        {
            "category": "Button",
            "systemColor": "ButtonBorder",
            "desc": "The base border color for push buttons.",
            "style": "border-color: ButtonBorder"
        },
        {
            "category": "Button",
            "systemColor": "ButtonFace",
            "desc": "The face background color for push buttons.",
            "style": "background-color: ButtonFace"
        },
        {
            "category": "Button",
            "systemColor": "ButtonText",
            "desc": "Text on push buttons.",
            "style": "color: ButtonText"
        },
        {
            "category": "Canvas",
            "systemColor": "Canvas",
            "desc": "Background of application content or documents.",
            "style": "background-color: Canvas"
        },
        {
            "category": "Canvas",
            "systemColor": "CanvasText",
            "desc": "Text in application content or documents.",
            "style": "color: CanvasText",
        },
        {
            "category": "Disabled",
            "systemColor": "GrayText",
            "desc": "Disabled text. (Often, but not necessarily, gray.)",
            "style": "color: GrayText"
        },
        {
            "category": "Field",
            "systemColor": "Field",
            "desc": "Background of input fields.",
            "style": "background-color: Field"
        },
        {
            "category": "Field",
            "systemColor": "FieldText",
            "desc": "Text in input fields.",
            "style": "color: FieldText"
        },
        {
            "category": "Highlight",
            "systemColor": "Highlight",
            "desc": "Background of selected text, for example from : :selection.",
            "style": "background-color: Highlight"
        },
        {
            "category": "Highlight",
            "systemColor": "HighlightText",
            "desc": "Text of selected text.",
            "style": "color: HighlightText"
        },
        {
            "category": "Link",
            "systemColor": "LinkText",
            "desc": "Text in non-active, non-visited links. For light backgrounds, traditionally blue.",
            "style": "color: LinkText"
        },
        {
            "category": "Link",
            "systemColor": "ActiveText",
            "desc": "Text in active links. For light backgrounds, traditionally red.",
            "style": "active-color: ActiveText"
        },
        {
            "category": "Link",
            "systemColor": "VisitedText",
            "desc": "Text in visited links. For light backgrounds, traditionally purple.",
            "style": "visited-color: VisitedText"
        },
        {
            "category": "Mark",
            "systemColor": "Mark",
            "desc": "Background of text that has been specially marked (such as by the HTML mark element).",
            "style": "background-color: Mark"
        },
        {
            "category": "Mark",
            "systemColor": "MarkText",
            "desc": "Text that has been specially marked (such as by the HTML mark element).",
            "style": "color: MarkText",
        },
        {
            "category": "Selected",
            "systemColor": "SelectedItem",
            "desc": "Background of selected items, for example a selected checkbox.",
            "style": "background-color: SelectedItem"
        },
        {
            "category": "Selected",
            "systemColor": "SelectedItemText",
            "desc": "Text of selected items.",
            "style": "color: SelectedItemText"
        },

    ],
    "deprecatedColors": [
        {
            "category": "window",
            "systemColor": "ActiveBorder",
            "desc": "Active window border. Same as ButtonBorder",
            "style": "border-color: ActiveBorder"
        },
        {
            "category": "window",
            "systemColor": "ActiveCaption",
            "desc": "Active window caption. Same as Canvas",
            "style": "color: ActiveCaption"
        },
        {
            "category": "MDI",
            "systemColor": "AppWorkspace",
            "desc": "Background color of multiple document interface. Same as Canvas",
            "style": "background-color: AppWorkspace"
        },
        {
            "category": "window",
            "systemColor": "Background",
            "desc": "Desktop background. Same as Canvas.",
            "style": "background-color: Background"
        },
        {
            "category": "input-button",
            "systemColor": "ButtonHighlight",
            "desc": "The color of the border facing the light source for 3-D elements that appear 3-D due to one layer of surrounding border. Same as ButtonFace.",
            "style": "border-color: ButtonHighlight"
        },
        {
            "category": "input-button",
            "systemColor": "ButtonShadow",
            "desc": "The color of the border away from the light source for 3-D elements that appear 3-D due to one layer of surrounding border. Same as ButtonFace.",
            "style": "border-color: ButtonShadow"
        },
        {
            "category": "window",
            "systemColor": "CaptionText",
            "desc": "Text in caption, size box, and scrollbar arrow box. Same as CanvasText.",
            "style": "color: CaptionText"
        },
        {
            "category": "window",
            "systemColor": "InactiveBorder",
            "desc": "Inactive window border. Same as ButtonBorder.",
            "style": "border-color: InactiveBorder"
        },
        {
            "category": "window",
            "systemColor": "InactiveCaption",
            "desc": "Inactive window caption. Same as Canvas.",
            "style": "color: InactiveCaption"
        },
        {
            "category": "window",
            "systemColor": "InactiveCaptionText",
            "desc": "Color of text in an inactive caption. Same as GrayText.",
            "style": "color: InactiveCaptionText"
        },
        {
            "category": "tooltip",
            "systemColor": "InfoBackground",
            "desc": "Background color for tooltip controls. Same as Canvas.",
            "style": "background-color: InfoBackground"
        },
        {
            "category": "tooltip",
            "systemColor": "InfoText",
            "desc": "Text color for tooltip controls. Same as CanvasText.",
            "style": "color: InfoText"
        },
        {
            "category": "window",
            "systemColor": "Menu",
            "desc": "Menu background. Same as Canvas.",
            "style": "background-color: Menu"
        },
        {
            "category": "window",
            "systemColor": "MenuText",
            "desc": "Text in menus. Same as CanvasText.",
            "style": "color: MenuText"
        },
        {
            "category": "window",
            "systemColor": "Scrollbar",
            "desc": "Scroll bar gray area. Same as Canvas.",
            "style": "background-color: Scrollbar"
        },
        {
            "category": "3D",
            "systemColor": "ThreeDDarkShadow",
            "desc": "The color of the darker (generally outer) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonBorder.",
            "style": "border-color: ThreeDDarkShadow"
        },
        {
            "category": "3D",
            "systemColor": "ThreeDFace",
            "desc": "The face background color for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonFace.",
            "style": "background-color: ThreeDFace"
        },
        {
            "category": "3D",
            "systemColor": "ThreeDHighlight",
            "desc": "The color of the lighter (generally outer) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonBorder.",
            "style": "border-color: ThreeDHighlight"
        },
        {
            "category": "3D",
            "systemColor": "ThreeDLightShadow",
            "desc": "The color of the darker (generally inner) of the two borders facing the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonBorder.",
            "style": "border-color: ThreeDLightShadow"
        },
        {
            "category": "3D",
            "systemColor": "ThreeDShadow",
            "desc": "The color of the lighter (generally inner) of the two borders away from the light source for 3-D elements that appear 3-D due to two concentric layers of surrounding border. Same as ButtonBorder.",
            "style": "border-color: ThreeDShadow"
        },
        {
            "category": "window",
            "systemColor": "Window",
            "desc": "Window background. Same as Canvas.",
            "style": "background-color: Window"
        },
        {
            "category": "window",
            "systemColor": "WindowFrame",
            "desc": "Window frame. Same as ButtonBorder.",
            "style": "border-color: WindowFrame"
        },
        {
            "category": "window",
            "systemColor": "WindowText",
            "desc": "Text in windows. Same as CanvasText.",
            "style": "color: WindowText"
        }
    ]
};