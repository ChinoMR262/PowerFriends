document.addEventListener('DOMContentLoaded', () => {
    // Definición de las constantes y variables del DOM
    const listaJugadoresDiv = document.getElementById('lista-jugadores');
    const searchBar = document.getElementById('search-bar');
    const roleFilter = document.getElementById('role-filter');
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    // Elementos del modal
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    // Se asegura de que el modal esté oculto al crearlo para evitar el problema de visualización
    modalOverlay.style.display = 'none'; 
    modalOverlay.innerHTML = `
        <div class="modal-content">
            <button class="close-button">&times;</button>
            <div class="modal-details"></div>
        </div>
    `;
    document.body.appendChild(modalOverlay);

    // Referencias a los elementos internos del modal
    const modalContent = modalOverlay.querySelector('.modal-content');
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
                throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
            }
            todosLosJugadores = await response.json();
            mostrarJugadores(todosLosJugadores);
        } catch (error) {
            console.error("Error en la carga de jugadores:", error);
            listaJugadoresDiv.innerHTML = '<p class="error-message">No se pudo cargar la lista de jugadores. Inténtalo de nuevo más tarde.</p>';
        }
    }

    /**
     * Muestra los jugadores en el DOM filtrados y buscados.
     * @param {Array<Object>} jugadores - El array de jugadores a mostrar.
     */
    function mostrarJugadores(jugadores) {
        listaJugadoresDiv.innerHTML = ''; // Limpia el contenido actual

        if (jugadores.length === 0) {
            listaJugadoresDiv.innerHTML = '<p class="no-results-message">No se encontraron jugadores que coincidan con la búsqueda.</p>';
            return;
        }

        jugadores.forEach(jugador => {
            const jugadorCard = document.createElement('div');
            jugadorCard.classList.add('jugador');

            const rolesHtml = jugador.lineas.map(rol => {
                const iconoRuta = obtenerRutaIcono(rol);
                return `<img src="${iconoRuta}" alt="Ícono de ${rol}" class="role-icon" title="${rol}">`;
            }).join('');

            jugadorCard.innerHTML = `
                <h3>${jugador.nombre}</h3>
                <div class="roles-container">
                    ${rolesHtml}
                </div>
            `;

            // Añade un evento de clic para abrir el modal
            jugadorCard.addEventListener('click', () => {
                abrirModal(jugador);
            });

            listaJugadoresDiv.appendChild(jugadorCard);
        });
    }

    /**
     * Abre el modal con los detalles de un jugador.
     * @param {Object} jugador - El objeto del jugador a mostrar en el modal.
     */
    function abrirModal(jugador) {
        const primerRol = jugador.lineas[0];
        const iconoRuta = obtenerRutaIcono(primerRol);
        modalDetails.innerHTML = `
            <h3>${jugador.nombre}</h3>
            <div class="modal-roles-container">
                ${jugador.lineas.map(rol => `<button class="role-button" data-role="${rol}">
                    <img src="${obtenerRutaIcono(rol)}" alt="Ícono de ${rol}" class="role-icon-small">
                    ${rol}
                </button>`).join('')}
            </div>
            <div class="role-description-container" id="desc-container">
                <div class="role-content">
                    <img src="${iconoRuta}" alt="Ícono de ${primerRol}" class="role-description-icon">
                    <h4>${primerRol}</h4>
                </div>
                <p>${jugador.descripciones[primerRol]}</p>
            </div>
        `;
        // Se añade la clase 'visible' para mostrar el modal
        modalOverlay.style.display = 'flex';
        modalOverlay.classList.add('visible');
    }
    
    /**
     * Cierra el modal de descripción.
     */
    function cerrarModal() {
        // Se elimina la clase 'visible' para ocultar el modal
        modalOverlay.classList.remove('visible');
        modalOverlay.style.display = 'none';
    }

    /**
     * Retorna la ruta de la imagen para un rol dado.
     * @param {string} rol - El nombre del rol.
     * @returns {string} - La ruta del archivo de imagen.
     */
    function obtenerRutaIcono(rol) {
        const iconos = {
            "Adc": "Icon/Adc.png",
            "Jungla": "Icon/Jungla.png",
            "Medio": "Icon/Medio.png",
            "Sup": "Icon/Sup.png",
            "Top": "Icon/Top.png"
        };
        // Retorna la ruta o una cadena vacía si no se encuentra
        return iconos[rol] || '';
    }

    // --- Lógica de la aplicación y manejo de eventos ---

    // Evento de búsqueda en la barra
    searchBar.addEventListener('input', (event) => {
        const searchTerm = event.target.value.toLowerCase();
        filtrarYMostrarJugadores(searchTerm, roleFilter.value);
    });

    // Evento de filtro por rol
    roleFilter.addEventListener('change', (event) => {
        const selectedRole = event.target.value;
        filtrarYMostrarJugadores(searchBar.value.toLowerCase(), selectedRole);
    });

    /**
     * Filtra los jugadores según la búsqueda y el rol seleccionado.
     * @param {string} searchTerm - El término de búsqueda.
     * @param {string} selectedRole - El rol seleccionado.
     */
    function filtrarYMostrarJugadores(searchTerm, selectedRole) {
        let jugadoresFiltrados = todosLosJugadores;

        if (selectedRole !== 'all') {
            jugadoresFiltrados = jugadoresFiltrados.filter(jugador => jugador.lineas.includes(selectedRole));
        }

        if (searchTerm) {
            jugadoresFiltrados = jugadoresFiltrados.filter(jugador => 
                jugador.nombre.toLowerCase().includes(searchTerm) ||
                jugador.lineas.some(linea => linea.toLowerCase().includes(searchTerm))
            );
        }

        mostrarJugadores(jugadoresFiltrados);
    }
    
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

    // Cierra el modal al hacer clic en el botón de cerrar
    closeModalButton.addEventListener('click', cerrarModal);

    // Cierra el modal al hacer clic fuera del contenido
    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            cerrarModal();
        }
    });

    // Detiene la propagación de clics dentro del modal para evitar que se cierre
    modalContent.addEventListener('click', (event) => {
        event.stopPropagation();
    });

    // Cierra el modal al presionar la tecla 'Esc'
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('visible')) {
            cerrarModal();
        }
    });

    // Delegación de eventos para los botones de rol dentro del modal
    modalDetails.addEventListener('click', (event) => {
        const roleButton = event.target.closest('.role-button');
        if (roleButton) {
            const role = roleButton.dataset.role;
            const jugadorNombre = modalDetails.querySelector('h3').textContent;
            const jugadorActual = todosLosJugadores.find(j => j.nombre === jugadorNombre);

            if (jugadorActual && jugadorActual.descripciones[role]) {
                const descContainer = document.getElementById('desc-container');
                const iconoRuta = obtenerRutaIcono(role);
                descContainer.innerHTML = `
                    <div class="role-content">
                        <img src="${iconoRuta}" alt="Ícono de ${role}" class="role-description-icon">
                        <h4>${role}</h4>
                    </div>
                    <p>${jugadorActual.descripciones[role]}</p>
                `;
            }
        }
    });

    // Inicia la carga de datos
    cargarJugadores();
});
