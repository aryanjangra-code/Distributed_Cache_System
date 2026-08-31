const STOP_WORDS = new Set(["the", "and", "is", "a", "of", "to", "in"]);

function processText(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '') 
        .split(/\s+/)           
        .filter(word => word.length > 0 && !STOP_WORDS.has(word));
}

module.exports = { processText };