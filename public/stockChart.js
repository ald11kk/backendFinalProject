// Fetching Apple stock data
fetch('https://cloud.iexapis.com/stable/stock/aapl/chart/1d?token=sk_e0a19f5112014ec7bb1d008d6cac2a24')
.then(response => response.json())
.then(data => {
    const ctx = document.getElementById('stockChart').getContext('2d');
    const prices = data.map(stock => stock.close);
    const times = data.map(stock => stock.label);
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'AAPL Stock Price (Today)',
                data: prices,
            }]
        }
    });
});
