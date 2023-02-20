var weatherIcons = {
  rainy:'<div class="icon rainy forecast"><div class="cloud"></div><div class="rain"></div></div>',
  sunny: '<div class="icon sunny forecast"><div class="sun"><div class="rays"></div></div></div>',
  cloudy: '<div class="icon cloudy forecast"><div class="cloud"></div><div class="cloud"</div></div>',
  stormy: '<div class="icon thunder-storm forecast"><div class="cloud"></div><div class="lightning"><div class="bolt"></div><div class="bolt"></div></div></div>',
  snowy: '<div class="icon flurries forecast"><div class="cloud"></div><div class="snow"><div class="flake"></div><div class="flake"></div></div></div>',
  sunshower: '<div class="icon sun-shower forecast"><div class="cloud"></div><div class="sun"><div class="rays"></div></div><div class="rain"></div></div>',
  sunnycloudy: '<div class="icon sun-shower forecast"><div class="cloud"></div><div class="sun"><div class="rays"></div></div></div>',
  windy: '<div class="icon wind forecast"><div class=""></div><div class="cloud"></div><div class="icon"><div class=""></div><div class="cloud"></div><div class="icon windy"><div class=""></div><div class="cloud"></div></div></div></div>'
};

var days = new Array("Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday");

$('.day-1').html(weatherIcons.stormy);


getGeoLocation();
updateTime();
setInterval(updateTime, 1000);




function updateTime() {
  var now = new Date();
  var hrs = correctTime('hours', now.getHours());
  var min = correctTime('min', now.getMinutes());
  var sec = correctTime('sec', now.getSeconds());
  $('.date-time-hr').html(hrs);
  $('.date-time-min').html(min);
  $('.date-day').html(days[now.getDay()]);
  updateDate(now);
}

function correctTime(type, value) {
  if (type == "hours") {
    if (value > 12) {
        value -= 12;
      }
  }
  value = validateTwoDigits(value);
  return value;
}

function validateTwoDigits(value) {
  if (value < 10) {
    value = "0" + value;
  }
  return value;
}

function updateDate(now) {
  var mo = now.getMonth() + 1;
  var dy = validateTwoDigits(now.getDate());
  var yr = now.getFullYear();
  var today = mo + "/" + dy + "/" + yr;
  $('.date-date').html(today);
}

function getGeoLocation() {
  if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
   var lat = position.coords.latitude 
   var long = position.coords.longitude; 
   getCurrentWeather(lat, long);
   getForecast(lat, long);
}

function getCurrentWeather(lat, long) {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/weather?lat=" + lat + "&lon=" + long + "&units=imperial&APPID=c1ba7dd562de1993dd9f039dc0943036",
    success: (function(data) {
      var weatherData = data;
      console.log(data);
      showCurrentWeather(weatherData);
    })
  })
}

function showCurrentWeather(data) {
  $('.loc-city').html(data.name);
  $('.current-temp').html(Math.round(data.main.temp) + "&deg;<span class=\"btn-degrees\">F</span>")
  $('.current-weather-condition').html(data.weather[0].main);
  //$('.current-weather-cond-desc').html(": (" + data.weather[0].description + ")");
  $('.current-weather-hi-lo').html(Math.round(data.main.temp_max) + "&deg; / " + Math.round(data.main.temp_min) + "&deg;");
  $('.wind-dir').html(getWindDirection(data.wind.deg) + " / ");
  $('.wind-speed').html((data.wind.speed) + " MPH");
  var condition = getWeatherIcon(data.weather[0].main);
  $('.icon-container').html(weatherIcons[condition]);
  $('.icon-container > div:first').removeClass('forecast');
}

function getForecast(lat, long) {
  $.ajax({
    url: "https://api.openweathermap.org/data/2.5/forecast?lat=" + lat + "&lon=" + long + "&units=imperial&APPID=c1ba7dd562de1993dd9f039dc0943036",
    success: (function(data) {
      var weatherData = data;
      console.log(data);
      showForecast(data);
    })
  })
}

function showForecast(data) {
  let day, high, low, icon;
  let dayList = [];
  for(i=0;i<data.list.length;i++) {
    let tmpDay = new Date(data.list[i].dt * 1000).getDay();
      if (!dayList.includes(days[tmpDay])) {
        dayList.push(days[tmpDay]);
      }
    }
  for (i=0;i<5;i++) {
    let el = $('.forecast-day'+i);
    $(el).html(dayList[i]);
  }
  }

function getWeatherIcon(condition) {
  var weathCond = "";
  switch (condition) {
    case "Thunderstorm":
    case "Extreme":
      weathCond = "stormy";
      break;
    case "Rain":
      weathCond = "rainy";
      break;
    case "Snow":
      weathCond = "snowy";
      break;
    case "Atmosphere":
    case "Clouds":
      weathCond = "cloudy";
      break;
    case "Clear":
      weathCond = "sunny";
      break;
    case "Additional":
      weathCond = "windy";
      break;
                   }
  return weathCond;
}

function updateIcon(el, index) {
  
}

var degreeDirection = [
  {dir: "NNE",left: 11.25},
  {dir: "NE",left: 33.75},
  {dir: "ENE",left: 56.25},
  {dir: "E",left: 78.75},
  {dir: "ESE",left: 101.25},
  {dir: "SE",left: 123.75},
  {dir: "SSE",left: 146.25},
  {dir: "S",left: 168.75},
  {dir: "SSW",left: 191.25},
  {dir: "SW",left: 213.75},
  {dir: "WSW",left: 236.25},
  {dir: "W",left: 258.75},
  {dir: "WNW",left: 281.25},
  {dir: "NW",left: 303.75},
  {dir: "NNW",left: 326.25},
  {dir: "N",left: 348.75}
];

function getWindDirection(deg) {
  if (deg < degreeDirection[0].left || deg >= degreeDirection[degreeDirection.length-1].left) {
    return degreeDirection[degreeDirection.length-1].dir;
  } else {
    for (var i = 0; i < degreeDirection.length; i++) {
      if (deg >= degreeDirection[i].left && deg < degreeDirection[i+1].left) {
        return degreeDirection[i].dir;
      }
    }
  }
}

$('.btn-degrees').click(function() {
  console.log("clicked");
})

$('.fa-refresh').click(function() {
  console.log("I'm clicked");
})