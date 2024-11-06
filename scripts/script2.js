// URL de tu ESP32, reemplaza con la IP de tu ESP32.
const ESP32_URL = "http://TU_IP_FIJA_DEL_ESP32"; 

// Encender pantalla
document.getElementById('btn-on').addEventListener('click', () => {
    fetch(`${ESP32_URL}/encenderPantalla`, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                document.getElementById('screen-state').textContent = 'Encendida';
                document.getElementById('led1').textContent = 'Encendido';
                startBuzzer();
                document.getElementById('tft-message').textContent = 'Pantalla encendida';
                document.getElementById('tft-image').style.display = 'none';
            } else {
                alert("Error al encender la pantalla");
            }
        });
});

// Apagar pantalla
document.getElementById('btn-off').addEventListener('click', () => {
    fetch(`${ESP32_URL}/apagarPantalla`, { method: 'POST' })
        .then(response => {
            if (response.ok) {
                document.getElementById('screen-state').textContent = 'Apagada';
                document.getElementById('led1').textContent = 'Apagado';
                document.getElementById('led2').textContent = 'Apagado';
                document.getElementById('led3').textContent = 'Encendido';
                stopBuzzer();
                document.getElementById('tft-message').textContent = 'Pantalla apagada';
                document.getElementById('tft-image').style.display = 'none';
            } else {
                alert("Error al apagar la pantalla");
            }
        });
});

// Enviar mensaje a la pantalla TFT
document.getElementById('send-message').addEventListener('click', () => {
    const message = document.getElementById('message-input').value.trim();
    if (message) {
        fetch(`${ESP32_URL}/mostrarMensaje`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mensaje: message })
        })
        .then(response => {
            if (response.ok) {
                document.getElementById('tft-message').textContent = message;
                document.getElementById('tft-image').style.display = 'none';
            } else {
                alert("Error al enviar el mensaje");
            }
        });
    } else {
        alert("Por favor escribe un mensaje.");
    }
});
