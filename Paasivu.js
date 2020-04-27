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

