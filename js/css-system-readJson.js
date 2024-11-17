//Start with fetchSystemColors() instead of processJson(json) to read json from a file. However then the html file must be server by a server (not just opened in a browser)

/**************************************
 * Get the JSON data with system colors from the local file
 */

// FETCH JSON file -- if this HTML is being 'served'
async function fetchSystemColors() {
    try {
        // avoid CORS errors when reading a local file!
        if (logLevel > 1) console.log("Fetching JSON file:" + sourceJson);
        const response = await fetch(sourceJson);
        if (!response.ok) {
            throw new Error("Network response was not ok " + response.statusText);
        }
        const json = await response.json();
        processJson(json);
    } catch (error) {
        console.error("Fetch error: " + error.message);
        console.error("Will use FileReader next, assuming html is a local file");
        try {
            const json = await readJSONFile(sourceJson);
            processJson(json);
        } catch (error) {
            console.error("FileReader error: " + error.message);
        }
    }
}

// READ JSON File -- if this HTML is being opened directly by a browser
// BUG: Broken, probably with the new File statement
async function readSystemColors() {
    let file = new File([""], sourceJson, { type: "application/json" });// NOTE: suspect!
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
