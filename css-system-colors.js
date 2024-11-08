// Verbose is used to control the level of logging output: 0 = none, 1 = some, 2 = all
const verbose = 2;

document.addEventListener("DOMContentLoaded", function () {
    if (verbose > 1) console.clear();
    if (verbose > 1) console.log("DOM fully loaded and parsed");
    readSystemColors();
});

// read system-color from css-system-colors.json
async function readSystemColors() {
    let file = new File([""], "css-system-colors.json", { type: "application/json" });
    readJSONFile(file).then(
        json => {
            console.log("%c" + "Read system colors file: " + file.name + " with " + file.size + " char", "color:maroon;font-weight:bold;");
            if (!validateJson(json)) {
                console.error("Invalid JSON: " + json);
                alert("Invalid JSON: " + json);
                return;
            }
            try {
                generateSystemColors(json);
            } catch (e) {
                console.error("Error building list of System Colors: " + e.message);
            }

        }
    ).catch(error => {
        console.error("Error reading JSON file: " + error.message);
        alert("Error reading JSON file (" + file.name + "): \n" + error.message);
    });
}

// Use fileReader instead of fetch, to avoid CORS errors with local files
async function readJSONFile(file) {
    return new Promise((resolve, reject) => {
        let fileReader = new FileReader();
        fileReader.onload = event => {
            try {
                const jsonString = event.target.result;
                const json = JSON.parse(jsonString);
                resolve(json);
            } catch (error) {
                alert("Invalid JSON format: " + error.message);
                reject(new Error("Invalid JSON format"));
            }
        };
        fileReader.onerror = error => {
            reject(new Error(`Error reading file ${file.name}: ${error.message}`));
        };
        fileReader.readAsText(file);
    });
}

// Generate CSS flexbox grid of system colors
async function generateSystemColors(colors) {
    let html = "";
    let color;
    let i = 0;
    for (color in colors) {
        i++;
        if (verbose > 1) console.log(i + ". " + color + " = " + colors[color]);
        html += ".color-" + color + " { background-color: " + colors[color] + "; }\n";
    }
    if (verbose > 1) console.log("CSS:\n" + html);
    const container = document.getElementById("syscolors-container");
    const textNode = document.createTextNode(html);
    container.innerHTML = "";
    container.appendChild(textNode);
}

