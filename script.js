document.addEventListener('DOMContentLoaded', () => {
    // Definición de las constantes y variables del DOM
    const listaJugadoresDiv = document.getElementById('lista-jugadores');
    const searchBar = document.getElementById('search-bar');
    const roleFilter = document.getElementById('role-filter');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');

    // Elementos del modal
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <button class="close-button">&times;</button>
            <div class="modal-details"></div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    // Referencias a los elementos internos del modal
    const modalDetails = modalOverlay.querySelector('.modal-details');
    const closeModalButton = modalOverlay.querySelector('.close-button');

    // Almacenamiento de datos para los jugadores
    let todosLosJugadores = [];

    // --- Funciones de la aplicación ---

    /**
     * Carga los datos de los jugadores desde el archivo JSON.
     */
    async function cargarJugadores() {
        try {
            const response = await fetch('jugadores.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            todosLosJugadores = await response.json();
            mostrarJugadores(todosLosJugadores);
        } catch (error) {
            console.error('No se pudo cargar el archivo jugadores.json:', error);
            listaJugadoresDiv.innerHTML = '<p class="error-message">Hubo un problema al cargar los datos de los jugadores. Por favor, inténtalo de nuevo más tarde.</p>';
        }
    }
    
    /**
     * Filtra los jugadores según la barra de búsqueda y el filtro de roles.
     */
    function filtrarJugadores() {
        const searchText = searchBar.value.toLowerCase();
        const selectedRole = roleFilter.value;

        const jugadoresFiltrados = todosLosJugadores.filter(jugador => {
            const nombreCoincide = jugador.nombre.toLowerCase().includes(searchText);
            const rolCoincide = selectedRole === 'all' || jugador.lineas.includes(selectedRole);
            return nombreCoincide && rolCoincide;
        });

        mostrarJugadores(jugadoresFiltrados);
    }

    /**
     * Muestra las tarjetas de los jugadores en el DOM.
     * Ahora, cada tag de rol es clickeable para abrir el modal.
     * @param {Array} jugadores - Array de objetos de jugadores.
     */
    function mostrarJugadores(jugadores) {
        listaJugadoresDiv.innerHTML = ''; // Limpiar el contenedor
        if (jugadores.length === 0) {
            listaJugadoresDiv.innerHTML = '<p class="no-results-message">No se encontraron jugadores que coincidan con la búsqueda o filtro.</p>';
            return;
        }

        jugadores.forEach(jugador => {
            const card = document.createElement('div');
            card.classList.add('jugador-card');
            
            const rolesHtml = jugador.lineas.map(linea => `<span class="role-tag" data-role="${linea}">${linea}</span>`).join('');
            
            card.innerHTML = `
                <h3>${jugador.nombre}</h3>
                <div class="roles">${rolesHtml}</div>
            `;
            
            listaJugadoresDiv.appendChild(card);

            // Se añaden los event listeners a cada rol individual, no a la tarjeta completa.
            card.querySelectorAll('.role-tag').forEach(tag => {
                tag.addEventListener('click', (event) => {
                    event.stopPropagation(); // Evita que el clic se propague a la tarjeta padre
                    const selectedRole = tag.getAttribute('data-role');
                    mostrarModal(jugador, selectedRole);
                });
            });
        });
    }

    /**
     * Muestra el modal de perfil de jugador con la información de un jugador específico.
     * @param {Object} jugador - Objeto del jugador a mostrar.
     * @param {string} selectedRole - El rol específico que fue clickeado para mostrar su imagen.
     */
    function mostrarModal(jugador, selectedRole) {
        // Limpiar el contenido del modal
        modalDetails.innerHTML = '';

        // Contenedor de la imagen del rol clickeado
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('modal-image-container');
        
        // ** CORRECCIÓN: Usar la ruta de imagen proporcionada por el usuario **
        const roleImage = document.createElement('img');
        roleImage.src = `Icon/${selectedRole}.png`;
        roleImage.alt = `Imagen del rol ${selectedRole}`;

        imageContainer.appendChild(roleImage);
        
        // Título del modal
        const title = document.createElement('h3');
        title.textContent = jugador.nombre;

        // Descripciones de los roles
        const descriptions = document.createElement('div');
        Object.entries(jugador.descripciones).forEach(([role, description]) => {
            const roleDescription = document.createElement('div');
            roleDescription.classList.add('role-description');
            roleDescription.innerHTML = `<h4>${role}</h4><p>${description}</p>`;
            descriptions.appendChild(roleDescription);
        });

        modalDetails.appendChild(imageContainer);
        modalDetails.appendChild(title);
        modalDetails.appendChild(descriptions);
        
        // Mostrar el modal
        modalOverlay.classList.add('visible');
    }

    /**
     * Cierra el modal de perfil.
     */
    function cerrarModal() {
        modalOverlay.classList.remove('visible');
    }

    // --- Event Listeners ---

    // Escuchar cambios en la barra de búsqueda y el filtro de roles
    searchBar.addEventListener('input', filtrarJugadores);
    roleFilter.addEventListener('change', filtrarJugadores);

    // Manejo del modo oscuro
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        if (isDarkMode) {
            localStorage.setItem('theme', 'dark');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        } else {
            localStorage.setItem('theme', 'light');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    });

    // Carga la preferencia de modo oscuro del usuario al cargar la página
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Manejo de la música
    musicToggle.addEventListener('click', () => {
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-play"></i>';
        }
    });

    // Cierra el modal al hacer clic en el botón de cerrar
    closeModalButton.addEventListener('click', cerrarModal);

    // Cierra el modal al hacer clic fuera del contenido
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            cerrarModal();
        }
    });

    // Cierra el modal al presionar la tecla 'Esc'
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('visible')) {
            cerrarModal();
        }
    });

    // Cargar los jugadores al iniciar la aplicación
    cargarJugadores();
});
