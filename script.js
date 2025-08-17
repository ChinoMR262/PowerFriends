// La dirección de tu archivo JSON (debe estar en la misma carpeta)
const jugadoresJSON = 'jugadores.json';

// Aquí obtendremos el div donde pondremos la lista de jugadores
const contenedorJugadores = document.getElementById('lista-jugadores');

// Usamos la función 'fetch' para cargar el archivo JSON
fetch(jugadoresJSON)
    .then(response => response.json()) // Convertimos la respuesta a formato JSON
    .then(jugadores => {
        // Por cada jugador que encontramos en la lista...
        jugadores.forEach(jugador => {
            // ...creamos un nuevo elemento para mostrar su información
            const jugadorDiv = document.createElement('div');
            jugadorDiv.classList.add('jugador'); // Le agregamos una clase para poder darle estilo luego

            // Y dentro de ese elemento, ponemos su nombre y sus líneas
            jugadorDiv.innerHTML = `
                <h3>${jugador.nombre}</h3>
                <p><strong>Líneas:</strong> ${jugador.lineas.join(', ')}</p>
            `;

            // Finalmente, agregamos este nuevo elemento al contenedor en el HTML
            contenedorJugadores.appendChild(jugadorDiv);
        });
    })
    .catch(error => {
        console.error('Error al cargar los datos:', error);
        contenedorJugadores.innerHTML = '<p>Lo sentimos, no se pudo cargar la lista de jugadores.</p>';
    });