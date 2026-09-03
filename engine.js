const { processText } = require('./processor');

const invertedIndex = new Map();
const documentStore = new Map();
const documentLengths = new Map();

function indexDocument(doc) {
    documentStore.set(doc.id, doc);

    const tokens = processText(`${doc.title} ${doc.text}`);
    documentLengths.set(doc.id, tokens.length);

    for (const token of tokens) {
        if (!invertedIndex.has(token)) {
            invertedIndex.set(token, new Map());
        }
        
        const docMap = invertedIndex.get(token);
        const currentCount = docMap.get(doc.id) || 0;
        
        docMap.set(doc.id, currentCount + 1);
    }
}

module.exports = { indexDocument, invertedIndex, documentStore, documentLengths };