// processor.js
const STOP_WORDS = new Set(["the", "and", "is", "a", "of", "to", "in"]);

function processText(text) {
    return text
        .toLowerCase()
        .replace(/[^\w\s]/g, '') // Strip all punctuation
        .split(/\s+/)            // Split by any whitespace
        .filter(word => word.length > 0 && !STOP_WORDS.has(word));
}

module.exports = { processText };