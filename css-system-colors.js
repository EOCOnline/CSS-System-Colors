// Verbose is used to control the level of logging output: 0 = none, 1 = some, 2 = all
const verbose = 2;

document.addEventListener("DOMContentLoaded", function () {
    if (verbose > 1) console.clear();
    if (verbose > 1) console.log("DOM fully loaded and parsed");
    readSystemColors();
});

async function readSystemColors() {
    // avoid CORS errors when reading a local file!
    fetch("css-system-colors.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok " + response.statusText);
            }
            return response.json();
        })
        .then(json => {
            console.log("%c" + "Read system colors file", "color:maroon;font-weight:bold;");
            console.table(json);
            generateSystemColors(json);
        })
        .catch(error => {
            console.error("Fetch error: " + error.message);
        });
}

// Generate flexgrid of system-colors
function generateSystemColors(colors) {
    i = 0;
    for (const color in colors.currentColors) {

        if (verbose > 1) console.log("color: " + colors.currentColors[color] + " " + color);
        if (colors.currentColors.hasOwnProperty(color)) {
            let newDiv = document.createElement('div');
            newDiv.className = "syscolors-item-div";
            newDiv.innerHTML = "<span class='syscolors-item-span'>" + color.color + "</span>";
            newDiv.style.backgroundColor = colors.currentColors[color];
            document.getElementById("syscolors-flexgrid").appendChild(newDiv);
            i++;
        }
    }
    if (verbose > 1) console.log("Processed {%1} colors.", i);
}

