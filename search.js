const { processText } = require('./processor');
const { invertedIndex, documentStore } = require('./engine');

function search(query) {
    const tokens = processText(query);
    if (tokens.length === 0) return [];

    let resultIds = null;

    for (const token of tokens) {
        const docIds = invertedIndex.get(token) || new Set();
        
        if (resultIds === null) {
            resultIds = new Set(docIds);
        } else {
            resultIds = new Set([...resultIds].filter(id => docIds.has(id)));
        }
    }

    if (!resultIds || resultIds.size === 0) return [];

    return Array.from(resultIds).map(id => documentStore.get(id));
}

module.exports = { search };