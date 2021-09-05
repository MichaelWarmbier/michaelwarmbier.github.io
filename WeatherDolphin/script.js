/////* Data */////

activeLat = 51.505;
activeLong = -0.09;

var daysoftheweek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

var receivedData = null;
var storedData = [
{
  date: null,
  dotw: null,
  icon: null,
  celsius: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  fahrenheit: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  desc: null,
  weather: null
},
{
  date: null,
  dotw: null,
  icon: null,
  celsius: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  fahrenheit: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  desc: null,
  weather: null
},
{
  date: null,
  dotw: null,
  icon: null,
  celsius: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  fahrenheit: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  desc: null,
  weather: null
},
{
  date: null,
  dotw: null,
  icon: null,
  celsius: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  fahrenheit: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  desc: null,
  weather: null
},
{
  date: null,
  dotw: null,
  icon: null,
  celsius: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  fahrenheit: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  desc: null,
  weather: null
},
{
  date: null,
  dotw: null,
  icon: null,
  celsius: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  fahrenheit: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  desc: null,
  weather: null
},
{
  date: null,
  dotw: null,
  icon: null,
  celsius: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  fahrenheit: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  desc: null,
  weather: null
},
{
  date: null,
  dotw: null,
  icon: null,
  celsius: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  fahrenheit: {
    morn: null,
    day: null,
    eve: null,
    night: null,
  },
  desc: null,
  weather: null
}]

/////* Functions */////

async function initialize(long, lat) { // Initializes data objects

  receivedData = await pullData('https://api.openweathermap.org/data/2.5/onecall?lat=' + (lat).toFixed(5) + '&lon=' + long.toFixed(5) + '&exclude=hourly,minutely&appid=270a656651f64bb2de710a5bba3df6c7&units=imperial');

  try {
  for (i = 0; i <= 7; i++) {

    storedData[i].date = await receivedData.daily[i].dt;
    let time = new Date(storedData[i].date * 1000);
    // Set Dates
    storedData[i].dotw = daysoftheweek[time.getDay()]
    storedData[i].date = ((time.getMonth() + 1) + '/' + time.getDate() + '/' + time.getFullYear())
    // Get Icon
    storedData[i].icon = receivedData.daily[i].weather[0].icon;
    // Set Fahrenheit Info
    storedData[i].fahrenheit.morn = (receivedData.daily[i].temp.morn).toFixed(0);
    storedData[i].fahrenheit.day = (receivedData.daily[i].temp.day).toFixed(0);
    storedData[i].fahrenheit.eve = (receivedData.daily[i].temp.eve).toFixed(0);
    storedData[i].fahrenheit.night = (receivedData.daily[i].temp.night).toFixed(0);
    // Set Celsius Info
    storedData[i].celsius.morn = ((storedData[i].fahrenheit.morn - 32) * 5/9).toFixed(0);
    storedData[i].celsius.day = ((storedData[i].fahrenheit.day - 32) * 5/9).toFixed(0);
    storedData[i].celsius.eve = ((storedData[i].fahrenheit.eve - 32) * 5/9).toFixed(0);
    storedData[i].celsius.night = ((storedData[i].fahrenheit.night - 32) * 5/9).toFixed(0);
    // Set Weather Info
    storedData[i].desc = receivedData.daily[i].weather[0].description
    storedData[i].weather = receivedData.daily[i].weather[0].main;

  }
  }
  catch(e) {
    throw "err";
  }

  initializeWeatherCards(storedData);

  console.log('Longitude: ' + long + '\nLatitude: ' + lat + '\n')
  await console.log(storedData);
  console.log('\n\n');

}

async function pullData(link) { // Grabs data from API

  request = await fetch(link);
  d = request.json();
  return d;

}

function initializeWeatherCards(info) {
  let day = document.getElementsByClassName('day');

  for (i = 0; i < day.length; i++) {
    day[i].getElementsByTagName('p')[0].innerHTML = info[i].dotw;
    day[i].getElementsByTagName('p')[1].innerHTML = info[i].date;
    day[i].getElementsByTagName('p')[2].innerHTML = info[i].desc;
    day[i].getElementsByTagName('img')[0].src = 'http://openweathermap.org/img/wn/' + info[i].icon + '@2x.png'
    day[i].getElementsByTagName('p')[3].innerHTML = 
    ((parseInt(info[i].celsius.morn) + 
     parseInt(info[i].celsius.day) + 
     parseInt(info[i].celsius.eve) + 
     parseInt(info[i].celsius.night))
      / 4) + ' C°'; 
    day[i].getElementsByTagName('p')[4].innerHTML = 
    ((parseInt(info[i].fahrenheit.morn) + 
     parseInt(info[i].fahrenheit.day) + 
     parseInt(info[i].fahrenheit.eve) + 
     parseInt(info[i].fahrenheit.night))
      / 4) + ' F°'; 
  }

}


/////* Leaflet.js */////

// Create Map
var Map = L.map('map').setView([51.505, -0.09], 3);
var marker = L.marker([0,0]).addTo(Map);


// Add tilelayer
L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
  
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: 'pk.eyJ1Ijoia2lyYm91dCIsImEiOiJja3Q2MnYybGwwZWR4Mndsamw3MDE0NGpzIn0.TQgwZ7wIV0MrFLWVGUC5FA'

}).addTo(Map);

// Store longitude and latitude on click event
function mapClick(e) {

  Map.removeLayer(marker)

  activeLat = e.latlng.lat;
  activeLong = e.latlng.lng;

  initialize(activeLong, activeLat);

  marker = L.marker([activeLat.toFixed(5), activeLong.toFixed(5)]).addTo(Map);

}

Map.on('click', mapClick);

/////* Other */////

// Run initialize() on window load
window.onload = function() { return initialize(activeLong, activeLat); };


