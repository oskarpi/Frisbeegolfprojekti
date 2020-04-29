'use strict';
const saatiedot = document.getElementById('saatiedotnyt');
const kaupunki = document.getElementById('kaupunkinyt');
const saatila = document.getElementById('saatilanyt');
const lampotila = document.getElementById('lampotilanyt');
const tuuli = document.getElementById('tuulinyt');
const reitti = document.getElementById('reitti');
const saatiedotMyohemmin = document.getElementById('saatiedotmyohemmin');


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
  console.log(latitudeRata);
  console.log(longitudeRata);
  fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${latitudeRata}&lon=${longitudeRata}&units=metric&lang=fi&appid=d5f46b97c0d3618c2e85e2939ec55a4b`)//pitää saada toimimaan muuttujilla
      .then(function(vastaus) {
        return vastaus.json();
      }).then(function(nykyinenSaa) {
    console.log(nykyinenSaa);

    if (nykyinenSaa.name === '') {
      kaupunki.innerHTML = 'Kaupungin nimeä ei löytynyt';
    }
    else {
      kaupunki.innerHTML = nykyinenSaa.name;
    }

    saatila.innerHTML = 'Säätila: ' + nykyinenSaa.weather[0].description;
    lampotila.innerHTML = 'Lämpötila: ' + nykyinenSaa.main.temp + ' C';
    tuuli.innerHTML = 'Tuulen nopeus: ' + nykyinenSaa.wind.speed + ' m/s';
    reitti.href = `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=60.20,20.4&destination=65.34,25.5`;
  }).catch(function(error) {
    console.log(error);
  });
}

function saa3h(latitude, longitude) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=67.1&lon=28.4&units=metric&lang=fi&appid=d5f46b97c0d3618c2e85e2939ec55a4b`)
  .then(function(vastaus) {
    return vastaus.json();
  }).then(function(myohempiSaa) {
    console.log(myohempiSaa);
    for (let j=1; j<10; j++){
      const kappale =`
    <div id="${j}"></div>`;

      saatiedotMyohemmin.innerHTML +=kappale;

      let kappale1= document.getElementById(j);

      if(myohempiSaa.list[j].dt_txt===''){
        const aika=`
      <p>Aikaa ei saatavilla</p>`;
        kappale1.innerHTML +=aika;
      }else {
        const aika=`
      <p>Aika: ${myohempiSaa.list[j].dt_txt}</p>`;
        kappale1.innerHTML += aika;
      }


      if(myohempiSaa.list[j].weather[0].description===null){
        const saatila=`
      <p>Säätilaa ei saatavilla</p>`;
        kappale1.innerHTML += saatila;
      }else{
        const saatila=`
      <p>Säätila: ${myohempiSaa.list[j].weather[0].description}<p>`;
        kappale1.innerHTML += saatila;
      }

      if(myohempiSaa.list[j].main.temp===''){
        const lampotila=`
      <p>Sään kuvausta ei löytynyt</p>`;
        kappale1.innerHTML += lampotila;
      }else{
        const lampotila=`
      <p>Lämpötila: ${myohempiSaa.list[j].main.temp}</p>`;
        kappale1.innerHTML += lampotila;
      }

      if(myohempiSaa.list[j].wind.speed===''){
        const tuuli =`
      <p>Tuulennopeutta ei saatavilla</p>`;
        kappale1.innerHTML += tuuli;
      }else{
        const tuuli =`
       <p> Tuulen nopeus : ${myohempiSaa.list[j].wind.speed}</p>`;
        kappale1.innerHTML += tuuli;
      }
    }
  }).catch(function(error) {
    console.log(error);
  })
}

