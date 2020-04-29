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
  <div id="${i}"><input type="text" placeholder="Nimesi"></div>`;

  runko.innerHTML += sarake;

  let sarake1 = document.getElementById(i);

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

/*
laskin ei toimi vielä
function laskuri() {
  let pelaaja = document.querySelector('input')
  for (let x = 1; x <= 10; x++) {
    let toka = document.getElementById('pisteet')[x].value;
    console.log(toka);
   const pelaaja1 = `
    <p>${pelaaja}</p>`;

    runko.innerHTML += pelaaja1;

    var inputs = document.getElementsByTagName('input');
    for (var i = 0; i < inputs.length; i += 1) {
      let tulos = inputs[i].value;
      console.log(tulos);

  }
}

for (let k=1; k<=vaylat; k++){
  let tulos = document.querySelector('input').value;
  let kokonaistulos =0;
  kokonaistulos += tulos;
  console.log(kokonaistulos);
}
console.log(kokonaistulos);
runko.innerHTML += kokonaistulos;
*/
