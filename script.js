// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // Referencias a los elementos del DOM
    const listaJugadoresEl = document.getElementById('lista-jugadores');
    const searchBar = document.getElementById('search-bar');
    const roleFilter = document.getElementById('role-filter');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalImageContainer = document.getElementById('modal-image-container');
    const modalTitle = document.getElementById('modal-title');
    const modalDescription = document.getElementById('modal-description');
    const closeButton = modalOverlay.querySelector('.close-button');

    // Referencia al botón de modo oscuro
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    let currentFilter = {
        searchText: '',
        role: 'all'
    };

    let jugadores = []; // Se inicializa vacío, se llenará con los datos del JSON.

    // Mapeo de roles a nombres de archivo de imagen
    // Se ha corregido para que los íconos sean archivos .png
    const roleImages = {
        "Adc": "Adc.png",
        "Jungla": "Jungla.png",
        "Medio": "Medio.png",
        "Sup": "Sup.png",
        "Top": "Top.png"
    };
    
    // Función para renderizar los jugadores en la interfaz
    function renderizarJugadores(jugadoresFiltrados) {
        listaJugadoresEl.innerHTML = ''; // Limpia el contenedor
        if (jugadoresFiltrados.length === 0) {
            listaJugadoresEl.innerHTML = '<p class="no-results">No se encontraron jugadores que coincidan con la búsqueda.</p>';
        }
        jugadoresFiltrados.forEach(jugador => {
            const jugadorEl = document.createElement('div');
            jugadorEl.classList.add('jugador');
            
            // Crea un contenedor para la imagen principal del jugador (el primer rol)
            const mainRole = jugador.lineas[0];
            const imagePath = `Icon/${roleImages[mainRole]}`;
            const imageEl = document.createElement('img');
            imageEl.classList.add('role-icon');
            imageEl.src = imagePath;
            imageEl.alt = `Icono de ${mainRole}`;

            jugadorEl.appendChild(imageEl);

            jugadorEl.innerHTML += `
                <h3>${jugador.nombre}</h3>
                <p><strong>Roles:</strong> ${jugador.lineas.join(', ')}</p>
            `;

            // Agrega un listener para mostrar la descripción al hacer clic
            jugadorEl.addEventListener('click', () => mostrarModal(jugador));
            listaJugadoresEl.appendChild(jugadorEl);
        });
    }

    // Función para mostrar el modal con los detalles del jugador
    function mostrarModal(jugador) {
        const mainRole = jugador.lineas[0];
        const imagePath = `Icon/${roleImages[mainRole]}`;

        modalImageContainer.innerHTML = `<img class="modal-image" src="${imagePath}" alt="Icono de ${mainRole}">`;
        modalTitle.textContent = jugador.nombre;
        modalDescription.textContent = `Este jugador puede desempeñarse en los siguientes roles: ${jugador.lineas.join(', ')}.`;

        modalOverlay.style.display = 'flex';
    }

    // Agrega el evento para cerrar el modal
    closeButton.addEventListener('click', () => {
        modalOverlay.style.display = 'none';
    });

    // Cierra el modal si se hace clic fuera del contenido
    modalOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            modalOverlay.style.display = 'none';
        }
    });

    // Función para filtrar y actualizar la lista de jugadores
    function filtrarJugadores() {
        const { searchText, role } = currentFilter;
        const jugadoresFiltrados = jugadores.filter(jugador => {
            const nombreCoincide = jugador.nombre.toLowerCase().includes(searchText.toLowerCase());
            const rolCoincide = role === 'all' || jugador.lineas.includes(role);
            return nombreCoincide && rolCoincide;
        });
        renderizarJugadores(jugadoresFiltrados);
    }

    // Escucha eventos en la barra de búsqueda
    searchBar.addEventListener('input', (e) => {
        currentFilter.searchText = e.target.value;
        filtrarJugadores();
    });

    // Escucha eventos en el filtro de rol
    roleFilter.addEventListener('change', (e) => {
        currentFilter.role = e.target.value;
        filtrarJugadores();
    });

    // Escucha el evento de click del botón de modo oscuro
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Cambia el ícono del botón
        const isDarkMode = document.body.classList.contains('dark-mode');
        darkModeToggle.querySelector('i').className = isDarkMode ? 'fas fa-sun' : 'fas fa-moon';
    });

    // Lógica para cargar los datos desde el archivo JSON
    fetch('jugadores.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudo cargar el archivo jugadores.json');
            }
            return response.json();
        })
        .then(data => {
            jugadores = data; // Asigna los datos del JSON a la variable jugadores
            renderizarJugadores(jugadores); // Renderiza los jugadores una vez que los datos están cargados
        })
        .catch(error => {
            console.error('Error al cargar la lista de jugadores:', error);
            listaJugadoresEl.innerHTML = '<p class="error">Ocurrió un error al cargar los jugadores. Por favor, revisa que el archivo "jugadores.json" exista.</p>';
        });
});
