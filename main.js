const off = 24;
window.onload = setup();

var offset = 0;
const colors = {
	grass: "#78bf60",
	poison: "#c978ff",
	fire: "#ff815e",
	flying: "#fffef5",
	water: "#94c2ff",
	bug: "#e4fc9a",
	normal: "#d3e3f2",
	electric: "#ffd64f",
	ground: "#d4a770",
	fighting: "#e33d3d",
	psychic: "#de5db5",
	rock: "#f0e09c",
	fairy: "#ffdee5",
	steel: "#e3e8e8",
	ice: "#e8feff",
	ghost: "#dbbaff",
	dragon: "#c4bdff"
};

const pokedex = document.querySelector(".pokedex");

function offsetNext(){
  if(offset==0) document.getElementById('prev').classList.remove('hide');
  offset += off;
  setup();
}
function offsetPrev(){
  if(offset>0){
    offset -= off;
    setup();
  }
  if(offset == 0) document.getElementById('prev').classList.add('hide');
}

async function pokeInfo(){
  let promises = [];
  let allJsons = [];
  const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit='+off+'&offset='+offset);
  const json = await response.json();
  json.results.forEach(element => {
    promises.push(fetch(element.url))
  });
  const responses = Promise.all(promises);
  (await responses).forEach((element) => {
    allJsons.push(element.json())
  });

  return Promise.all(allJsons);
}

function setup(){
  pokeInfo().then((jsons) => {
    pokedex.innerHTML = ""; //se selecciona el div donde se renderizarán los pokemon
    jsons.forEach((json, index) => {
      const pokemonName = json.name;
      const pokemonTypes = []; //Cada pokemon puede ser de 1 o dos tipos.
      json.types.forEach((item) => { 
        pokemonTypes.push(item.type.name);
      });

      //Aquí se construye cada uno de los pokemon

      if(pokemonTypes[1]){
        pokedex.innerHTML += `
          <div id="${pokemonName.toUpperCase()}" class="poke-card">
            <img class="poke-img" src="https://pokeres.bastionbot.org/images/pokemon/${index + 1 + offset}.png" alt="pokemon ${index+1+offset}">
            <div class="circle"></div>
            <h5 class="poke-number">#${index+1+offset}</h5>
            <h3 class="poke-name">${pokemonName.toUpperCase()}</h3>
            <div class="type-container">
              <h5 class="type-text">TIPO: </h5>
              <img class="poke-type" src="img/Icon_${pokemonTypes[0]}.png"></img>
              <img id="secondType" class="poke-type" src="img/Icon_${pokemonTypes[1]}.png"></img>
            </div>
          </div>
        `;
      }

      else{
        pokedex.innerHTML += `
          <div id="${pokemonName.toUpperCase()}" class="poke-card">
            <img class="poke-img" src="https://pokeres.bastionbot.org/images/pokemon/${index + 1 + offset}.png" alt="pokemon ${index+1+offset}">
            <div class="circle"></div>
            <h5 class="poke-number">#${index+1+offset}</h5>
            <h3 class="poke-name">${pokemonName.toUpperCase()}</h3>
            <div class="type-container">
              <h5 class="type-text">TIPO: </h5>
              <img class="poke-type" src="img/Icon_${pokemonTypes[0]}.png"></img>
            </div>
          </div>
        `;
      }

      //pokemon card color
      const pokemonCards = document.querySelectorAll(".poke-card");
      const pokemonCard = pokemonCards[pokemonCards.length - 1];
      if (pokemonTypes[1]) {
        pokemonCard.style.background =
          "linear-gradient(120deg," +colors[json.types[0].type.name]+" 40%,"+colors[json.types[1].type.name]+" 60%)";
      } 
      else {
        pokemonCard.style.background = colors[pokemonTypes[0]];
      }
    });
  });
}


function searchPokemon(){
  var input, filter, cards, pokedex, names = [], i;
  input = document.getElementById("search-input");
  filter = input.value.toUpperCase();
  pokedex = document.getElementsByClassName("pokedex");
  cards = document.getElementsByClassName("poke-card");
  console.log(filter)
  for(i=0; i<cards.length; i++){
    names.push(cards[i].id);
    if (names[i].indexOf(filter) > -1) {
      cards[i].style.display = "";
    } else {
      cards[i].style.display = "none";
    }
  }
}