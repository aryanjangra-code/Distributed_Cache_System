# Distributed_Cache_System
starting date 25-08-2026


A highly scalable, in-memory distributed cache system. Built from scratch using Node.js and React, this project demonstrates core cloud computing architecture, advanced memory management, and distributed routing logic.

## Overview

This system acts as a high-performance middleware layer. It intercepts incoming search queries, checks a distributed in-memory cache for previous results to guarantee sub-millisecond response times, and falls back to a custom full-text search algorithm utilizing an inverted index when cache misses occur.

### Key Architectural Features:
* **Full-Text Search Engine:** Implements text tokenization, normalization, and an inverted index for $O(1)$ document lookups.
* **LRU Cache Engine:** Custom-built Doubly Linked List + Hash Map architecture to manage server memory effectively by evicting the least recently used data.
* **Consistent Hashing Router:** (In Progress) Uses SHA-256 algorithms to distribute cache data evenly across multiple server nodes without data loss during server failures.
* **React Control Plane:** A live UI dashboard to visualize cache hits, misses, and cluster node health.

## 🛠️ Tech Stack
* **Backend:** Node.js, Express.js
* **Networking:** Raw TCP/IP Sockets, HTTP/REST API
* **Frontend:** React, Tailwind CSS
* **Core Data Structures:** Hash Maps, Sets, Doubly Linked Lists, Binary Search Trees

## 🧠 System Data Flow

1. **Client Request:** React frontend sends a search query to the API Gateway.
2. **Cache Check:** Gateway hashes the query and routes it to the correct cache node.
    * **Cache Hit:** Node instantly returns the stored JSON payload.
    * **Cache Miss:** Gateway forwards the query to the Core Search Engine.
3. **Search Execution:** The engine tokenizes the query, queries the pre-built Inverted Index, and scores the relevant documents.
4. **Cache Write & Return:** The gateway writes the new result into the cache node (triggering LRU eviction if memory is full) and returns the data to the client.
