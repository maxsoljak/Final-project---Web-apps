function getFingerprintData() { // Function to collect fingerprinting data from the browser
    const data = {};

    // Collect user agent
    data.userAgent = navigator.userAgent;
    data.platform = navigator.platform;
    data.language = navigator.language;
    data.languages = navigator.languages;
    data.hardwareConcurrency = navigator.hardwareConcurrency;
    data.deviceMemory = navigator.deviceMemory;
    data.maxTouchPoints = navigator.maxTouchPoints;

    // Screen info
    data.screenWidth = screen.width;
    data.screenHeight = screen.height;
    data.colorDepth = screen.colorDepth;
    data.pixelDepth = screen.pixelDepth;

    // Timezone
    data.timezoneOffset = Intl.DateTimeFormat().resolvedOptions().timeZone;
    data.timeZoneOffset = new Date().getTimezoneOffset();

    // Browser features
    data.cookiesEnabled = navigator.cookieEnabled;
    data.doNotTrack = navigator.doNotTrack;

    // Plugins
    data.plugins = Array.from(navigator.plugins || []).map(p => p.name);

    try {
        // Canvas fingerprinting: 
        // Websites use this trick because the GPU reveals very important details like:  GPU model, graphics drivers, OS rendering etc.
        
        const canvas = document.createElement("canvas"); // create a canvas element
        const gl = canvas.getContext("webgl") // try to get WebGL context

        if (gl) { // if WebGL is supported
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            if (debugInfo) {
                data.gpu = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL); // GPU model
                
            } else { 
                data.gpu = "Not available";
            }
        } else {
            data.gpu = "not available";
        }
    } catch {
        data.gpu = "Not available";
    }

    return data;
}

chrome.runtime.onMessage.addListener((msg, sender, respond) => { // Listen for messages from the extension
    const fingerprintData = getFingerprintData(); // Collect fingerprinting data
    if (msg.command === "getFingerprint") {
        respond(fingerprintData);
    }

});