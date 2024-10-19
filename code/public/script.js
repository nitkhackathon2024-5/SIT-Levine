document.addEventListener('DOMContentLoaded', () => {
    const stockForm = document.getElementById('stockForm');
    const symbolInput = document.getElementById('symbol');
    const stockDataDiv = document.getElementById('stockData');
    const clearDataButton = document.getElementById('clearData');
    const timeButtons = document.querySelectorAll('.time-button');

    let currentSymbol = '';
    let currentTimeframe = ''; 

    // Event handler for form submit
    stockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentSymbol = symbolInput.value.toUpperCase();
        fetchStockData(currentSymbol, currentTimeframe);
    });

    // Clear data button to reset everything
    clearDataButton.addEventListener('click', () => {
        stockDataDiv.innerHTML = '';
        symbolInput.value = '';
        currentSymbol = '';
        currentTimeframe = ''; // Reset the timeframe too
    });

    // Event handler for timeframe buttons
    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentTimeframe = button.id;
            if (currentSymbol) {
                fetchStockData(currentSymbol, currentTimeframe);
            }
        });
    });

    // Fetch stock data based on symbol and timeframe
    function fetchStockData(symbol, timeframe) {
        if (!symbol || !timeframe) {
            stockDataDiv.innerHTML = '<p>Please enter a valid stock symbol and select a timeframe.</p>';
            return;
        }
    
        stockDataDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

        let endpoint = '';
        switch (timeframe) {
            case 'intraday':
            case 'daily':
            case 'weekly':
            case 'monthly':
                endpoint = `/api/stock/basic?symbol=${symbol}&timeframe=${timeframe}`;
                break;
            case 'sustainability':
                endpoint = `/api/stock/sustainability?symbol=${symbol}`;
                break;
            case 'sentiment':
                endpoint = `/api/stock/sentiment?symbol=${symbol}`;
                break;
            case 'ratios':
                endpoint = `/api/stock/ratios?symbol=${symbol}`;
                break;
            default:
                endpoint = `/api/stock/basic?symbol=${symbol}&timeframe=daily`; // Default to daily
                break;
        }

        fetch(endpoint)
            .then(response => response.json())
            .then(data => {
                if (data['Error Message'] || data.Note) {
                    stockDataDiv.innerHTML = `<p>Error: ${data['Error Message'] || 'API rate limit reached.'}</p>`;
                    return;
                }
                displayStockData(data, timeframe);
            })
            .catch(error => {
                console.error('Error fetching stock data:', error);
                stockDataDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error fetching stock data';
            });
    }

    // Display stock data based on the response
    function displayStockData(data, timeframe) {
        let timeSeriesKey = '';
        switch (timeframe) {
            case 'intraday':
                timeSeriesKey = 'Time Series (5min)';
                break;
            case 'daily':
                timeSeriesKey = 'Time Series (Daily)';
                break;
            case 'weekly':
                timeSeriesKey = 'Weekly Time Series';
                break;
            case 'monthly':
                timeSeriesKey = 'Monthly Time Series';
                break;
            case 'sustainability':
                stockDataDiv.innerHTML = `<h2>${data.symbol} - Sustainability</h2>
                    <p>ESG Score: ${data.esg_score}</p>
                    <p>Environmental Score: ${data.environmental}</p>
                    <p>Social Score: ${data.social}</p>
                    <p>Governance Score: ${data.governance}</p>`;
                return;
            case 'sentiment':
                stockDataDiv.innerHTML = `<h2>${data.symbol} - Sentiment</h2>
                    <p>RSI: ${data.rsi}</p>
                    <p>Beta: ${data.beta}</p>`;
                return;
            case 'ratios':
                stockDataDiv.innerHTML = `<h2>${data.symbol} - Financial Ratios</h2>
                    <p>P/E Ratio: ${data.pe_ratio}</p>
                    <p>P/B Ratio: ${data.pb_ratio}</p>
                    <p>Dividend Yield: ${data.dividend_yield}</p>`;
                return;
            default:
                timeSeriesKey = 'Time Series (Daily)';
                break;
        }
        
        const timeSeries = data[timeSeriesKey];
        if (!timeSeries) {
            stockDataDiv.innerHTML = '<p>Error: Data not available for the selected timeframe.</p>';
            return;
        }

        const latestDate = Object.keys(timeSeries)[0];
        const latestData = timeSeries[latestDate];

        stockDataDiv.innerHTML = `
            <h2>${data['Meta Data']['2. Symbol']} - ${getTimeframeText(timeframe)}</h2>
            <p>Last Refreshed: ${data['Meta Data']['3. Last Refreshed']}</p>
            <p>Open: ${latestData['1. open']}</p>
            <p>High: ${latestData['2. high']}</p>
            <p>Low: ${latestData['3. low']}</p>
            <p>Close: ${latestData['4. close']}</p>
            <p>Volume: ${latestData['5. volume']}</p>
        `;
    }

    // Function to map timeframe to text
    function getTimeframeText(timeframe) {
        switch (timeframe) {
            case 'intraday': return 'Intraday (5min)';
            case 'daily': return 'Daily';
            case 'weekly': return 'Weekly';
            case 'monthly': return 'Monthly';
            case 'sustainability': return 'Sustainability';
            case 'sentiment': return 'Sentiment';
            case 'ratios': return 'Financial Ratios';
            default: return 'Daily';
        }
    }
});
