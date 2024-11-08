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

let html = "";
function generateSystemColors(colors) {
    html += ".color-" + color + " { background-color: " + colors[color] + "; }\n";
    if (verbose > 1) console.log("CSS:\n" + html);
    const container = document.getElementById("syscolors-container");
    const textNode = document.createTextNode(html);
    container.innerHTML = "";
    container.appendChild(textNode);
}

