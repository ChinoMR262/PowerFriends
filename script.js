document.addEventListener('DOMContentLoaded', () => {
    // Definición de las constantes y variables del DOM para un acceso más rápido
    const listaJugadoresDiv = document.getElementById('lista-jugadores');
    const searchBar = document.getElementById('search-bar');
    const roleFilter = document.getElementById('role-filter');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');
    const modalOverlay = document.getElementById('modal-overlay');
    const modalContent = document.getElementById('modal-content');
    const closeModalButton = document.querySelector('.close-button');
    
    // Almacenamiento de datos para los jugadores
    let todosLosJugadores = [];
    
    // Mapeo de roles a iconos de Font Awesome
    const roleIcons = {
        'Adc': 'fa-crosshairs',
        'Jungla': 'fa-leaf',
        'Medio': 'fa-bolt',
        'Sup': 'fa-shield-alt',
        'Top': 'fa-mountain'
    };
    
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
            // Mostrar un mensaje de error en la UI si la carga falla
            listaJugadoresDiv.innerHTML = '<p class="no-results">Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.</p>';
        }
    }

    /**
     * Renderiza las tarjetas de jugadores en la página.
     * @param {Array<Object>} jugadores - La lista de jugadores a renderizar.
     */
    function renderizarJugadores(jugadores) {
        listaJugadoresDiv.innerHTML = ''; // Limpia la lista actual
        
        if (jugadores.length === 0) {
            listaJugadoresDiv.innerHTML = '<p class="no-results">No se encontraron jugadores que coincidan con los criterios de búsqueda.</p>';
            return;
        }

        jugadores.forEach(jugador => {
            const jugadorCard = document.createElement('div');
            jugadorCard.classList.add('jugador');
            
            // Crea un HTML dinámico para la tarjeta del jugador
            const iconHtml = jugador.lineas.map(linea => {
                const iconClass = roleIcons[linea] || 'fa-question'; // Icono por defecto si el rol no se encuentra
                return `<i class="fas ${iconClass} role-icon-small"></i>`;
            }).join(' ');

            jugadorCard.innerHTML = `
                <img src="https://placehold.co/150x150/FF69B4/FFFFFF?text=${jugador.nombre.charAt(0)}" alt="Avatar de ${jugador.nombre}" class="role-icon">
                <h3>${jugador.nombre}</h3>
                <p><strong>Roles:</strong> ${jugador.lineas.join(', ')}</p>
            `;
            
            // Añade un evento de clic para mostrar el modal con los detalles del jugador
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
     * Muestra el modal (pop-up) con la información detallada del jugador.
     * @param {Object} jugador - El objeto jugador a mostrar en el modal.
     */
    function mostrarModal(jugador) {
        // Genera los botones de rol dinámicamente
        const roleButtonsHtml = jugador.lineas.map(linea => {
            const iconClass = roleIcons[linea] || 'fa-question';
            return `<button class="role-button"><i class="fas ${iconClass}"></i> ${linea}</button>`;
        }).join('');
        
        // Rellena el contenido del modal
        modalContent.innerHTML = `
            <button class="close-button">&times;</button>
            <div class="modal-image-container">
                <img src="https://placehold.co/200x200/FF69B4/FFFFFF?text=${jugador.nombre.charAt(0)}" alt="Avatar de ${jugador.nombre}" class="modal-image">
            </div>
            <h3>${jugador.nombre}</h3>
            <p>Conocido por sus roles en:</p>
            <div class="modal-roles-container">
                ${roleButtonsHtml}
            </div>
        `;
        
        // Añade el evento para cerrar el modal al hacer clic en el botón
        modalContent.querySelector('.close-button').addEventListener('click', cerrarModal);

        modalOverlay.classList.add('visible'); // Muestra la capa de superposición
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
        // Guarda la preferencia del usuario en el almacenamiento local
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
