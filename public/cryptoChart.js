// Fetching Bitcoin data
fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=1')
.then(response => response.json())
.then(data => {
    const ctx = document.getElementById('cryptoChart').getContext('2d');
    const prices = data.prices.map(price => price[1]);
    const times = data.prices.map(price => new Date(price[0]).toLocaleTimeString());
    const chart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: times,
            datasets: [{
                label: 'Bitcoin Price (Last 24h)',
                data: prices,
            }]
        }
    });
});
