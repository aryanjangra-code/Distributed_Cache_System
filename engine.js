// engine.js
const { processText } = require('./processor');

const invertedIndex = new Map();
const documentStore = new Map();

function indexDocument(doc) {
    // 1. Store the raw document for later retrieval
    documentStore.set(doc.id, doc);

    // 2. Extract and process all text (combining title and body)
    const tokens = processText(`${doc.title} ${doc.text}`);

    // 3. Build the index
    for (const token of tokens) {
        if (!invertedIndex.has(token)) {
            invertedIndex.set(token, new Set());
        }
        invertedIndex.get(token).add(doc.id);
    }
}

module.exports = { indexDocument, invertedIndex, documentStore };