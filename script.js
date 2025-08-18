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
            // Asegurarse de que 'jugadores.json' esté disponible en el mismo directorio.
            const response = await fetch('jugadores.json'); 
            if (!response.ok) {
                throw new Error(`Error al cargar el archivo JSON: ${response.statusText}`);
            }
            todosLosJugadores = await response.json();
            mostrarJugadores(); // Muestra los jugadores al cargar
        } catch (error) {
            console.error('Error:', error);
            // Muestra un mensaje de error en la página para el usuario
            listaJugadoresDiv.innerHTML = `<p class="error-message">Hubo un problema al cargar los datos. Por favor, inténtelo de nuevo más tarde.</p>`;
        }
    }

    /**
     * Muestra una tarjeta de jugador en el DOM.
     * @param {object} jugador - El objeto de datos del jugador.
     */
    function crearTarjetaJugador(jugador) {
        const card = document.createElement('div');
        card.classList.add('jugador-card');
        
        // Contenido HTML de la tarjeta
        card.innerHTML = `
            <h3>${jugador.nombre}</h3>
            <div class="roles">
                ${jugador.lineas.map(linea => `<span class="role-tag">${linea}</span>`).join('')}
            </div>
        `;
        
        // Añade el evento de clic para mostrar el modal con los detalles
        card.addEventListener('click', () => {
            mostrarModal(jugador);
        });
        
        return card;
    }

    /**
     * Filtra y muestra la lista de jugadores basándose en la búsqueda y el filtro de rol.
     */
    function mostrarJugadores() {
        const searchTerm = searchBar.value.toLowerCase();
        const selectedRole = roleFilter.value;

        // Filtra los jugadores según la barra de búsqueda y el rol seleccionado
        const jugadoresFiltrados = todosLosJugadores.filter(jugador => {
            const nombreCoincide = jugador.nombre.toLowerCase().includes(searchTerm);
            const rolCoincide = selectedRole === 'all' || jugador.lineas.includes(selectedRole);
            return nombreCoincide && rolCoincide;
        });

        // Limpia la lista actual antes de renderizar los nuevos jugadores
        listaJugadoresDiv.innerHTML = '';
        
        if (jugadoresFiltrados.length === 0) {
            listaJugadoresDiv.innerHTML = `<p class="no-results">No se encontraron jugadores que coincidan con la búsqueda.</p>`;
        } else {
            // Renderiza cada jugador filtrado en el DOM
            jugadoresFiltrados.forEach(jugador => {
                const card = crearTarjetaJugador(jugador);
                listaJugadoresDiv.appendChild(card);
            });
        }
    }

    /**
     * Muestra el modal con los detalles de un jugador específico.
     * @param {object} jugador - El objeto de datos del jugador a mostrar.
     */
    function mostrarModal(jugador) {
        // Limpia el contenido anterior del modal
        modalDetails.innerHTML = '';
        
        // Crea los elementos de la imagen y la descripción para el modal
        const imagenContainer = document.createElement('div');
        imagenContainer.classList.add('modal-image-container');
        // Usa una URL de imagen de un servicio de marcadores de posición
        // Reemplazar "placeholder" en el texto con el nombre del jugador si es necesario para una imagen más relevante
        imagenContainer.innerHTML = `<img src="https://placehold.co/200x200/ff69b4/fff?text=${jugador.nombre}" alt="Imagen de perfil de ${jugador.nombre}">`;
        
        const nombreJugador = document.createElement('h3');
        nombreJugador.textContent = jugador.nombre;

        // Renderiza la descripción para cada rol del jugador
        const descripcionesDiv = document.createElement('div');
        for (const linea in jugador.descripciones) {
            if (Object.prototype.hasOwnProperty.call(jugador.descripciones, linea)) {
                const descripcionHtml = `
                    <div class="role-description">
                        <h4>${linea}</h4>
                        <p>${jugador.descripciones[linea]}</p>
                    </div>
                `;
                descripcionesDiv.innerHTML += descripcionHtml;
            }
        }
        
        // Añade los elementos al modal
        modalDetails.appendChild(imagenContainer);
        modalDetails.appendChild(nombreJugador);
        modalDetails.appendChild(descripcionesDiv);
        
        // Hace el modal visible
        modalOverlay.classList.add('visible');
    }
    
    /**
     * Cierra el modal de detalles del jugador.
     */
    function cerrarModal() {
        modalOverlay.classList.remove('visible');
    }

    // --- Manejadores de eventos ---

    // Filtra la lista de jugadores cuando el usuario escribe en la barra de búsqueda
    searchBar.addEventListener('input', mostrarJugadores);

    // Filtra la lista de jugadores cuando se cambia la opción del filtro de rol
    roleFilter.addEventListener('change', mostrarJugadores);
    
    // Manejo del modo oscuro
    darkModeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        // Guarda la preferencia en el almacenamiento local
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

    // Cierra el modal al presionar la tecla 'Esc'
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('visible')) {
            cerrarModal();
        }
    });
    
    // Llama a la función de carga de datos para iniciar la aplicación
    cargarJugadores();
});
