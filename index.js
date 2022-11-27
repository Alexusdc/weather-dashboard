// defining all global variables
var today = moment().format('L'); 
var searchBtn = document.querySelector("#searchBtn");
var pastSearches = document.querySelector("#pastSearches");
var city = document.querySelector("#city");
var userCity = document.querySelector("#userCity");
var userIcon = document.querySelector("#icon");
var userTemp = document.querySelector("#temp");
var userWind = document.querySelector("#wind");
var userHumidity = document.querySelector("#humidity");
var userUv = document.querySelector("#uv");
var cityName;
var h5El = document.getElementsByTagName("h5");
var iconEl = document.querySelectorAll(".cardIcon");
var humidityEl = document.querySelectorAll(".cardHumidity");
var tempEl = document.querySelectorAll(".cardTemp");
var windEl = document.querySelectorAll(".cardWind");
var pastCity = []

userCity.textContent = userCity.innerHTML + " " + today;

var getCitySearch = function() {
    // grab repo name from url query string
    var queryString = document.location.search;
    var citySearch = queryString.split("=")[1];
  
    if (citySearch) {
      // display city name on the page
      citySearchEl.textContent = citySearch;
  
      getCityWeather(citySearch);
    } else {
      // if no city was given, redirect to the homepage
      document.location.replace("./index.html");
    }
};

var cityLatLon = function() {
    const apiUrl = "http://api.openweathermap.org/geo/1.0/direct?q=" + city + "&appid=5490ea50c0bb73766f59cac2430e55fe"

    fetch(apiUrl).then(function(response) {
      return response.json();
    })

    
};

var getCityWeather = function(repo) {
    // format the github api url
    const apiUrl = "https://api.openweathermap.org/data/2.5/forecast?lat={lat}&lon={lon}&appid=5490ea50c0bb73766f59cac2430e55fe";
  
    // make a get request to url
    fetch(apiUrl).then(function(response) {
      // request was successful
      if (response.ok) {
        response.json().then(function(data) {
          displayWeather(data);
  
          // check if api has paginated issues
          if (response.headers.get("Link")) {
            displayWarning(repo);
          }
        });
      } else {
        // if not successful, redirect to homepage
        document.location.replace("./index.html");
      }
    });
  };