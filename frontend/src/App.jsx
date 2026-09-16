import React, { useState, useEffect, useRef } from 'react';

export default function SearchInterface() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    
    const debounceTimer = useRef(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        if (debounceTimer.current) clearTimeout(debounceTimer.current);

        debounceTimer.current = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(query)}&page=1&limit=10`);
                const data = await response.json();
                setResults(data.results || []);
            } catch (error) {
                console.error("Search request failed:", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceTimer.current);
    }, [query]);

    return (
        <div className="max-w-2xl mx-auto p-6 font-sans">
            <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search documents..." 
                className="w-full p-4 mb-6 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
            
            {loading && <p className="text-gray-500 mb-4 animate-pulse">Searching...</p>}
            
            <div className="space-y-4">
                {results.map((doc) => (
                    <div key={doc.id} className="p-5 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                        <h3 className="text-xl font-semibold text-gray-800">{doc.title}</h3>
                        <p className="text-gray-600 mt-2 leading-relaxed">{doc.text}</p>
                        <div className="mt-3 text-xs font-mono text-emerald-600 bg-emerald-50 inline-block px-2 py-1 rounded">
                            TF-IDF Score: {doc.score}
                        </div>
                    </div>
                ))}
                
                {query && !loading && results.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No matching documents found.</p>
                )}
            </div>
        </div>
    );
}