const Verbose = 2; // 0 = none, 1 = some, 2 = most, 3 = all

document.addEventListener("DOMContentLoaded", function () {
    if (Verbose > 1) console.clear();
    if (Verbose > 1) console.log("DOM fully loaded and parsed");
    generateSystemColors();
});


// read system-color from css-system-colors.json
async function readSystemColors() {
    return new Promise((resolve, reject) => {
        fetch("css-system-colors.json")
            .then(response => response.json())
            .then(json => {
                console.log("%c" + "\nRead Json colors file: " + file.name + " with " + file.size + " char (" + (file.size / 1024).toFixed(1) + " KB)", "color:maroon;font-weight:bold;");
                resolve(json);
            })
            .catch(error => {

                console.error("Error reading JSON file: " + error.message);
                reject(error);
            });
    });
}

// Generate CSS flexbox grid of system colors
async function generateSystemColors() {
    let colors = await readSystemColors();
    let html = "";
    let color;
    let i = 0;
    for (color in colors.currentColors) {
        i++;
        if (Verbose > 1) console.log(i + ". " + color + " = " + colors[color]);
        html += ".color-" + color + " { background-color: " + colors[color] + "; }\n";
    }
    if (Verbose > 1) console.log("CSS:\n" + html);
    document.getElementById("sys-colors-container").textContent = html;
}

