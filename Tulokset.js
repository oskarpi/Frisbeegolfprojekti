'use strict';
const runko = document.querySelector('body');

let vaylat, pelaajat;

pelaajat = parseInt(prompt('Anna pelaajien lukumäärä (max 5)'));

while (pelaajat<0 || pelaajat>5){
  pelaajat = parseInt(prompt('Anna pelaajien lukumäärä (max 5)'));
}

vaylat = parseInt(prompt('Anna väylien lukumäärä (max 36)'));

while (vaylat<0 || vaylat>36){
  vaylat = parseInt(prompt('Anna väylien lukumäärä (max 36)'));
}

for (let i=1; i<=pelaajat; i++){
  const sarake =`
  <div id="pelaaja${i}"><input type="text" placeholder="Nimesi"></div>`;

  runko.innerHTML += sarake;

  let sarake1 = document.getElementById('pelaaja'+i);

  for (let j=1; j<=vaylat; j++){
    let pisteet =`
    <input id="pisteet" type="number" min="1" placeholder="väylän ${j} heitot">`;
    sarake1.innerHTML += pisteet;
  }
}

const nappi =`
  <button id="laskunappi">Laske tulokset</button>`;

runko.innerHTML += nappi;

const tulosnappi = document.getElementById('laskunappi');

tulosnappi.addEventListener('click', laskuri);



function laskuri() {
  for(let h=1; h<=pelaajat; h++){
    console.log(h);
    const pelaajadiv = document.getElementById('pelaaja'+h);
    console.log(pelaajadiv);
    let pisteElementit = pelaajadiv.querySelectorAll('input[type=number]');
    let pelaajaNimi = pelaajadiv.querySelector('input[type=text]').value;
    let pisteet = 0;
  for (let x = 0; x < pisteElementit.length; x++) {
    pisteet += +pisteElementit[x].value;
    }
  console.log(pelaajaNimi,pisteet);
  }
}
