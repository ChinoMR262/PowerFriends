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
                throw new Error('No se pudo cargar el archivo jugadores.json');
            }
            todosLosJugadores = await response.json();
            mostrarJugadores(todosLosJugadores);
        } catch (error) {
            console.error('Error al cargar los datos:', error);
            // Muestra un mensaje amigable al usuario en caso de error
            listaJugadoresDiv.innerHTML = '<p class="no-results">Error al cargar los datos de los jugadores. Por favor, inténtalo de nuevo más tarde.</p>';
        }
    }

    /**
     * Renderiza la lista de jugadores en el DOM.
     * @param {Array<Object>} jugadores - El array de objetos de jugadores a mostrar.
     */
    function mostrarJugadores(jugadores) {
        listaJugadoresDiv.innerHTML = '';
        if (jugadores.length === 0) {
            listaJugadoresDiv.innerHTML = '<p class="no-results">No se encontraron jugadores que coincidan con la búsqueda o el filtro.</p>';
            return;
        }

        jugadores.forEach((jugador, index) => {
            const jugadorCard = document.createElement('div');
            jugadorCard.classList.add('jugador');
            jugadorCard.dataset.index = index;

            // Usa un placeholder si no hay URL de imagen o una imagen estática
            const imageUrl = `https://placehold.co/100x100/ff69b4/FFF?text=${jugador.nombre}`;

            const rolesHtml = jugador.lineas.map(linea => `
                <img src="assets/icons/${linea.toLowerCase()}.png" alt="${linea} icon" class="role-icon" title="${linea}">
            `).join('');

            jugadorCard.innerHTML = `
                <img src="${imageUrl}" alt="Avatar de ${jugador.nombre}" class="player-avatar">
                <h3>${jugador.nombre}</h3>
                <p>Roles: ${rolesHtml}</p>
            `;
            
            jugadorCard.addEventListener('click', () => mostrarModal(jugador, imageUrl));
            listaJugadoresDiv.appendChild(jugadorCard);
        });
    }

    /**
     * Muestra el modal con los detalles del jugador.
     * @param {Object} jugador - El objeto del jugador a mostrar.
     * @param {string} imageUrl - La URL de la imagen del jugador.
     */
    function mostrarModal(jugador, imageUrl) {
        // Genera los botones de roles y sus descripciones
        const rolesHtml = jugador.lineas.map(linea => `
            <button class="role-button" data-role="${linea}">
                <img src="assets/icons/${linea.toLowerCase()}.png" alt="${linea} icon" class="role-icon-small">
                ${linea}
            </button>
        `).join('');

        modalDetails.innerHTML = `
            <div class="modal-image-container">
                <img src="${imageUrl}" alt="Avatar de ${jugador.nombre}" class="modal-image">
            </div>
            <h3>${jugador.nombre}</h3>
            <p>${jugador.descripcion || 'Sin descripción disponible.'}</p>
            <div class="modal-roles-container">
                ${rolesHtml}
            </div>
            <div class="role-description-container">
                <h4>Detalles de Rol</h4>
                <p class="role-description-text">Haz clic en un rol para ver su descripción.</p>
            </div>
        `;

        // Añade el evento de clic a cada botón de rol
        const roleButtons = modalDetails.querySelectorAll('.role-button');
        const roleDescriptionText = modalDetails.querySelector('.role-description-text');
        
        roleButtons.forEach(button => {
            button.addEventListener('click', () => {
                const role = button.dataset.role;
                const description = jugador.descripciones[role];
                roleDescriptionText.textContent = description || 'Descripción no encontrada.';
            });
        });

        // Muestra el modal
        modalOverlay.classList.add('visible');
    }

    /**
     * Oculta el modal.
     */
    function cerrarModal() {
        modalOverlay.classList.remove('visible');
    }

    /**
     * Filtra los jugadores según el texto de búsqueda y el rol seleccionado.
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

    // --- Manejo de eventos ---

    // Manejo del filtro y la búsqueda
    searchBar.addEventListener('input', filtrarJugadores);
    roleFilter.addEventListener('change', filtrarJugadores);

    // Manejo del modo oscuro
    darkModeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-mode')) {
            document.body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
            darkModeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            document.body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
            darkModeToggle.innerHTML = '<i class="fas fa-sun"></i>';
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

    // Inicia la aplicación cargando los jugadores
    cargarJugadores();
});
