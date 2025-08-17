// La dirección de tu archivo JSON
const jugadoresJSON = 'jugadores.json';

// Aquí obtendremos el div donde pondremos la lista de jugadores
const contenedorJugadores = document.getElementById('lista-jugadores');

// Función para obtener el ícono del rol
function obtenerIconoRol(rol) {
    switch (rol.toLowerCase()) {
        case 'jungla':
            return '<i class="ri-forest-fill" title="Jungla"></i>';
        case 'tirador':
        case 'bot': // Para los que aún usan "Bot"
            return '<i class="ri-crosshair-line" title="Tirador"></i>';
        case 'mago':
        case 'medio': // Para los que aún usan "Medio"
            return '<i class="ri-magic-line" title="Mago"></i>';
        case 'sup':
            return '<i class="ri-hand-heart-line" title="Soporte"></i>';
        case 'tanque':
        case 'top': // Para los que aún usan "Top"
            return '<i class="ri-shield-line" title="Tanque"></i>';
        default:
            return '';
    }
}

// Usamos la función 'fetch' para cargar el archivo JSON
fetch(jugadoresJSON)
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(jugadores => {
        jugadores.forEach(jugador => {
            const jugadorDiv = document.createElement('div');
            jugadorDiv.classList.add('jugador');

            const lineasHTML = jugador.lineas.map(linea => obtenerIconoRol(linea)).join('');

            jugadorDiv.innerHTML = `
                <h3>${jugador.nombre}</h3>
                <p><strong>Roles:</strong> ${lineasHTML}</p>
            `;

            contenedorJugadores.appendChild(jugadorDiv);
        });
    })
    .catch(error => {
        console.error('Error al cargar los datos:', error);
        contenedorJugadores.innerHTML = '<p>Lo sentimos, no se pudo cargar la lista de jugadores.</p>';
    });