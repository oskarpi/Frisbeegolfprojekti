'use strict';

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
        let latitudeRata = radat.courses[i].X;
        let longitudeRata = radat.courses[i].Y;
        if(latitudeRata==="" || latitudeRata===0 || longitudeRata==="" || latitudeRata ===0){
          console.log('ei merkattuja koordinaatteja');
        }else {
        let rataMarker = new H.map.Marker({lat: latitudeRata, lng: longitudeRata },
                  {icon: pngIcon});
          map.addObject(rataMarker);
        }
    }
  }).catch(function(error) {
    console.log(error);
  })
}
haeRadat();