document.addEventListener('DOMContentLoaded', () => {
    const stockForm = document.getElementById('stockForm');
    const symbolInput = document.getElementById('symbol');
    const stockDataDiv = document.getElementById('stockData');
    const clearDataButton = document.getElementById('clearData');
    const timeButtons = document.querySelectorAll('.time-button');

    let currentSymbol = '';
    let currentTimeframe = ''; 

    stockForm.addEventListener('submit', (e) => {
        e.preventDefault();
        currentSymbol = symbolInput.value.toUpperCase();
        
        
        fetchStockData(currentSymbol, currentTimeframe);
    });

    clearDataButton.addEventListener('click', () => {
        stockDataDiv.innerHTML = '';
        symbolInput.value = '';
        currentSymbol = '';
    });

    timeButtons.forEach(button => {
        button.addEventListener('click', () => {
            currentTimeframe = button.id;
            if (currentSymbol) {
                fetchStockData(currentSymbol, currentTimeframe);
            }
        });
    });

    function fetchStockData(symbol, timeframe) {
        stockDataDiv.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
    
        let functionType = '';
        let additionalParams = '';
    
        switch (timeframe) {
            case 'intraday':
                functionType = 'TIME_SERIES_INTRADAY';
                additionalParams = '&interval=5min'; // You can change the interval to 5min, 15min, etc.
                break;
            case 'daily':
                functionType = 'TIME_SERIES_DAILY';
                break;
            case 'weekly':
                functionType = 'TIME_SERIES_WEEKLY';
                break;
            case 'monthly':
                functionType = 'TIME_SERIES_MONTHLY';
                break;
            default:
                functionType = 'TIME_SERIES_DAILY'; // Default to daily if no valid timeframe is provided
                break;
        }
    
        fetch(`https://www.alphavantage.co/query?function=${functionType}&symbol=${symbol}&apikey=OVE6GTNI4ND6VWAT${additionalParams}`)
            .then(response => response.json())
            .then(data => {
                displayStockData(data, timeframe);
            })
            .catch(error => {
                console.error('Error fetching stock data:', error);
                stockDataDiv.innerHTML = '<i class="fas fa-exclamation-circle"></i> Error fetching stock data';
            });
    }
    

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
            default:
                timeSeriesKey = 'Time Series (Daily)'; // Default to daily
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
    

    function getTimeSeriesKey(timeframe) {
        switch (timeframe) {
            case 'intraday': return '5min';
            case 'daily': return 'Daily';
            case 'weekly': return 'Weekly';
            case 'monthly': return 'Monthly';
            default: return 'Daily';
        }
    }

    function getTimeframeText(timeframe) {
        switch (timeframe) {
            case 'intraday': return 'Intraday (5min)';
            case 'daily': return 'Daily';
            case 'weekly': return 'Weekly';
            case 'monthly': return 'Monthly';
            default: return 'Daily';
        }
    }
});