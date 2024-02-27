// Fetching Microsoft stock data
fetch('https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=5min&apikey=HZ1KQQFYKA7RFXLW')
.then(response => response.json())
.then(data => {
    const series = data['Time Series (5min)'];
    const times = Object.keys(series).sort();
    const prices = times.map(time => series[time]['4. close']);

    const ctx = document.getElementById('alphaVantageChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'MSFT Stock Price (5min intervals)',
                data: prices,
            }]
        }
    });
});
