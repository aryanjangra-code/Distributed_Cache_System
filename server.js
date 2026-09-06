// server.js
const express = require('express');
const rateLimit = require('express-rate-limit');
const { search } = require('./search'); // Your TF-IDF search module

const app = express();

// Protects the backend from rapid-fire keystroke spam
const searchLimiter = rateLimit({
    windowMs: 60 * 1000, // 1 minute
    max: 60, // Limit each IP to 60 requests per minute
    message: { error: "Too many requests. Please try again later." }
});

app.get('/api/search', searchLimiter, (req, res) => {
    const query = req.query.q || '';
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    if (!query) {
        return res.json({ totalResults: 0, page, totalPages: 0, results: [] });
    }

    // 1. Fetch all scored and sorted results
    const allResults = search(query);
    
    // 2. Calculate array bounds for the requested chunk
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    
    // 3. Slice the array to return only the current page
    const paginatedResults = allResults.slice(startIndex, endIndex);

    res.json({
        totalResults: allResults.length,
        page,
        totalPages: Math.ceil(allResults.length / limit),
        results: paginatedResults
    });
});

app.listen(3000, () => console.log('Search API Gateway running on port 3000'));