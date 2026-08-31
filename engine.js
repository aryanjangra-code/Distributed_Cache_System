const { processText } = require('./processor');

const invertedIndex = new Map();
const documentStore = new Map();

function indexDocument(doc) {
    documentStore.set(doc.id, doc);

    const tokens = processText(`${doc.title} ${doc.text}`);

    for (const token of tokens) {
        if (!invertedIndex.has(token)) {
            invertedIndex.set(token, new Set());
        }
        invertedIndex.get(token).add(doc.id);
    }
}

module.exports = { indexDocument, invertedIndex, documentStore };