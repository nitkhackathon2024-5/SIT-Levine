const express = require('express');
const axios = require('axios');
const router = express.Router();

// Mock stock data
const stockData = {
    AAPL: {
        basic: {
            symbol: 'AAPL',
            companyName: 'Apple Inc.',
            price: 150.25,
            change: 2.75,
            changePercent: 1.86
        },
        sustainability: {
            environmentalScore: 82,
            socialScore: 75,
            governanceScore: 90
        },
        sentiment: {
            beta: 1.2,
            rsi: 65
        },
        ratios: {
            peRatio: 28.5,
            pbRatio: 35.2
        }
    },
    GOOGL: {
        basic: {
            symbol: 'GOOGL',
            companyName: 'Alphabet Inc.',
            price: 2750.80,
            change: -15.20,
            changePercent: -0.55
        },
        sustainability: {
            environmentalScore: 78,
            socialScore: 80,
            governanceScore: 85
        },
        sentiment: {
            beta: 1.1,
            rsi: 55
        },
        ratios: {
            peRatio: 30.2,
            pbRatio: 6.1
        }
    }
};

// Helper function to get mock stock data
function getMockStockData(symbol, dataType) {
    if (!stockData[symbol]) {
        throw new Error('Stock symbol not found in mock data');
    }
    if (!stockData[symbol][dataType]) {
        throw new Error(`Data type ${dataType} not available for this stock`);
    }
    return stockData[symbol][dataType];
}

// Route to fetch real-time stock data from Alpha Vantage API
router.get('/stock', async (req, res) => {
    try {
        const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
        const symbol = req.query.symbol || 'IBM'; // default symbol if none provided

        const response = await axios.get(`https://www.alphavantage.co/query`, {
            params: {
                function: 'TIME_SERIES_DAILY',
                symbol: symbol,
                apikey: apiKey
            }
        });

        const stockData = response.data;
        res.json(stockData);
    } catch (error) {
        console.error('Error fetching stock data:', error);
        res.status(500).json({ message: 'Error fetching stock data' });
    }
});

// Route to get basic stock info from mock data
router.get('/stock/basic', (req, res) => {
    try {
        const { symbol } = req.query;
        const data = getMockStockData(symbol, 'basic');
        res.json(data);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Route to get sustainability scores from mock data
router.get('/stock/sustainability', (req, res) => {
    try {
        const { symbol } = req.query;
        const data = getMockStockData(symbol, 'sustainability');
        res.json(data);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Route to get sentiment indicators from mock data
router.get('/stock/sentiment', (req, res) => {
    try {
        const { symbol } = req.query;
        const data = getMockStockData(symbol, 'sentiment');
        res.json(data);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

// Route to get financial ratios from mock data
router.get('/stock/ratios', (req, res) => {
    try {
        const { symbol } = req.query;
        const data = getMockStockData(symbol, 'ratios');
        res.json(data);
    } catch (error) {
        res.status(404).json({ error: error.message });
    }
});

module.exports = router;
