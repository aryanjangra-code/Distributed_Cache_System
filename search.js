const { processText } = require('./processor');
const { invertedIndex, documentStore } = require('./engine');

function search(query) {
    const tokens = processText(query);
    if (tokens.length === 0) return [];

    let resultIds = null;

    for (const token of tokens) {
        // Find matching document IDs for the token
        const docIds = invertedIndex.get(token) || new Set();
        
        if (resultIds === null) {
            // First token populates the initial set
            resultIds = new Set(docIds);
        } else {
            // Intersection: Keep only IDs present in both sets
            resultIds = new Set([...resultIds].filter(id => docIds.has(id)));
        }
    }

    if (!resultIds || resultIds.size === 0) return [];

    // Map the matching IDs back to the full document objects
    return Array.from(resultIds).map(id => documentStore.get(id));
}

module.exports = { search };