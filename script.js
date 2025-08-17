// La dirección de tu archivo JSON
const jugadoresJSON = 'jugadores.json';

// Aquí obtendremos el div donde pondremos la lista de jugadores
const contenedorJugadores = document.getElementById('lista-jugadores');

// Función para obtener el ícono de la línea
function obtenerIconoLinea(linea) {
    switch (linea.toLowerCase()) {
        case 'bot':
            return '<i class="fas fa-arrow-down" title="Bot Lane"></i>';
        case 'jungla':
            return '<i class="fas fa-leaf" title="Jungle"></i>';
        case 'top':
            return '<i class="fas fa-arrow-up" title="Top Lane"></i>';
        case 'medio':
            return '<i class="fas fa-crosshairs" title="Mid Lane"></i>';
        case 'sup':
            return '<i class="fas fa-shield-alt" title="Support"></i>';
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
        // Por cada jugador que encontramos en la lista...
        jugadores.forEach(jugador => {
            // ...creamos un nuevo elemento para mostrar su información
            const jugadorDiv = document.createElement('div');
            jugadorDiv.classList.add('jugador');

            // Creamos los íconos para cada línea del jugador
            const lineasHTML = jugador.lineas.map(linea => obtenerIconoLinea(linea)).join('');

            // Y dentro de ese elemento, ponemos su nombre y sus líneas
            jugadorDiv.innerHTML = `
                <h3>${jugador.nombre}</h3>
                <p><strong>Líneas:</strong> ${lineasHTML}</p>
            `;

            // Finalmente, agregamos este nuevo elemento al contenedor en el HTML
            contenedorJugadores.appendChild(jugadorDiv);
        });
    })
    .catch(error => {
        console.error('Error al cargar los datos:', error);
        contenedorJugadores.innerHTML = '<p>Lo sentimos, no se pudo cargar la lista de jugadores. Por favor, revisa que el archivo jugadores.json exista y esté bien escrito.</p>';
    });