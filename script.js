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
                throw new Error(`Error HTTP: ${response.status}`);
            }
            todosLosJugadores = await response.json();
            filtrarYRenderizarJugadores(); // Renderiza la lista inicial
        } catch (error) {
            console.error('No se pudo cargar la lista de jugadores:', error);
            listaJugadoresDiv.innerHTML = '<p class="no-results">Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.</p>';
        }
    }

    /**
     * Renderiza las tarjetas de jugadores en la página.
     * @param {Array<Object>} jugadores - La lista de jugadores a renderizar.
     */
    function renderizarJugadores(jugadores) {
        listaJugadoresDiv.innerHTML = '';

        if (jugadores.length === 0) {
            listaJugadoresDiv.innerHTML = '<p class="no-results">No se encontraron jugadores que coincidan con los criterios de búsqueda.</p>';
            return;
        }

        jugadores.forEach((jugador, index) => {
            const jugadorCard = document.createElement('div');
            jugadorCard.classList.add('jugador');
            jugadorCard.style.animationDelay = `${0.05 * index}s`;

            const iconHtml = jugador.lineas.map(linea => {
                const roleName = linea.charAt(0).toUpperCase() + linea.slice(1).toLowerCase();
                return `<img src="Icon/${roleName}.png" alt="${linea}" class="role-icon" data-role="${linea}">`;
            }).join(' ');

            jugadorCard.innerHTML = `
                <img src="https://placehold.co/150x150/FF69B4/FFFFFF?text=${jugador.nombre.charAt(0)}" alt="Avatar de ${jugador.nombre}" class="player-avatar">
                <h3>${jugador.nombre}</h3>
                <p><strong>Roles:</strong> ${iconHtml}</p>
            `;

            jugadorCard.addEventListener('click', () => {
                mostrarModal(jugador);
            });

            listaJugadoresDiv.appendChild(jugadorCard);
        });
    }

    /**
     * Filtra y busca en la lista de jugadores basándose en la entrada del usuario.
     */
    function filtrarYRenderizarJugadores() {
        const searchTerm = searchBar.value.toLowerCase().trim();
        const selectedRole = roleFilter.value;

        const jugadoresFiltrados = todosLosJugadores.filter(jugador => {
            const nombreCoincide = jugador.nombre.toLowerCase().includes(searchTerm);
            const rolCoincide = selectedRole === 'all' || jugador.lineas.includes(selectedRole);
            return nombreCoincide && rolCoincide;
        });

        renderizarJugadores(jugadoresFiltrados);
    }

    /**
     * Muestra el modal con la información detallada del jugador.
     * @param {Object} jugador - El objeto jugador a mostrar en el modal.
     */
    function mostrarModal(jugador) {
        modalDetails.innerHTML = ''; // Limpia el contenido anterior

        // Contenido estático del modal
        const modalContentHtml = `
            <div class="modal-image-container">
                <img src="https://placehold.co/200x200/FF69B4/FFFFFF?text=${jugador.nombre.charAt(0)}" alt="Avatar de ${jugador.nombre}" class="modal-image">
            </div>
            <h3>${jugador.nombre}</h3>
            <p>Conocido por sus roles en:</p>
            <div class="modal-roles-container">
                ${jugador.lineas.map(linea => {
                    const roleName = linea.charAt(0).toUpperCase() + linea.slice(1).toLowerCase();
                    return `<button class="role-button" data-role="${linea}">
                                <img src="Icon/${roleName}.png" alt="${linea}" class="role-icon-small">
                                ${linea}
                            </button>`;
                }).join('')}
            </div>
        `;

        modalDetails.innerHTML = modalContentHtml;

        // Añadir el contenedor de descripción de rol
        const roleDescriptionContainer = document.createElement('div');
        roleDescriptionContainer.classList.add('role-description-container');
        modalDetails.appendChild(roleDescriptionContainer);

        // Añadir eventos de clic a los botones de rol dentro del modal
        modalDetails.querySelectorAll('.role-button').forEach(button => {
            button.addEventListener('click', () => {
                const selectedRole = button.dataset.role;
                const description = jugador.descripciones[selectedRole] || 'No hay descripción disponible para este rol.';
                roleDescriptionContainer.innerHTML = `
                    <h4>Descripción de ${selectedRole}:</h4>
                    <p>${description}</p>
                `;
            });
        });

        modalOverlay.classList.add('visible');
    }

    /**
     * Cierra el modal (pop-up).
     */
    function cerrarModal() {
        modalOverlay.classList.remove('visible');
    }

    // --- Configuración inicial y eventos de la página ---

    // Manejo de la búsqueda y el filtro
    searchBar.addEventListener('input', filtrarYRenderizarJugadores);
    roleFilter.addEventListener('change', filtrarYRenderizarJugadores);

    // Manejo del modo oscuro
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
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

    // Inicia la carga de los datos de los jugadores al iniciar la página
    cargarJugadores();
});
