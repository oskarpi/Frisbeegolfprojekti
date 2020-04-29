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
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          haeRadat(latitude,longitude);
          console.log(latitude);
          console.log(longitude);
          const youMarker = new H.map.Marker({lat:latitude, lng:longitude});
          map.addObject(youMarker);
        },
        error => {
          console.error(error);
        }
    );
  });
}

function haeRadat(lat, long) {
  console.log(lat);
  console.log(long);
  fetch(`https://discgolfmetrix.com/api.php?content=courses_list&country_code=FI`)
  .then(function(vastaus) {
    return(vastaus.json());
  }).then(function(radat){
    console.log(radat);

    var pngIcon = new H.map.Icon("https://cdn0.iconfinder.com/data/icons/daily-boxes/150/phone-box-32.png"); // kuva pitää muuttaa
    for (let i=0; i<radat.courses.length; i++) {
       const latitudeRata = radat.courses[i].X;
       const longitudeRata = radat.courses[i].Y;
       const rataLopetettu = radat.courses[i].Enddate;
       const nimiRata = radat.courses[i].Fullname;


        if(latitudeRata==="" || latitudeRata===0 || longitudeRata==="" || latitudeRata ===0){
          console.log('ei merkattuja koordinaatteja');
        }else if(rataLopetettu===null){
        let rataMarker = new H.map.Marker({lat: latitudeRata, lng: longitudeRata },
                  {icon: pngIcon});
        rataMarker.setData("<p>"+nimiRata+"</p>");
        rataMarker.addEventListener("tap", event => {
          console.log(lat);
          console.log(long);
          saaNyt(lat, long, latitudeRata,longitudeRata);
          saaMyohemmin(latitudeRata, longitudeRata);
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


function saaNyt(latitudeSijainti, longitudeSijainti, latitudeRata, longitudeRata) {
  console.log(latitudeSijainti);
  console.log(longitudeSijainti);
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
    reitti.href = `https://www.google.com/maps/dir/?api=1&travelmode=driving&origin=${latitudeSijainti},${longitudeSijainti}&destination=${latitudeRata},${longitudeRata}`;
  }).catch(function(error) {
    console.log(error);
  });
}

function saaMyohemmin(latitude, longitude) {
  fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=metric&lang=fi&appid=d5f46b97c0d3618c2e85e2939ec55a4b`)
  .then(function(vastaus) {
    return vastaus.json();
  }).then(function(myohempiSaa) {
    console.log(myohempiSaa);
    saatiedotMyohemmin.innerHTML ='';
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
      <h2>Aika: ${myohempiSaa.list[j].dt_txt}</h2>`;
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

