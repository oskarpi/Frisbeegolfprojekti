'use strict';
const saatiedot = document.getElementById('saatiedotnyt');
const kaupunki = document.getElementById('kaupunkinyt');
const saatila = document.getElementById('saatilanyt');
const lampotila = document.getElementById('lampotilanyt');
const tuuli = document.getElementById('tuulinyt');
const saatiedot3h = document.getElementById('saatiedot3h');
const kaupunki3h = document.getElementById('kaupunki3h');
const saatila3h = document.getElementById('lampotila3h');
const tuuli3h = document.getElementById('tuuli3h');

const platform = new H.service.Platform({
  'apikey': '8p9FRYr_h6RIG1C7OlCpADhv1cGVXNQBlIfZA4pFihU'});

const defaultLayers = platform.createDefaultLayers();

const map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map,{
      center: {lat:50, lng:5},
      zoom: 12,
      pixelRatio: window.devicePixelRatio || 1
    });

const mapEvents = new H.mapevents.MapEvents(map);
const behavior = new H.mapevents.Behavior(mapEvents);
const geocoderService = platform.getGeocodingService();
const ui = H.ui.UI.createDefault(map, defaultLayers, 'fi-FI');
let latitudeRata = null;
let longitudeRata = null;
let nimiRata = null;

if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(position => {
    map.setCenter({
      lat: position.coords.latitude,
      lng: position.coords.longitude
    });
    geocoderService.reverseGeocode(
        {
          mode:"retrieveAddress",
          maxresults: 1,
          prox: position.coords.latitude + "," + position.coords.longitude
        },
        success => {
          let latitude= position.coords.latitude;
          let longitude = position.coords.longitude;
          console.log(latitude);
          console.log(longitude);
          let youMarker = new H.map.Marker({lat:latitude, lng:longitude});
          map.addObject(youMarker);
        },
        error => {
          console.error(error);
        }
    );
  });
}

function haeRadat() {
  fetch(`https://discgolfmetrix.com/api.php?content=courses_list&country_code=FI`)
  .then(function(vastaus) {
    return(vastaus.json());
  }).then(function(radat){
    console.log(radat);
    var pngIcon = new H.map.Icon("https://cdn0.iconfinder.com/data/icons/daily-boxes/150/phone-box-32.png"); // kuva pitää muuttaa
    for (let i=0; i<radat.courses.length; i++) {
        latitudeRata = radat.courses[i].X;
        longitudeRata = radat.courses[i].Y;
        nimiRata = radat.courses[i].Fullname;

        if(latitudeRata==="" || latitudeRata===0 || longitudeRata==="" || latitudeRata ===0){
          console.log('ei merkattuja koordinaatteja');
        }else {
        let rataMarker = new H.map.Marker({lat: latitudeRata, lng: longitudeRata },
                  {icon: pngIcon});
        rataMarker.setData("<p>"+nimiRata+"</p>");
        rataMarker.addEventListener("tap", event => {
          saaNyt(latitudeRata,longitudeRata);
          saa3h(latitudeRata, longitudeRata);
          const bubble = new H.ui.InfoBubble(event.target.getGeometry(),
              {
                content: event.target.getData()
              }
          );
          ui.addBubble(bubble);
        }, false);
        map.addObject(rataMarker);
        }
    }
  }).catch(function(error) {
    console.log(error);
  })
}
haeRadat();

function saaNyt(latitudeRata, longitudeRata) {
  fetch(`https://api.openweathermap.org/data/2.5/weather?lat=90&lon=80&units=metric&lang=fi&appid=d5f46b97c0d3618c2e85e2939ec55a4b`)//pitää saada toimimaan muuttujilla
  .then(function(vastaus) {
    return vastaus.json();
  }).then(function(nykyinenSaa) {
    console.log(nykyinenSaa);
    if(nykyinenSaa.name===''){
      kaupunki.innerHTML = 'Kaupungin nimeä ei löytynyt';
    }else {
      kaupunki.innerHTML = nykyinenSaa.name;
    }

    saatila.innerHTML = 'Säätila: ' + nykyinenSaa.weather[0].description;
    lampotila.innerHTML = 'Lämpötila: ' + nykyinenSaa.main.temp + ' C';
    tuuli.innerHTML = 'Tuulen nopeus: ' + nykyinenSaa.wind.speed + ' m/s';
  }).catch(function(error) {
    console.log(error);
  });
}

function saa3h(latitude, longitude) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=65&lon=70&units=metric&lang=fi&appid=d5f46b97c0d3618c2e85e2939ec55a4b`)
  .then(function(vastaus) {
    return vastaus.json();
  }).then(function(myohempiSaa) {
    console.log(myohempiSaa);

  }).catch(function(error) {
    console.log(error);
  })
}