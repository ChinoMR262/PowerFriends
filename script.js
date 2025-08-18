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
    
    // Mapeo de roles a iconos de Font Awesome y descripciones
    const roleIcons = {
        'Adc': 'fa-crosshairs',
        'Jungla': 'fa-leaf',
        'Medio': 'fa-bolt',
        'Sup': 'fa-shield-alt',
        'Top': 'fa-mountain'
    };

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
                const iconClass = roleIcons[linea] || 'fa-question';
                return `<i class="fas ${iconClass} role-icon-small"></i>`;
            }).join(' ');

            jugadorCard.innerHTML = `
                <img src="https://placehold.co/150x150/FF69B4/FFFFFF?text=${jugador.nombre.charAt(0)}" alt="Avatar de ${jugador.nombre}" class="role-icon">
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

        const roleButtonsHtml = jugador.lineas.map(linea => {
            const iconClass = roleIcons[linea] || 'fa-question';
            const roleInfo = descripcionesRoles[linea] || { descripcion: 'No hay descripción disponible.', datoCurioso: '' };

            const button = document.createElement('button');
            button.classList.add('role-button');
            button.innerHTML = `<i class="fas ${iconClass}"></i> ${linea}`;
            
            // Añade un evento de clic al botón del rol para mostrar su descripción
            button.addEventListener('click', () => {
                const modalInfo = document.createElement('div');
                modalInfo.classList.add('modal-role-info');
                modalInfo.innerHTML = `
                    <h4>${linea}</h4>
                    <p><strong>Descripción:</strong> ${roleInfo.descripcion}</p>
                    <p><strong>Dato curioso:</strong> ${roleInfo.datoCurioso}</p>
                `;
                modalDetails.appendChild(modalInfo);
            });
            
            return button.outerHTML;
        }).join('');
        
        modalDetails.innerHTML = `
            <div class="modal-image-container">
                <img src="https://placehold.co/200x200/FF69B4/FFFFFF?text=${jugador.nombre.charAt(0)}" alt="Avatar de ${jugador.nombre}" class="modal-image">
            </div>
            <h3>${jugador.nombre}</h3>
            <p>Conocido por sus roles en:</p>
            <div class="modal-roles-container">
                ${roleButtonsHtml}
            </div>
        `;
        
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
