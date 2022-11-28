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

    .then(function (data) {
      var lat = data.coord.lat;
      var lon = data.coord.lon;
      var officialCity = data.name;
      var nowIcon = 'http://openweathermap.org/img/wn/' + data.weather[0].icon + '@2x.png';
      userIcon.setAttribute("src", nowIcon);
      var cityTitle = officialCity + " " + today;
      var secondRequest = 'https://api.openweathermap.org/data/2.5/onecall?lat=' + lat + '&lon=' + lon +'&units=imperial&APPID=cae8444643fe0b52a066739e6b318cbd';
      if(!localStorage.getItem("pastCity")){
          var pastSearchBtn = document.createElement("button");
          pastSearchBtn.textContent = officialCity;
          pastSearches.append(pastSearchBtn);
          pastSearchBtn.classList.add("btn-secondary", "btn-lg", "btn-block");
          pastCity.push(pastSearchBtn.textContent.valueOf());
          localStorage.setItem("pastCity",pastCity);
      }else{
          var pastCitiesArray = localStorage.getItem("pastCity").split(",");
          if(!pastCitiesArray.includes(officialCity)){
              var pastSearchBtn = document.createElement("button");
              pastSearchBtn.textContent = officialCity;
              pastSearches.append(pastSearchBtn);
              pastSearchBtn.classList.add("btn-secondary", "btn-lg", "btn-block");
              pastCity.push(pastSearchBtn.textContent.valueOf());
              localStorage.setItem("pastCity",pastCity);
          }
      }   
      
      fetch(secondRequest)
          .then(function (response) {
              return response.json();
          })
          .then(function (data) {
              userCity.textContent = cityTitle;
              userTemp.textContent = "Temp: " + data.current.temp + "ºF";
              userWind.textContent = "Wind: " + data.current.wind_speed + " MPH";
              userHumidity.textContent = "Humidity: " + data.current.humidity + "%";
              for (let i = 0; i < h5El.length; i++) {
                  var cardDates = data.daily[i+1].dt;
                  var differentDates = moment(cardDates, "X").format("L");
                  h5El[i].textContent = differentDates;
                  var iconCard = 'http://openweathermap.org/img/wn/' + data.daily[i+1].weather[0].icon + '@2x.png';
                  iconEl[i].setAttribute("src", iconCard);
                  var humidCard = data.daily[i+1].humidity;
                  humidityEl[i].textContent = "Humidity: " + humidCard + "%";
                  var tempCard = data.daily[i+1].temp.max;
                  tempEl[i].textContent = "Temp: " + tempCard + "ºF";
                  var windCard = data.daily[i+1].wind_speed;
                  windEl[i].textContent = "Wind: " + windCard + " MPH";
              }
          });
  });
    
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

  if(localStorage.getItem("pastCity")){
    var pastStoredCity = localStorage.getItem("pastCity");
    pastStoredCity = pastStoredCity.split(",");
    for (i=0; i < pastStoredCity.length; i++){
        var pastStoredCityBtn = document.createElement("button");
        pastSearches.append(pastStoredCityBtn);
        pastStoredCityBtn.textContent = pastStoredCity[i];
        pastStoredCityBtn.classList.add("btn-secondary", "btn-lg", "btn-block");
    }
}

pastSearches.addEventListener("click", function(event){
    event.preventDefault();
    cityName=event.target.innerHTML;
    getCoordinates();
})