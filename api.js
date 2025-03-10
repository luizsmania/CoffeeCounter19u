let previousRate = null;
    
async function fetchConversionRate() {
    const apiKey = '3359f83633-b085db2646-snakfb'; // Your actual API key
    const url = `https://api.fastforex.io/fetch-one?from=EUR&to=BRL&api_key=${apiKey}`;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            console.error('Response status:', response.status);
            console.error('Response text:', await response.text());
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        console.log('API Response:', data); // Log the entire response for debugging

        // Access the conversion rate from the correct property
        if (data.result && data.result.BRL) {
            const rate = Math.floor(data.result.BRL * 100) / 100; // Truncate to two decimal places

            // Prepare the conversion rate text with the trend symbol
            let trendSymbol = '📈'; // Initial value
            let lastTrendSymbol = ''; // Store the last trend symbol

            if (previousRate !== null) {
                if (rate > previousRate) {
                    trendSymbol = ' 📈'; // Up arrow symbol
                    lastTrendSymbol = trendSymbol; // Update last trend symbol
                } else if (rate < previousRate) {
                    trendSymbol = ' 📉'; // Down arrow symbol
                    lastTrendSymbol = trendSymbol; // Update last trend symbol
                } else {
                    console.log("No change in rate");
                    trendSymbol = lastTrendSymbol; // Keep the last trend symbol
                }
            }

            // Use trendSymbol as needed


            // Update the conversion rate and include the trend symbol
            document.getElementById('conversionRate').textContent = `1€ = ${rate} BRL${trendSymbol}`;

            // Update previous rate
            previousRate = rate;
        } else {
            console.error('Unexpected response structure:', data);
            document.getElementById('conversionRate').textContent = 'Invalid response format.';
        }

    } catch (error) {
        console.error('Error fetching the conversion rate:', error);
        document.getElementById('conversionRate').textContent = 'Error fetching conversion rate.';
    }
}

// Fetch conversion rate every 2 minutes (120000 milliseconds)
setInterval(fetchConversionRate, 120000);
fetchConversionRate(); // Initial call

const apiKey = 'YOUR_API_KEY'; // Replace with your OpenWeatherMap API key
const city = 'Dublin';
const url = `https://api.openweathermap.org/data/2.5/weather?q=Dublin&appid=604b3b10dc1bd50d0c79ac19718d5c7e&units=metric`;

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        const weatherDescription = data.weather[0].description;
        const temperature = data.main.temp;
        const currentTime = new Date();

        // Get the day of the week and format date as DD/MM/YYYY
        const options = { weekday: 'long', year: 'numeric', month: 'numeric', day: 'numeric' };
        const today = currentTime.toLocaleDateString('en-GB', options); // e.g., "Wednesday, 16/10/2024"

        const greeting = currentTime.getHours() < 12 ? "Good Morning!" : 
                         currentTime.getHours() < 18 ? "Good Afternoon!" : 
                         "Good Evening!";

        document.getElementById('weather-info').innerHTML = 
            `${today}<br>${greeting}<br>Dublin weather today: ${weatherDescription}, ${temperature}°C.`;
    })
    .catch(error => {
        document.getElementById('weather-info').innerText = "Could not fetch weather data.";
        console.error("Error fetching weather data:", error);
    });

// Reload the page every 2 hours (7200000 milliseconds)
setTimeout(() => {
    location.reload();
}, 7200000); // 2 hours in milliseconds == 7200000