const { processText } = require('./processor');
const { invertedIndex, documentStore, documentLengths } = require('./engine');

//this is a search function that finds top result by using tf-idf 
function search(query) {
    const tokens = processText(query);
    if (tokens.length === 0) return [];

    const totalDocs = documentStore.size;
    const documentScores = new Map(); 

    for (const token of tokens) {
        const docMap = invertedIndex.get(token);
        if (!docMap) continue; 

        const docFrequency = docMap.size;
        const idf = Math.log(totalDocs / docFrequency);

        for (const [docId, termCount] of docMap.entries()) {
            const totalWordsInDoc = documentLengths.get(docId);
            const tf = termCount / totalWordsInDoc;
            const tfIdf = tf * idf;

            const currentScore = documentScores.get(docId) || 0;
            documentScores.set(docId, currentScore + tfIdf);
        }
    }

    if (documentScores.size === 0) return [];

    return Array.from(documentScores.entries())
        .sort((a, b) => b[1] - a[1]) 
        .map(([docId, score]) => {
            const doc = documentStore.get(docId);
            return { ...doc, score: score.toFixed(4) }; 
        });
}

module.exports = { search };
