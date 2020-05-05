'use strict';
/**
@author Oskari Piiroinen
 */
// Tehdään muuttuja body tagille.

const tuloskortti = document.querySelector('.flexbox');
const tulokset = document.getElementById('tulokset');
//tehdään muuttujat vaylat ja pelaajat.
let vaylat, pelaajat;

//kysytään käyttäjältä pelaajien lukumäärä.
pelaajat = parseInt(prompt('Anna pelaajien lukumäärä (max 5)'));

//Jos käyttäjän syöte on suurempi kuin 5 tai pienempi kuin yksi, kysytään käyttäjältä pelaajien lukumäärä uudestaan.
while (pelaajat<1 || pelaajat>5){
  pelaajat = parseInt(prompt('Anna pelaajien lukumäärä (max 5)'));
}

//kysytään käyttäjältä väylien lukumäärä
vaylat = parseInt(prompt('Anna väylien lukumäärä (max 36)'));
//Jos käyttäjän syöte on pienempi kuin yksi tai suurempi kuin 36, kysytään käyttäjältä väylien lukumäärä uudelleen.
while (vaylat<1 || vaylat>36){
  vaylat = parseInt(prompt('Anna väylien lukumäärä (max 36)'));
}

/*
For loop, joka tekee div tagin, jonka id on pelaaja + iteraattori. Ensimmäinen loop tekee pelaajille Nimi kentät, ja jälkimmäinen väylien verran tekstikenttiä.
Jokaista väylää varten tulee tekstikenttä, jonka id on pisteet. Pisteiden tekstikentät ovat minimissään 1 ja ottavat vastaan numeroita.
 */
for (let i=1; i<=pelaajat; i++){
  const sarake =`
  <div id="pelaaja${i}"><input type="text" placeholder="Nimesi"></div>`;

  tuloskortti.innerHTML += sarake;

  let sarake1 = document.getElementById('pelaaja'+i);

  for (let j=1; j<=vaylat; j++){
    let pisteet =`
    <input id="pisteet" type="number" min="1" placeholder="väylän ${j} heitot">`;
    sarake1.innerHTML += pisteet;
  }
}
//luodaan nappi, jonka id on laskunappi ja liitetään runkoon eli bodyyn.
const nappi =`
  <button id="laskunappi">Laske tulokset</button>`;

tuloskortti.innerHTML += nappi;

//valitaan laskunappi muuttujaan tulosnappi ja lisätään 'click' kuuntelu. Kun nappia åainetaan kutsutaan laskuri funktiota.
const tulosnappi = document.getElementById('laskunappi');

tulosnappi.addEventListener('click', laskuri);


/*
Funktiota laskuri kustutaan, kun nappia painetaan. Funktion alussa tyhennetään edelliset tulokset.. Laskurissa on kaksi for looppia. Ulommaisessa loopissa valitaan pelaajadiv muuttujaan pelaaja+ iteraattori elementit.
PisteElementit muuttuja valitsee kaikki pelaajadiv muuttujan input kentät, jonka arvot ovat numeroita. PelaajaNimi muuttuja ottaa arvokseen pelaajadiv muuttujan input kentät, joiden tyyppi on tekstiä.
Tulokset muuttujaan valitaan tulokset id:n elementti. Alustetaan pisteet muuttuja nollaksi. Sisempi for loop käy läpi tietyn pelaajan tekstikentät, joissa on numero tyyppisiä arvoja.
Arvot lisätään pisteet muuttujaan. Lopuksi pelaajan nimi ja pisteet tulostetaan sivulle.
 */
function laskuri() {
  tulokset.innerHTML = '';
  for(let h=1; h<=pelaajat; h++){
    const pelaajadiv = document.getElementById('pelaaja'+h);
    let pisteElementit = pelaajadiv.querySelectorAll('input[type=number]');
    let pelaajaNimi = pelaajadiv.querySelector('input[type=text]').value;


    let pisteet = 0;

    for (let x = 0; x < pisteElementit.length; x++) {
    pisteet += +pisteElementit[x].value;

    }

  console.log(pelaajaNimi,pisteet);
    tulokset.innerHTML +=pelaajaNimi +' '+ pisteet + '<br/>';

  }
}
