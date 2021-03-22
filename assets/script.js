// document.ready
// $(document).ready(function() {
//     console.log("ready!");


var searchBtn = document.getElementById("search-button");
var cityInput = document.getElementById("city-input");
var historyEl = document.getElementById("history");
var clearHistory = document.getElementById("clear-history");
var city = document.getElementById("city-name");
var cityTemp = document.getElementById("temperature");
var cityHumidity = document.getElementById("humidity");
var cityWindSpeed = document.getElementById("wind-speed");
var cityUVIndex = document.getElementById("UV-index");
var icon = document.getElementById("weather-icon");
var forecast = document.querySelectorAll(".fiveDayForecast");

var todayMoment = moment();
var today = document.getElementById("today-date");

var APIKey = "e3813bf326b2e2d008254be6963cf88d"


    function getWeatherApi(cityName) {
        // API call for weather info
        var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial" + "&appid=" + APIKey;

        fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            // display city name and today's date
            city.innerHTML = (data.name);
            today.innerHTML = todayMoment.format("MMMM Do, YYYY");
            // display results for temp, humidity, wind speed
            cityTemp.innerHTML = "Temperature: " + Math.round(data.main.temp) + " &#176F";
            cityHumidity.innerHTML = "Humidity: " + (data.main.humidity) + "%";
            cityWindSpeed.innerHTML = "Wind Speed: " + Math.round(data.wind.speed) + " MPH";
            
            // display weather pic icon
            icon.innerHTML = data.weather[0].icon;
             icon.setAttribute("src","https://openweathermap.org/img/wn/" + icon + "@2x.png");
             icon.setAttribute("alt",data.weather[0].description);

            // API call for UV Index
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            var requestUVIndex = "https://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

            fetch(requestUVIndex)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                // display UV results
                cityUVIndex.innerHTML = "UV Index: " + (data.value);
            })



        
             
            

            // API call for 5 day forecast
            var request5Day = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&units=imperial" + "&exclude=current,minutely,hourly&appid=" + APIKey;

            fetch(request5Day)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                for (i=0; i<forecast.length; i++) {
                    forecast[i].innerHTML = "";
                    const forecastDate = document.createElement("p");
                    forecastDate.innerHtml = (data.list[i].dt_text);
                    forecast[i].append(forecastDate);
                    // display 5 day temps
                    const forecastTemp = document.createElement("p");
                    forecastTemp.innerHTML = "Temp: " + Math.round(data.list[i].main.temp) + " &#176F";
                    forecast[i].append(forecastTemp);
                    // display 5 day humidity
                    const forecastHumidity = document.createElement("p");
                    forecastHumidity.innerHTML = "Humidity: " + Math.round(data.list[i].main.humidity);
                    forecast[i].append(forecastHumidity);
                    
                    
                    
                    // display weather pic icon
                //     const forecastIcon = document.createElement("img");
                // forecastIcon.setAttribute("src","https://openweathermap.org/img/wn/" + data.list[forecastIndex].weather[0].icon + "@2x.png");
                // forecastIcon.setAttribute("alt",response.data.list[forecastIndex].weather[0].description);
                // forecast[i].append(forecastIcon);
                   
                }



            })


        })
    }












// saving search history to local storage   
let searchHistory = JSON.parse(localStorage.getItem("search")) || [];
    console.log(searchHistory);

// clicking the search button will getWeatherApi for that city and add city name to local storage
searchBtn.addEventListener("click", function() {
    var searchTerm = cityInput.value;   
    getWeatherApi(searchTerm);
    searchHistory.push(searchTerm);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    showSearchHistory();
})

// function to add city name to search history list
function showSearchHistory() {
    historyEl.innerHTML = "";
    for (let i = 0; i < searchHistory.length; i++) {
        const historyList = document.createElement("input");
        historyList.setAttribute("type","button");
            historyList.setAttribute("class", "form-control d-block bg-white");
            historyList.setAttribute("value", searchHistory[i]);
            // clicking on a city name in the history list will getWeatherApi again for that city
            historyList.addEventListener("click",function() {
                getWeatherApi(historyList.value);
                document.getElementById('city-input').value = historyList.value;
            })
            historyEl.append(historyList);
    }
}

// clicking clear history button empties the history list, resets the city-input form, and resets all the city data
clearHistory.addEventListener("click", function() {
    searchHistory = [];
    showSearchHistory();
    document.getElementById('city-input').value = "";
    city.innerHTML = "";
    today.innerHTML = "";
    cityTemp.innerHTML = "";
    cityHumidity.innerHTML = "";
    cityWindSpeed.innerHTML = "";
    cityUVIndex.innerHTML = "";
    icon.innerHTML = "";
})




















// });    