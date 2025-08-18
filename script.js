// Espera a que todo el contenido del DOM (Document Object Model) esté cargado.
document.addEventListener('DOMContentLoaded', () => {

    // --- Referencias a los elementos del DOM ---
    // Es crucial que estos elementos existan en tu archivo index.html
    const listaJugadoresDiv = document.getElementById('lista-jugadores');
    const searchBar = document.getElementById('search-bar');
    const roleFilter = document.getElementById('role-filter');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const musicToggle = document.getElementById('music-toggle');
    const backgroundMusic = document.getElementById('background-music');

    // --- Creación dinámica del modal ---
    // Este método es más robusto y garantiza que los elementos existan en el DOM
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');

    const modalContent = document.createElement('div');
    modalContent.classList.add('modal-content');

    const closeModalButton = document.createElement('button');
    closeModalButton.classList.add('close-button');
    closeModalButton.innerHTML = '&times;'; // Símbolo de "cerrar"

    const modalDetails = document.createElement('div');
    modalDetails.classList.add('modal-details');

    modalContent.appendChild(closeModalButton);
    modalContent.appendChild(modalDetails);
    modalOverlay.appendChild(modalContent);
    document.body.appendChild(modalOverlay);

    // Almacenamiento de los datos de los jugadores en una variable global
    let todosLosJugadores = [];

    // --- Funciones principales de la aplicación ---

    /**
     * Carga los datos de los jugadores desde el archivo JSON.
     */
    async function cargarJugadores() {
        try {
            console.log('Intentando cargar jugadores.json...');
            const response = await fetch('jugadores.json');
            
            if (!response.ok) {
                throw new Error(`Error HTTP: ${response.status}`);
            }
            
            const data = await response.json();
            todosLosJugadores = data;
            
            if (todosLosJugadores.length === 0) {
                console.warn('El archivo de jugadores se cargó, pero está vacío.');
                if (listaJugadoresDiv) {
                    listaJugadoresDiv.innerHTML = '<p class="no-results-message">El archivo de jugadores está vacío.</p>';
                }
                return;
            }
            
            console.log(`¡Jugadores cargados con éxito! Se encontraron ${todosLosJugadores.length} jugadores.`);
            mostrarJugadores(todosLosJugadores);
            
        } catch (error) {
            console.error('No se pudo cargar el archivo jugadores.json:', error);
            if (listaJugadoresDiv) {
                listaJugadoresDiv.innerHTML = '<p class="error-message">Hubo un problema al cargar los datos de los jugadores. Por favor, asegúrate de que el archivo jugadores.json existe y es accesible.</p>';
            }
        }
    }
    
    /**
     * Filtra los jugadores según la barra de búsqueda y el filtro de roles.
     */
    function filtrarJugadores() {
        if (!searchBar || !roleFilter) return; // Asegura que los elementos existan

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
     * @param {Array} jugadores - Array de objetos de jugadores.
     */
    function mostrarJugadores(jugadores) {
        if (!listaJugadoresDiv) return;

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

            // Añadir event listeners a cada rol para abrir el modal.
            card.querySelectorAll('.role-tag').forEach(tag => {
                tag.addEventListener('click', (event) => {
                    event.stopPropagation(); // Evita que el clic se propague
                    const selectedRole = tag.getAttribute('data-role');
                    mostrarModal(jugador, selectedRole);
                });
            });
        });
    }

    /**
     * Muestra el modal con la información detallada del jugador.
     * @param {Object} jugador - Objeto del jugador a mostrar.
     * @param {string} selectedRole - Rol clickeado para mostrar la imagen.
     */
    function mostrarModal(jugador, selectedRole) {
        if (!modalDetails || !modalOverlay) return;

        modalDetails.innerHTML = ''; // Limpiar contenido previo

        // Creación del contenedor de la imagen
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('modal-image-container');
        
        const roleImage = document.createElement('img');
        roleImage.src = `Icon/${selectedRole}.png`;
        roleImage.alt = `Imagen del rol ${selectedRole}`;
        
        // Manejo de error si la imagen no existe
        roleImage.onerror = () => {
            console.error(`Error al cargar la imagen: Icon/${selectedRole}.png`);
            // Usa una imagen de placeholder si no encuentra la original
            roleImage.src = `https://placehold.co/200x200/ff69b4/fff?text=${selectedRole.toUpperCase()}`;
        };

        imageContainer.appendChild(roleImage);
        
        // Título y descripciones
        const title = document.createElement('h3');
        title.textContent = jugador.nombre;

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
        
        modalOverlay.classList.add('visible');
    }

    /**
     * Cierra el modal de perfil.
     */
    function cerrarModal() {
        if (!modalOverlay) return;
        modalOverlay.classList.remove('visible');
    }

    // --- Event Listeners principales ---
    // Usamos el operador de "optional chaining" (?.) para evitar errores si un elemento no existe.
    searchBar?.addEventListener('input', filtrarJugadores);
    roleFilter?.addEventListener('change', filtrarJugadores);

    darkModeToggle?.addEventListener('click', () => {
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

    musicToggle?.addEventListener('click', () => {
        if (!backgroundMusic) return;
        if (backgroundMusic.paused) {
            backgroundMusic.play();
            musicToggle.innerHTML = '<i class="fas fa-pause"></i>';
        } else {
            backgroundMusic.pause();
            musicToggle.innerHTML = '<i class="fas fa-play"></i>';
        }
    });
    
    // Estos listeners están en los elementos creados dinámicamente, por lo que su referencia siempre será válida
    closeModalButton.addEventListener('click', cerrarModal);

    modalOverlay.addEventListener('click', (event) => {
        if (event.target === modalOverlay) {
            cerrarModal();
        }
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && modalOverlay.classList.contains('visible')) {
            cerrarModal();
        }
    });

    // Inicia la carga de datos al cargar la página
    cargarJugadores();
});
