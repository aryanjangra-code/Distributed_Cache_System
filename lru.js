// lru.js
class LRUCache {
    constructor(capacity) {
        this.cache = new Map();
        this.capacity = capacity; // Maximum number of searches to remember
    }

    get(key) {
        if (!this.cache.has(key)) return null;

        // If accessed, it's now the most recently used.
        // We delete it and re-insert it so it moves to the "end" of the Map.
        const value = this.cache.get(key);
        this.cache.delete(key);
        this.cache.set(key, value);
        
        return value;
    }

    set(key, value) {
        // If it already exists, remove it so we can update its position
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } 
        // If we hit capacity, delete the FIRST item in the Map (least recently used)
        else if (this.cache.size >= this.capacity) {
            const leastRecentlyUsedKey = this.cache.keys().next().value;
            this.cache.delete(leastRecentlyUsedKey);
        }

        // Insert the new item at the "end" of the Map
        this.cache.set(key, value);
    }
}

module.exports = LRUCache;