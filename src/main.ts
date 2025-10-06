import './style.css'
import { fromFetch } from 'rxjs/fetch';
import { switchMap, catchError,BehaviorSubject } from 'rxjs';
import { of } from 'rxjs';
import "tailwindcss";
interface Character {
  id: number;
  name: string;
  image: string;
  ki: string;
  race: string;
}

interface ApiResponse {
  items: Character[];
}

// BehaviorSubject para manejar el estado de la página
const page$ = new BehaviorSubject<number>(1);

function nextPage(n:number){
  page$.next(n)
}
(window as any).nextPage = nextPage;

// Observable para obtener personajes
const characters$ = page$.pipe(
  switchMap(page => 
    fromFetch(`https://dragonball-api.com/api/characters?page=${page}&limit=8`).pipe(
      switchMap(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error(`Error: ${response.status}`);
        }
      }),
      switchMap((data: ApiResponse) => of(data.items)),
      catchError(error => {
        console.error('Error al cargar personajes:', error);
        return of([] as Character[]);
      })
    )
  )
);

// Función para mostrar personajes
function displayCharacters(characters: Character[]) {
  const container = document.getElementById('characters-container');
  
  if (!container) return;
  
  // Limpio contenedor
  container.innerHTML = '';
  
  // Cada personaje crea un div
  characters.forEach(character => {
    const characterDiv = document.createElement('div');
    characterDiv.className = 'character-card';
    
    characterDiv.innerHTML = `
    <img src="${character.image}" alt="${character.name}">
      <h3>${character.name}</h3>
      <h3>${character.ki}</h3>
      <h3>${character.race}</h3>
    `;
    container.appendChild(characterDiv);
  });
}

// Suscripción al observable
characters$.subscribe({
  next: (characters) => displayCharacters(characters),
  error: (error) => console.error('Error en la suscripción:', error)
});

// Ejemplo de cómo cambiar de página
// page$.next(2); // Esto cargaría la página 2
