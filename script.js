// Espera a que el DOM esté completamente cargado antes de ejecutar el script
document.addEventListener('DOMContentLoaded', () => {

    // Mapeo de roles a íconos SVG para mostrar en la interfaz
    const roleIcons = {
        "Top": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M576 176c0-26.5-21.5-48-48-48L464 0H288 112 48c-26.5 0-48 21.5-48 48L0 128H48 112 288 464l64-128H528c26.5 0 48-21.5 48-48zm-64 160H64c-35.3 0-64 28.7-64 64s28.7 64 64 64H512c35.3 0 64-28.7 64-64s-28.7-64-64-64zM64 352h448c17.7 0 32 14.3 32 32s-14.3 32-32 32H64c-17.7 0-32-14.3-32-32s14.3-32 32-32z"/></svg>`,
        "Jungla": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M495.9 166.4l-128-128c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L402.7 192l-114.7 114.7c-15.9 15.9-44.1 1.7-44.1-20.9V224c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32v-32.5c24.3-25.7 34.6-56.7 35.1-84.3c-28.7-1.1-57.9 9.3-80.1 31.5L78.6 363.4c-17.1 17.1-17.1 44.8 0 61.9l48 48c17.1 17.1 44.8 17.1 61.9 0L392.6 244.3c15.9-15.9 31.9-2.7 20.9-15.9l82.4-82.4c12.5-12.5 12.5-32.8 0-45.3zM100.3 388.3l-2.4 2.4c-3.1 3.1-4.7 7.2-4.7 11.3s1.6 8.2 4.7 11.3l48 48c6.2 6.2 16.4 6.2 22.6 0l2.4-2.4-70.6-70.6zm222.8-125.8c-26.6 26.6-69.8 26.6-96.5 0s-26.6-69.8 0-96.5s69.8-26.6 96.5 0s26.6 69.8 0 96.5zM224 224c0-17.7-14.3-32-32-32s-32 14.3-32 32v64c0 17.7 14.3 32 32 32s32-14.3 32-32v-64zM240 160c-26.5-0-48-21.5-48-48V64c0-26.5 21.5-48 48-48h64c26.5 0 48 21.5 48 48v48c0 26.5-21.5 48-48 48H240zM304 64c0-8.8-7.2-16-16-16H240c-8.8 0-16 7.2-16 16v48c0 8.8 7.2 16 16 16h64c8.8 0 16-7.2 16-16V64z"/></svg>`,
        "Medio": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M448 352c17.7 0 32 14.3 32 32s-14.3 32-32 32H192c-17.7 0-32-14.3-32-32s14.3-32 32-32H448zm-96-32V64c0-17.7-14.3-32-32-32s-32 14.3-32 32V320c0 17.7 14.3 32 32 32s32-14.3 32-32zM288 448c-17.7 0-32 14.3-32 32s14.3 32 32 32H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H288zm352-192c0 26.5-21.5 48-48 48H352c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48H592c26.5 0 48 21.5 48 48V256zM96 256c0-17.7 14.3-32 32-32s32 14.3 32 32v48c0 17.7-14.3 32-32 32s-32-14.3-32-32V256zm-96 0c0-26.5 21.5-48 48-48h48c26.5 0 48 21.5 48 48v48c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V256zm128-48c-26.5 0-48-21.5-48-48V48c0-26.5 21.5-48 48-48h48c26.5 0 48 21.5 48 48v160c0 26.5-21.5 48-48 48H128z"/></svg>`,
        "Adc": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M480 32c-35.3 0-64 28.7-64 64V208c0 8.8-7.2 16-16 16s-16-7.2-16-16V96c0-35.3-28.7-64-64-64s-64 28.7-64 64V208c0 8.8-7.2 16-16 16s-16-7.2-16-16V96c0-35.3-28.7-64-64-64S64 60.7 64 96V208c0 8.8-7.2 16-16 16s-16-7.2-16-16V96C32 43 75 0 128 0s96 43 96 96V224c0 35.3 28.7 64 64 64s64-28.7 64-64V96c0-35.3 28.7-64 64-64s64 28.7 64 64V224c0 35.3 28.7 64 64 64s64-28.7 64-64V96c0-35.3 28.7-64 64-64zM240 320c-13.2 0-24 10.8-24 24s10.8 24 24 24h32c13.2 0 24-10.8 24-24s-10.8-24-24-24H240zm240 0c-13.2 0-24 10.8-24 24s10.8 24 24 24h32c13.2 0 24-10.8 24-24s-10.8-24-24-24H480zM64 320c-13.2 0-24 10.8-24 24s10.8 24 24 24h32c13.2 0 24-10.8 24-24s-10.8-24-24-24H64zM224 400c-13.2 0-24 10.8-24 24s10.8 24 24 24h32c13.2 0 24-10.8 24-24s-10.8-24-24-24H224zm240 0c-13.2 0-24 10.8-24 24s10.8 24 24 24h32c13.2 0 24-10.8 24-24s-10.8-24-24-24H464zM48 400c-13.2 0-24 10.8-24 24s10.8 24 24 24h32c13.2 0 24-10.8 24-24s-10.8-24-24-24H48zM304 480c-13.2 0-24 10.8-24 24s10.8 24 24 24h32c13.2 0 24-10.8 24-24s-10.8-24-24-24H304zM240 480c-13.2 0-24 10.8-24 24s10.8 24 24 24h32c13.2 0 24-10.8 24-24s-10.8-24-24-24H240z"/></svg>`,
        "Sup": `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M448 32c17.7 0 32 14.3 32 32V256c0 17.7-14.3 32-32 32s-32-14.3-32-32V64c0-17.7 14.3-32 32-32zM288 32c-17.7 0-32 14.3-32 32V256c0 17.7 14.3 32 32 32s32-14.3 32-32V64c0-17.7-14.3-32-32-32zM32 32c17.7 0 32 14.3 32 32V256c0 17.7-14.3 32-32 32s-32-14.3-32-32V64c0-17.7 14.3-32 32-32zm480 32c0-17.7-14.3-32-32-32s-32 14.3-32 32V448c0 17.7 14.3 32 32 32s32-14.3 32-32V96zm-160 0c0-17.7-14.3-32-32-32s-32 14.3-32 32V448c0 17.7 14.3 32 32 32s32-14.3 32-32V96zM160 64c0-17.7-14.3-32-32-32s-32 14.3-32 32V448c0 17.7 14.3 32 32 32s32-14.3 32-32V64z"/></svg>`
    };

    // Referencias a los elementos del DOM
    const listaJugadoresEl = document.getElementById('lista-jugadores');
    const searchBar = document.getElementById('search-bar');
    const roleFilter = document.getElementById('role-filter');
    const modalOverlay = document.createElement('div');
    modalOverlay.classList.add('modal-overlay');
    document.body.appendChild(modalOverlay);

    // Referencia al botón de modo oscuro
    const darkModeToggle = document.getElementById('dark-mode-toggle');

    let currentFilter = {
        searchText: '',
        role: 'all'
    };

    let jugadores = []; // Se inicializa vacío, se llenará con los datos del JSON.
    
    // Función para renderizar los jugadores en la interfaz
    function renderizarJugadores(jugadoresFiltrados) {
        listaJugadoresEl.innerHTML = ''; // Limpia el contenedor
        if (jugadoresFiltrados.length === 0) {
            listaJugadoresEl.innerHTML = '<p class="no-results">No se encontraron jugadores que coincidan con la búsqueda.</p>';
        }
        jugadoresFiltrados.forEach(jugador => {
            const jugadorEl = document.createElement('div');
            jugadorEl.classList.add('jugador');
            
            // Crea un contenedor para los íconos de las líneas
            const iconContainer = document.createElement('div');
            iconContainer.classList.add('role-icons-container');
            jugador.lineas.forEach(linea => {
                const iconSpan = document.createElement('span');
                iconSpan.classList.add('role-icon');
                iconSpan.innerHTML = roleIcons[linea];
                iconContainer.appendChild(iconSpan);
            });

            jugadorEl.innerHTML = `
                <h3>${jugador.nombre}</h3>
                <p><strong>Roles:</strong></p>
            `;
            jugadorEl.appendChild(iconContainer);

            // Agrega un listener para mostrar la descripción al hacer clic
            jugadorEl.addEventListener('click', () => mostrarModal(jugador));
            listaJugadoresEl.appendChild(jugadorEl);
        });
    }

    // Función para mostrar el modal con los detalles del jugador
    function mostrarModal(jugador) {
        // Crea el HTML para los íconos de roles dentro del modal
        const iconsHtml = jugador.lineas.map(linea => {
            return `<div class="modal-icon-large">${roleIcons[linea]}</div>`;
        }).join('');

        modalOverlay.innerHTML = `
            <div class="modal-content">
                <button class="close-button">&times;</button>
                <div class="modal-icon-container">
                    ${iconsHtml}
                </div>
                <h3>${jugador.nombre}</h3>
                <p>Este jugador puede desempeñarse en los siguientes roles: ${jugador.lineas.join(', ')}.</p>
            </div>
        `;
        modalOverlay.style.display = 'flex';

        // Agrega el evento para cerrar el modal
        const closeButton = modalOverlay.querySelector('.close-button');
        closeButton.addEventListener('click', () => {
            modalOverlay.style.display = 'none';
        });

        // Cierra el modal si se hace clic fuera del contenido
        modalOverlay.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                modalOverlay.style.display = 'none';
            }
        });
    }

    // Función para filtrar y actualizar la lista de jugadores
    function filtrarJugadores() {
        const { searchText, role } = currentFilter;
        const jugadoresFiltrados = jugadores.filter(jugador => {
            const nombreCoincide = jugador.nombre.toLowerCase().includes(searchText.toLowerCase());
            // Ahora se verifica si el array de 'lineas' del jugador incluye el rol seleccionado
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
