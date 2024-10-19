const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper function to fetch data from external API
async function fetchExternalData(url, params) {
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

// Basic stock info route
app.get('/api/stock/basic', async (req, res) => {
    try {
        const { symbol } = req.query;
        const data = await fetchExternalData('https://api.example.com/stock/basic', { symbol });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching basic stock data' });
    }
});

// Sustainability scores route
app.get('/api/stock/sustainability', async (req, res) => {
    try {
        const { symbol } = req.query;
        const data = await fetchExternalData('https://api.example.com/stock/sustainability', { symbol });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching sustainability data' });
    }
});

// Market sentiment indicators route
app.get('/api/stock/sentiment', async (req, res) => {
    try {
        const { symbol } = req.query;
        const data = await fetchExternalData('https://api.example.com/stock/sentiment', { symbol });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching market sentiment data' });
    }
});

// Financial ratios route
app.get('/api/stock/ratios', async (req, res) => {
    try {
        const { symbol } = req.query;
        const data = await fetchExternalData('https://api.example.com/stock/ratios', { symbol });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching financial ratios data' });
    }
});

// Serve the main HTML file for all other routes
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});