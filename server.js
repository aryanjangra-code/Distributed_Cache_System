const express = require('express');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const fs = require('fs');
const { search } = require('./search');
const { indexDocument, documentStore } = require('./engine');
const LRUCache = require('./lru');

const app = express();
app.use(cors());

const searchCache = new LRUCache(50);


setInterval(() => searchCache.clear(), 1000 * 60 * 15);

try {
    const rawData = fs.readFileSync('./corpus.json', 'utf8');
    const corpus = JSON.parse(rawData);
    
    corpus.forEach(doc => indexDocument(doc));
    console.log("Database size:", documentStore.size);
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

    const cacheKey = `${query.toLowerCase()}-page:${page}-limit:${limit}`;
    const cachedData = searchCache.get(cacheKey);
    if (cachedData) {
        console.log(`Cache HIT: Serving instant results for "${query}"`);
        return res.json(cachedData);
    }
    console.log(`Cache MISS: Calculating results for "${query}"`);

    const allResults = search(query);
    
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    const paginatedResults = allResults.slice(startIndex, endIndex);

    const finalResponse = {
        totalResults: allResults.length,
        page,
        totalPages: Math.ceil(allResults.length / limit),
        results: paginatedResults
    };

    // Use the .set() method to enforce capacity limits
    searchCache.set(cacheKey, finalResponse);

    res.json(finalResponse);
});

app.listen(3000, () => console.log('Search API Gateway running on port 3000'));