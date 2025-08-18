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
    const modalRolesContainer = document.getElementById('modal-roles-container');
    const closeButton = modalOverlay.querySelector('.close-button');

    // Referencia al botón de modo oscuro
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    let currentFilter = {
        searchText: '',
        role: 'all'
    };

    let jugadores = []; // Se inicializa vacío, se llenará con los datos del JSON.

    // Mapeo de roles a nombres de archivo de imagen
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
        // Limpia los contenedores del modal antes de llenarlos
        modalImageContainer.innerHTML = '';
        modalRolesContainer.innerHTML = '';
        modalDescription.textContent = '';

        // Muestra el nombre del jugador en el título del modal
        modalTitle.textContent = jugador.nombre;

        // Crea y muestra la imagen del rol principal
        const mainRole = jugador.lineas[0];
        const imagePath = `Icon/${roleImages[mainRole]}`;
        const imageEl = document.createElement('img');
        imageEl.id = 'modal-image-main'; // Agrega un ID para una fácil referencia
        imageEl.classList.add('modal-image');
        imageEl.src = imagePath;
        imageEl.alt = `Icono de ${mainRole}`;
        modalImageContainer.appendChild(imageEl);

        // Crea los botones para cada rol del jugador
        jugador.lineas.forEach(rol => {
            const button = document.createElement('button');
            button.textContent = rol;
            button.classList.add('role-button');
            
            // Agrega un listener al botón para mostrar la descripción y cambiar la imagen
            button.addEventListener('click', () => {
                mostrarDescripcionYCambiarImagen(jugador, rol);
            });
            modalRolesContainer.appendChild(button);
        });

        // Muestra la descripción y la imagen del primer rol por defecto
        mostrarDescripcionYCambiarImagen(jugador, mainRole);

        // Añade la clase 'visible' para activar la transición de opacidad del CSS
        modalOverlay.classList.add('visible');
    }

    // Función para mostrar la descripción de un rol específico y cambiar la imagen
    function mostrarDescripcionYCambiarImagen(jugador, rol) {
        // Actualiza el texto de la descripción
        modalDescription.textContent = jugador.descripciones[rol];

        // Actualiza la imagen del modal
        const imageEl = document.getElementById('modal-image-main');
        imageEl.src = `Icon/${roleImages[rol]}`;
        imageEl.alt = `Icono de ${rol}`;

        // Remueve la clase 'active' de todos los botones de rol
        const allButtons = modalRolesContainer.querySelectorAll('.role-button');
        allButtons.forEach(button => {
            button.classList.remove('active-role');
        });

        // Encuentra y añade la clase 'active' al botón del rol seleccionado
        const activeButtons = modalRolesContainer.querySelectorAll('.role-button');
        activeButtons.forEach(button => {
            if (button.textContent === rol) {
                button.classList.add('active-role');
            }
        });
    }

    // Agrega el evento para cerrar el modal
    closeButton.addEventListener('click', () => {
        // Remueve la clase 'visible' para ocultar el modal
        modalOverlay.classList.remove('visible');
    });

    // Cierra el modal si se hace clic fuera del contenido
    modalOverlay.addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') {
            modalOverlay.classList.remove('visible');
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

    // Lógica para actualizar el año del copyright automáticamente
    const currentYear = new Date().getFullYear();
    const footerParagraph = document.querySelector('footer p');
    if (footerParagraph) {
        footerParagraph.textContent = `© ${currentYear} PowerFriends. Todos los derechos reservados.`;
    }
});
