// La dirección de tu archivo JSON
const jugadoresJSON = 'jugadores.json';

// Aquí obtenemos el div donde pondremos la lista de jugadores
const contenedorJugadores = document.getElementById('lista-jugadores');

// Obtenemos el botón para cambiar el modo oscuro
const darkModeToggle = document.getElementById('dark-mode-toggle');

// Objeto con descripciones de cada rol
const descripcionesRoles = {
    'Adc': 'El **Attack Damage Carry** (ADC) es el tirador del equipo. Se enfoca en infligir una gran cantidad de daño físico a distancia en las peleas de equipo. Su éxito depende de un buen posicionamiento y la protección de su equipo.',
    'Jungla': 'El **Jungla** es el jugador que se encarga de cazar monstruos neutrales en la jungla. Su principal función es ayudar a las líneas con gankeos, asegurar objetivos y controlar el mapa.',
    'Medio': 'El jugador del **carril central** (Mid) es la fuente principal de daño mágico o físico del equipo. Tiene una gran movilidad y puede influir en todas las líneas del mapa, ayudando a su jungla y a sus compañeros.',
    'Sup': 'El **Soporte** (Sup) protege a su ADC en la fase de líneas y al resto del equipo en las peleas. Es crucial para el control de visión del mapa y para iniciar o contrarrestar los ataques enemigos.',
    'Top': 'El jugador del **carril superior** (Top) es un especialista en duelos uno contra uno. Generalmente juega con tanques o luchadores, y su objetivo es dominar su línea para poder unirse a su equipo y ganar las peleas de equipo.'
};

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

// Función para obtener el ícono del rol usando imágenes PNG y un atributo de datos
function obtenerIconoRol(rol) {
    const roleName = rol.charAt(0).toUpperCase() + rol.slice(1).toLowerCase();
    return `<img src="Icon/${roleName}.png" alt="${rol}" class="role-icon" data-role="${rol}">`;
}

// Función para mostrar el modal con la descripción del rol
function mostrarModal(rol) {
    const descripcion = descripcionesRoles[rol] || 'Descripción no disponible.';
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
        <p>${descripcion}</p>
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

// Event listener para manejar los clics en los íconos de rol
document.addEventListener('click', (e) => {
    // Verificamos si el elemento clicado tiene la clase 'role-icon' y tiene el atributo 'data-role'
    if (e.target.classList.contains('role-icon') && e.target.dataset.role) {
        // Llamamos a la función para mostrar el modal con el rol correspondiente
        mostrarModal(e.target.dataset.role);
    }
});
