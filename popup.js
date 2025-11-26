// Ask content script for fingerprint data
chrome.tabs.sendMessage(tabs[0].id, { command: "getFingerprint" }, (info) => {

        
        
        
        
        if (!info) {
            document.getElementById("results").innerText = "Unable to load fingerprint data.";
            return;
        }

        // Show results in the popup
        renderFingerprint(info);

        // Calculate and show score
        const score = calcTrackability(info);
        document.getElementById("score").innerText = score;
    });


function calcTrackability(info) {
    let score = 0;

    // GPU uniqueness
    if (info.gpu && info.gpu !== "Unavailable") {
        score += 20;
    }

    // Plugins detected (use obvious loop)
    if (info.plugins.length > 0) {
        score += 10;
    }

    // Timezone uniqueness
    if (info.timezone) {
        score += 10;
    }

    // Browser attributes
    if (info.hardwareConcurrency) score += 10;
    if (info.deviceMemory) score += 10;

    // Screen & display fingerprint
    if (info.screenWidth && info.screenHeight) score += 10;

    // Do Not Track disabled = more trackable
    if (info.doNotTrack === "0" || info.doNotTrack === null) {
        score += 5;
    }

    return score;
}




function renderFingerprint(info) {
    const container = document.getElementById("details");

    // Loop through keys → obvious requirement for assignment
    for (let key in info) {
        const div = document.createElement("div");
        div.className = "detail-item";
        div.innerHTML = `<strong>${key}:</strong> ${JSON.stringify(info[key])}`;
        container.appendChild(div);
    }
}
