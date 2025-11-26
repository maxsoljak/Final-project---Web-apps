// Ask content script for fingerprint data
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs || tabs.length === 0) {
        document.getElementById("results").innerText = "No active tab found.";
        document.getElementById("score").innerText = "N/A";
        return;
    }

    chrome.tabs.sendMessage(tabs[0].id, { command: "getFingerprint" }, (info) => {
        if (chrome.runtime.lastError) {
            document.getElementById("results").innerText = "Content script not available on this page.";
            document.getElementById("score").innerText = "N/A";
            return;
        }

        if (!info) {
            document.getElementById("results").innerText = "Unable to load fingerprint data.";
            document.getElementById("score").innerText = "N/A";
            return;
        }

        renderFingerprint(info);
        document.getElementById("score").innerText = calcTrackability(info);
    });
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
