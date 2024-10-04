// index.js

const express = require('express');
const cors = require('cors');
const db = require('./db'); // Import the MySQL database connection
const axios = require('axios');
require('dotenv').config(); // Load environment variables from .env

// Initialize the Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(express.json()); // Parse incoming JSON requests

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to the Essay Assistant API');
});

// Spell-check endpoint (calling Flask)
app.post('/api/spellcheck', async (req, res) => {
    const { text } = req.body;
    try {
        const response = await axios.post('http://localhost:5001/api/spellcheck', { text });
        console.log('Flask Response:', response.data); // Log response from Flask
        res.json(response.data);
    } catch (error) {
        console.error('Error calling spell-check service:', error);
        res.status(500).json({ error: 'Error calling spell-check service' });
    }
});

// Create a new essay
app.post('/api/essays', (req, res) => {
    const { title, content } = req.body;
    const query = 'INSERT INTO essays (title, content) VALUES (?, ?)';
    db.query(query, [title, content], (err, results) => {
        if (err) {
            console.error('Error inserting essay:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ id: results.insertId, title, content });
    });
});

// Get all essays
app.get('/api/essays', (req, res) => {
    const query = 'SELECT * FROM essays';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching essays:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json(results);
    });
});

// Get a specific essay by ID
app.get('/api/essays/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM essays WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error fetching essay by ID:', err);
            return res.status(500).json({ error: err.message });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Essay not found' });
        }
        res.status(200).json(results[0]);
    });
});

// Update an essay by ID
app.put('/api/essays/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const query = 'UPDATE essays SET title = ?, content = ? WHERE id = ?';
    db.query(query, [title, content, id], (err) => {
        if (err) {
            console.error('Error updating essay:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(200).json({ id, title, content });
    });
});

// Delete an essay by ID
app.delete('/api/essays/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM essays WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            console.error('Error deleting essay:', err);
            return res.status(500).json({ error: err.message });
        }
        res.status(204).send(); // No content, delete successful
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
