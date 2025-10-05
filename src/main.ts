import './style.css'


interface Character {
  id:number;
  name:string;
  image:string;
  ki:string;
  race:string
}

let page = 1;



//obtengo personajes
async function getCharacters(): Promise<Character[]> {
  try {
    const respone = await fetch(`https://dragonball-api.com/api/characters?page=${page}`);
    const data = await respone.json();
    return data.items;
  } catch (error) {
    console.error('Error al cargar personajes: ', error);
    return []
  }
}

//mostrar personajes
function displayCharacters(characters:Character[]){
  const container = document.getElementById('characters-container');

  if(!container) return;
  //Limpio contenedor
  container.innerHTML = '';

  //Cada personaje crea un div
  characters.forEach(character => {
    const characterDiv = document.createElement('div');
    characterDiv.innerHTML = `
    <h3>${character.name}</h3>
    <h3>${character.ki}</h3>
    <h3>${character.race}</h3>
    <img src="${character.image}"
    <h5>"poll"</h5>
    `;
    container.appendChild(characterDiv);
  });
}


const characters = await getCharacters();

displayCharacters(characters)

