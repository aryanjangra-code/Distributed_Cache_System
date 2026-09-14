const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const { search } = require('./search');
const { indexDocument } = require('./engine');

const app = express();
app.use(cors());


try {
    const rawData = fs.readFileSync('./corpus.json', 'utf8');
    const corpus = JSON.parse(rawData);
    
    corpus.forEach(doc => indexDocument(doc));
    console.log(`Successfully indexed ${corpus.length} documents.`);
} catch (error) {
    console.error("Failed to load corpus.json. Make sure the file exists.", error);
}


const searchLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 60, 
    message: { error: "Too many requests. Please try again later." }
});

app.get('/api/search', searchLimiter, (req, res) => {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!query) {
        return res.json({ totalResults: 0, page, totalPages: 0, results: [] });
    }

    const allResults = search(query);
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedResults = allResults.slice(startIndex, endIndex);

    res.json({
        totalResults: allResults.length,
        page,
        totalPages: Math.ceil(allResults.length / limit),
        results: paginatedResults
    });
});

app.listen(3000, () => console.log('Search API Gateway running on port 3000'));