
var searchBtn = document.getElementById("search-button");
var cityInput = document.getElementById("city-input");
var historyEl = document.getElementById("history");
var clearHistory = document.getElementById("clear-history");
var city = document.getElementById("city-name");
var cityTemp = document.getElementById("temperature");
var cityTempHiLo = document.getElementById("temperature-hi-lo")
var cityHumidity = document.getElementById("humidity");
var cityWindSpeed = document.getElementById("wind-speed");
var cityUVIndex = document.getElementById("UV-index");
var weatherIcon = document.getElementById("weather-icon");
var forecast = document.querySelectorAll(".fiveDayForecast");
var forecastIcon = document.getElementById("forecast-icon");

var todayMoment = moment();
var today = document.getElementById("today-date");

var APIKey = "e3813bf326b2e2d008254be6963cf88d";



    function getWeatherApi(cityName) {
        // API call for current weather info
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
            weatherIcon.innerHTML = data.weather[0].icon;
             weatherIcon.setAttribute("src","https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
             weatherIcon.setAttribute("alt",data.weather[0].description);



            // API call for UV Index and Temp Hi/Lo
            let lat = data.coord.lat;
            let lon = data.coord.lon;
            var requestUVIndex = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&units=imperial&appid=" + APIKey;

            fetch(requestUVIndex)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);

                // display results for temp hi/lo
                // needed to be inside this function for OneCall API because the API for Weather does not include temp hi/lo
                cityTempHiLo.innerHTML = "Temperature High/Low: " + Math.round(data.daily[0].temp.max) + "/" + Math.round(data.daily[0].temp.min) + " &#176F";
                
                // display UV results
                let UVIndex = document.createElement("span");
                
                UVIndex.innerHTML = data.daily[0].uvi;
                cityUVIndex.innerHTML = "UV Index: ";
                cityUVIndex.append(UVIndex);

                // if-else conditions for changing background color of uv index data
                if (data.daily[0].uvi < 3) {
                    // less than 3 is low = green
                    UVIndex.setAttribute("class","badge badge-success");
                  } else if (data.daily[0].uvi >= 3 && data.daily[0].uvi < 6) {
                    // between 3-6 is medium = yellow
                    UVIndex.setAttribute("class","badge badge-warning");
                  } else if (data.daily[0].uvi >= 6 && data.daily[0].uvi < 8) {
                    //between 6-8 is high = orange
                    UVIndex.setAttribute("class","badge badge-warning");
                  } else if (data.daily[0].uvi >= 8 && data.daily[0].uvi <= 11) {
                    // between 8-11 is very high = red
                    UVIndex.setAttribute("class","badge badge-danger");
                  } else {
                    // over 11 is extreme = purple
                    UVIndex.setAttribute("class","badge badge-danger");
                  }
            })



            // API call for 5 day forecast
            var request5Day = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=current,minutely,hourly,alerts&units=imperial&appid=" + APIKey;

            fetch(request5Day)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                console.log(data);
                for (i=0; i<forecast.length; i++) {
                    forecast[i].innerHTML = "";
                    // display 5 day dates - i+1 means start with the second date
                    const forecastDate = new Date(data.daily[i + 1].dt *1000).toLocaleDateString("en-US");
                        console.log(forecastDate);
                    forecast[i].append(forecastDate);
                    // display 5 day icons
                    // const forecastIcon = document.getElementById("forecast-icon");
                    // forecastIcon.innerHTML = data.daily[i].weather[0].icon;
                    // forecastIcon.setAttribute("src","https://openweathermap.org/img/wn/" + forecastIcon + ".png");
                    // forecastIcon.setAttribute("alt",(data.daily[i].weather[0].description));
                    // display 5 day temps
                    const forecastTemp = document.createElement("p");
                    forecastTemp.innerHTML = "Temp: " + Math.round(data.daily[i].temp.min) + "/" + Math.round(data.daily[i].temp.max) + " &#176F";
                    forecast[i].append(forecastTemp);
                    // display 5 day humidity
                    const forecastHumidity = document.createElement("p");
                    forecastHumidity.innerHTML = "Humidity: " + Math.round(data.daily[i].humidity);
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


// EVERYTHING LOCAL STORAGE BELOW

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
    localStorage.clear();
    // this function (window.location.reload()) basically refreshes the page back to 0
    window.location.reload();
})

