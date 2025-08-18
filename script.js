// La dirección de tu archivo JSON
const jugadoresJSON = 'jugadores.json';

// Aquí obtenemos los elementos del DOM
const contenedorJugadores = document.getElementById('lista-jugadores');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const searchBar = document.getElementById('search-bar');
const roleFilter = document.getElementById('role-filter');
const musicToggle = document.getElementById('music-toggle');
const backgroundMusic = document.getElementById('background-music');

// Almacenará la lista original de jugadores
let originalJugadoresData = [];

// Objeto con descripciones de cada rol
const descripcionesRoles = {
    'Adc': {
        descripcion: 'El **Attack Damage Carry** (ADC) es el tirador del equipo. Se enfoca en infligir una gran cantidad de daño físico a distancia en las peleas de equipo. Su éxito depende de un buen posicionamiento y la protección de su equipo.',
        datoCurioso: 'Los jugadores de ADC suelen tener el mayor daño total en las partidas, pero también son muy vulnerables a los ataques enemigos.'
    },
    'Jungla': {
        descripcion: 'El **Jungla** es el jugador que se encarga de cazar monstruos neutrales en la jungla. Su principal función es ayudar a las líneas con gankeos, asegurar objetivos y controlar el mapa.',
        datoCurioso: 'Un buen jungla es el cerebro del juego temprano, planificando las rutas de gankeo y prediciendo los movimientos del jungla rival.'
    },
    'Medio': {
        descripcion: 'El jugador del **carril central** (Mid) es la fuente principal de daño mágico o físico del equipo. Tiene una gran movilidad y puede influir en todas las líneas del mapa, ayudando a su jungla y a sus compañeros.',
        datoCurioso: 'Los jugadores de la línea media a menudo se consideran los carrys más importantes, ya que tienen la versatilidad de jugar con magos, asesinos y campeones de utilidad.'
    },
    'Sup': {
        descripcion: 'El **Soporte** (Sup) protege a su ADC en la fase de líneas y al resto del equipo en las peleas. Es crucial para el control de visión del mapa y para iniciar o contrarrestar los ataques enemigos.',
        datoCurioso: 'El rol de soporte no se trata solo de curar o proteger, también implica una gran toma de decisiones sobre cuándo y dónde iniciar peleas.'
    },
    'Top': {
        descripcion: 'El jugador del **carril superior** (Top) es un especialista en duelos uno contra uno. Generalmente juega con tanques o luchadores, y su objetivo es dominar su línea para poder unirse a su equipo y ganar las peleas de equipo.',
        datoCurioso: 'La línea superior es a menudo la más aislada del mapa, por lo que los jugadores de Top necesitan una gran habilidad individual y conciencia del mapa.'
    }
};

// Función para guardar y cargar la preferencia del modo oscuro
function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
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

// Función para generar un simple efecto de sonido de clic usando el Web Audio API
function playClickSound() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(440, audioContext.currentTime); // Frecuencia de la nota A4
    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.start(audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
    oscillator.stop(audioContext.currentTime + 0.1);
}

// Función para alternar la música de fondo
musicToggle.addEventListener('click', () => {
    if (backgroundMusic.paused) {
        backgroundMusic.play().catch(error => console.error("Error al reproducir la música:", error));
        musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
    } else {
        backgroundMusic.pause();
        musicToggle.innerHTML = '<i class="fas fa-play"></i>';
    }
});

// Función para obtener el ícono del rol
function obtenerIconoRol(rol) {
    const roleName = rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase();
    return `<img src="Icon/${roleName}.png" alt="${rol}" class="role-icon" data-role="${rol}">`;
}

// Función para mostrar el modal con la descripción del rol
function mostrarModal(rol) {
    playClickSound(); // Reproduce el sonido de clic
    
    const roleInfo = descripcionesRoles[rol];
    if (!roleInfo) {
        console.error('No se encontró información para el rol:', rol);
        return;
    }

    const roleName = rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase();
    
    // Creamos los elementos del modal
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    // Construimos el contenido del modal
    modalContent.innerHTML = `
        <button class="close-button">&times;</button>
        <img src="Icon/${roleName}.png" alt="${rol}" class="modal-icon-large">
        <h3>${rol}</h3>
        <p><strong>Descripción:</strong> ${roleInfo.descripcion}</p>
        <p><strong>Dato curioso:</strong> ${roleInfo.datoCurioso}</p>
    `;

    // Añadimos el contenido al overlay y el overlay al cuerpo del documento
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Funcionalidad para cerrar el modal
    const closeButton = modalContent.querySelector('.close-button');
    closeButton.addEventListener('click', () => {
        modalOverlay.remove();
    });

    // Cerrar el modal al hacer clic fuera del contenido
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            modalOverlay.remove();
        }
    });
}

// Función para mostrar los jugadores en el DOM
function displayPlayers(players) {
    contenedorJugadores.innerHTML = ''; // Limpia el contenedor
    if (players.length === 0) {
        contenedorJugadores.innerHTML = '<p class="no-results">No se encontraron jugadores que coincidan con los criterios de búsqueda.</p>';
        return;
    }

    players.forEach((jugador, index) => {
        const jugadorDiv = document.createElement('div');
        jugadorDiv.classList.add('jugador');
        jugadorDiv.style.animationDelay = `${0.05 * index}s`; // Para el efecto de aparición

        const lineasHTML = jugador.lineas.map(linea => obtenerIconoRol(linea)).join('');

        jugadorDiv.innerHTML = `
            <h3>${jugador.nombre}</h3>
            <p><strong>Roles:</strong> ${lineasHTML}</p>
        `;
        contenedorJugadores.appendChild(jugadorDiv);
    });
}

// Función para filtrar y buscar jugadores
function filterAndSearch() {
    const searchTerm = searchBar.value.toLowerCase();
    const selectedRole = roleFilter.value.toLowerCase();

    const filteredPlayers = originalJugadoresData.filter(jugador => {
        const matchesName = jugador.nombre.toLowerCase().includes(searchTerm);
        const matchesRole = selectedRole === 'all' || jugador.lineas.some(linea => linea.toLowerCase() === selectedRole);
        return matchesName && matchesRole;
    });

    displayPlayers(filteredPlayers);
}

// Event listeners para la barra de búsqueda y el filtro de rol
searchBar.addEventListener('input', filterAndSearch);
roleFilter.addEventListener('change', filterAndSearch);

// Event listener para manejar los clics en los íconos de rol
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('role-icon') && e.target.dataset.role) {
        mostrarModal(e.target.dataset.role);
    }
});

// Usamos la función 'fetch' para cargar el archivo JSON
fetch(jugadoresJSON)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(jugadores => {
        originalJugadoresData = jugadores; // Guarda los datos originales
        displayPlayers(originalJugadoresData); // Muestra todos los jugadores al inicio
    })
    .catch(error => {
        console.error('Error al cargar los datos:', error);
        contenedorJugadores.innerHTML = '<p>Lo sentimos, no se pudo cargar la lista de jugadores. Por favor, revisa que el archivo jugadores.json exista y esté bien escrito.</p>';
    });
