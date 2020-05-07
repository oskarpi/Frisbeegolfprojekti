'use strict';
/**
 @author Oskari Piiroinen
 */

/*
haetaan html elementit id:n mukaan muuttujiin.
 */
const kaupunki = document.getElementById('kaupunkinyt');
const saatila = document.getElementById('saatilanyt');
const lampotila = document.getElementById('lampotilanyt');
const tuuli = document.getElementById('tuulinyt');
const reitti = document.getElementById('reitti');
const saatiedotMyohemmin = document.getElementById('saatiedotmyohemmin');

//Api key syötetään Here Maps palveluun tässä. Here Maps vaati sisäänkirjautumisen, jotta saa avaimen.
const platform = new H.service.Platform({
  'apikey': '8p9FRYr_h6RIG1C7OlCpADhv1cGVXNQBlIfZA4pFihU'});

// Luodaan kartan overlay
const defaultLayers = platform.createDefaultLayers();

// Haetaan html sivulta id:n perusteella kartta ja luodaan siitä objekti. Kartassa määritetään sen keskusta, zoom ja pixelit.
const map = new H.Map(document.getElementById('map'),
    defaultLayers.vector.normal.map,{
      center: {lat:50, lng:5},
      zoom: 12,
      pixelRatio: window.devicePixelRatio || 1
    });

//luodaan objektit kartta Eventeille ja määritellään sen default behaviour
// tehdään muuttuja omansijainnin hakemiseen
// tehdään käyttöliittymä, jossa määritellään myös kartan kieli
const mapEvents = new H.mapevents.MapEvents(map);
const behavior = new H.mapevents.Behavior(mapEvents);
const geocoderService = platform.getGeocodingService();
const ui = H.ui.UI.createDefault(map, defaultLayers, 'fi-FI');

/*
haetaan nykyinen sijainti ja keskitetään kartta sen mukaan. Palautetaan latitude ja longitude arvot, jos paikannus onnistuu.
Arvot tallennetaan muuttujiin. Arvojen perusteella kartalle laitetaan marker youMarker objektilla.
Kun paikannus onnistuu kutsuttaan haeRadat funktiota, joka merkkaa radat kartalle. Samalla siirretään omat koordinaatit funktiolle.
Jos oman paikan paikannus ei onnistu tulostetaan virhe viesti konsoliin.
 */

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
          var myIcon = new H.map.Icon("data:image/png;base64,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");
          const youMarker = new H.map.Marker({lat:latitude, lng:longitude},{icon:myIcon});
          map.addObject(youMarker);
        },
        error => {
          console.error(error);
        }
    );
  });
}

/*
functiolla haeRadat haetaan discgolfmetrix API:sta Suomen frisbeegolfradat.
Ehtolauseella tarkastetaan onko rata lopetettu eli onko sillä Enddate arvoa sekä tarkastetaan onko radalla koordinaatteja.
Jos radalla ei ole koordinaatteja niin konsoliin tulostetaan "Ei merkattuja koordinaatteja".
Jos rata on lopetettu se ei näy kartalla. Radat merkataan pngIcon-muutujalle, jonka kuvaa voidaan vaihtaa.
For loopilla käydään radat läpi ja merkataan erillaisella markerilla.
rataMarkkeri objektille eli radan markkerille, määritellään radan nimi pop up kuplaan, kun markkeria painetaan.
Kun markkeria painetaan siirretään radan koordinaatit saaNyt ja saaMyohemmin funktioille.
haeRadat vastaanottaa käyttäjän koordinaatit ja lähettää eteenpäin saaNyt funktiolle.
 */

function haeRadat(lat, long) {
  console.log(lat);
  console.log(long);
  fetch(`https://discgolfmetrix.com/api.php?content=courses_list&country_code=FI`)
  .then(function(vastaus) {
    return(vastaus.json());
  }).then(function(radat){
    console.log(radat);

    var pngIcon = new H.map.Icon("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAaCAYAAACpSkzOAAACE0lEQVRIS7WW3XXaQBCFZyQVgDvAHSiMeI6pIHYHpoLYFSSpwKSCOBXEqcDkGY2sDpIOQgFIk3N1djlrgn6M7H3jAPebOzs/y/QKJ8uyCzN7VFUWkUsi+khEF056TURfuY+TpukkjuM7IromojKKouVmsynD/4nIIxGlqnomInZMsxeUZdmdmd0Ef95C0H/2bojoQVWvTnbkovVpaPSrqjory3Lr3DZuzGxZFMV9W4Z6HYnIN5c2r9E4CiFEtK2q6hzwk0HH7sjMJmaGAKYQ7nOD3/Q6StN0miTJFOLM/N7MUFUNwJ17VV32FVUnaDabXTMzIm87gyCdjlz1/OiAXKnqQ58T//1RR+5efhPRpE0IzTkU0uooSBmqCFGjWZ+dVwGJCFJ2ycxfXFV9eivQX9eY50mS3JjZm4Ewr/xIQec/mwwIYnTq/OxC2vI8/ywiKIqwb5osjgbN5/O0rusndHtd1+s4jgH674wGQREumBndjj3j7wcV6Mu9VNV3o8sbAs4Z7qcRRyoD6FpVF6NB7p5Q4h6yIqKf2KIvmW9hIPvuhjgRfTgcmsy8yvP8Npx7ZnZbFAXgg88eJCLonf0dMPOamb/7tR1Wn9s9fwZThqwJiIVuvMOXQFpnXShyMGDLqqoWXZu0LYDeCSwiT3gTYF1HUbQ4fAENddYJCt4LR59ZQyG9qcMLiJl/7Xa71SnpCgP5B6+zEZTEKBGrAAAAAElFTkSuQmCC");
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

/*
Funktiolla saaNyt haetaan nykyinen sää Openwathermap API:sta, johon piti tehdä tunnukset avaimen saadakseen.
Openwethermap API:sta käytettiin Current weather data APIa.
Funktio ottaa parametrikseen käyttäjänsijainnin sekä radan sijainnin jota klikataan.
Saatua dataa verrataan ehtolauseilla, onko Kaupungin nimeä.
Kartan alle tulostetaan tiettyihin tageihin, kaupunki, säätila, lämpötila,
tuulen nopeus sekä linkki Google Mapsiin(Näyttää reittiohjeet koordinaattien välille. Avautuu uuteen välilehteen).
Konsoliin tulee virheilmoitus, jos funktiossa tapahtuu virhe.
 */

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


/*
Funktio saaMyohemmin ottaa vastaan radan koordinaatit haeRadat funktiolta. Näyden koordinaattien mukaan haetaan yhden vuorokauden sää for loopilla.
Funktiossa käytetään Openwethermap API:sta 5 day / 3 hour forecast APIa. Se palauttaa sää ennusteen 3 tunnin välein.
 Jokaiselle tietopaketilla on oma div elementtinsä, jonka id:t alkaa 1 ja loppuu 9.
Säätietoihin tulostetaan päivämäärä/aika, sään kuvaus, lämpötila ja tuulennopeus. Jokaisella tiedolla on ehtolause, jos tietoa ei löydy.
Funktio tulostaa virhe viestin konsoliin, mikäi funktiossa tapahtuu virhe.
 */
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

