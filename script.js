// La dirección de tu archivo JSON
const jugadoresJSON = 'jugadores.json';

// Aquí obtenemos el div donde pondremos la lista de jugadores
const contenedorJugadores = document.getElementById('lista-jugadores');

// Obtenemos el botón para cambiar el modo oscuro
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Función para guardar y cargar la preferencia del modo oscuro
function toggleDarkMode() {
    // Alterna la clase 'dark-mode' en el body
    document.body.classList.toggle('dark-mode');
    
    // Guarda la preferencia en el almacenamiento local del navegador
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Carga la preferencia guardada al iniciar la página
function loadDarkModePreference() {
    const isDarkMode = localStorage.getItem('darkMode') === 'true';
    if (isDarkMode) {
        document.body.classList.add('dark-mode');
    }
}

// Llama a la función de carga al iniciar la página
loadDarkModePreference();

// Añade un 'event listener' al botón para cambiar el modo oscuro al hacer clic
darkModeToggle.addEventListener('click', toggleDarkMode);

// Función para obtener el ícono del rol usando imágenes PNG
function obtenerIconoRol(rol) {
    const roleName = rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase(); // Asegura el formato de nombre del archivo, por ejemplo, "Adc" o "Top"
    return `<img src="Icon/${roleName}.png" alt="${rol}" class="role-icon">`;
}

// Usamos la función 'fetch' para cargar el archivo JSON
fetch(jugadoresJSON)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(jugadores => {
        // Por cada jugador que encontramos en la lista...
        jugadores.forEach(jugador => {
            // ...creamos un nuevo elemento para mostrar su información
            const jugadorDiv = document.createElement('div');
            jugadorDiv.classList.add('jugador');

            // Creamos los íconos para cada línea del jugador
            const lineasHTML = jugador.lineas.map(linea => obtenerIconoRol(linea)).join('');

            // Y dentro de ese elemento, ponemos su nombre y sus líneas
            jugadorDiv.innerHTML = `
                <h3>${jugador.nombre}</h3>
                <p><strong>Roles:</strong> ${lineasHTML}</p>
            `;

            // Finalmente, agregamos este nuevo elemento al contenedor en el HTML
            contenedorJugadores.appendChild(jugadorDiv);
        });
    })
    .catch(error => {
        console.error('Error al cargar los datos:', error);
        contenedorJugadores.innerHTML = '<p>Lo sentimos, no se pudo cargar la lista de jugadores. Por favor, revisa que el archivo jugadores.json exista y esté bien escrito.</p>';
    });

