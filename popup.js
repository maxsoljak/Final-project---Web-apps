function calcTrackability(info) {
    let score = 0;
    if (info.gpu && info.gpu !== "Not available") score += 20;

    if (info.plugins.length > 0) score += 10;

    