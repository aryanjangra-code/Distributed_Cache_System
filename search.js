const { processText } = require('./processor');
const { invertedIndex, documentStore, documentLengths } = require('./engine');

function search(query) {
    const tokens = processText(query);
    if (tokens.length === 0) return [];

    const totalDocs = documentStore.size;
    const documentScores = new Map(); // Tracks DocID -> Final Score

    for (const token of tokens) {
        const docMap = invertedIndex.get(token);
        if (!docMap) continue; // Term doesn't exist in the corpus

        // IDF is consistent across all documents for this specific token
        const docFrequency = docMap.size;
        const idf = Math.log(totalDocs / docFrequency);

        // Calculate TF and accumulate the final score for each document
        for (const [docId, termCount] of docMap.entries()) {
            const totalWordsInDoc = documentLengths.get(docId);
            const tf = termCount / totalWordsInDoc;
            const tfIdf = tf * idf;

            const currentScore = documentScores.get(docId) || 0;
            documentScores.set(docId, currentScore + tfIdf);
        }
    }

    if (documentScores.size === 0) return [];

    // Sort documents by their accumulated score in descending order
    return Array.from(documentScores.entries())
        .sort((a, b) => b[1] - a[1]) 
        .map(([docId, score]) => {
            const doc = documentStore.get(docId);
            // Returning the score alongside the document for debugging visibility
            return { ...doc, score: score.toFixed(4) }; 
        });
}

module.exports = { search };