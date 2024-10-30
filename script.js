//P-EMCOSYS
//INTEGRANTES: Luis Feregrino, Octavio Rodriguez e Isaac Misael

document.getElementById('btn-on').addEventListener('click', () => {
    document.getElementById('screen-state').textContent = 'Encendida';
    document.getElementById('led1').textContent = 'Encendido';
    startBuzzer();

    document.getElementById('tft-message').textContent = 'Pantalla encendida';
});

document.getElementById('btn-off').addEventListener('click', () => {
    document.getElementById('screen-state').textContent = 'Apagada';
    document.getElementById('led1').textContent = 'Apagado';
    document.getElementById('led2').textContent = 'Apagado';
    document.getElementById('led3').textContent = 'Encendido';
    stopBuzzer();

    document.getElementById('tft-message').textContent = 'Pantalla apagada';
    document.getElementById('tft-image').style.display = 'none';
});

let buzzerInterval;
function startBuzzer() {
    buzzerInterval = setInterval(() => {
        document.getElementById('buzzer-state').textContent = 'Sonando';
        document.getElementById('led2').textContent = 'Encendido';

        setTimeout(() => {
            document.getElementById('buzzer-state').textContent = 'Silencio';
            document.getElementById('led2').textContent = 'Apagado';
        }, 500);
    }, 3000);
}

function stopBuzzer() {
    clearInterval(buzzerInterval);
    document.getElementById('buzzer-state').textContent = 'Silencio';
}

document.getElementById('send-message').addEventListener('click', () => {
    const message = document.getElementById('message-input').value;
    document.getElementById('tft-message').textContent = message || 'Mensaje vacío';
    document.getElementById('tft-image').style.display = 'none';
});

document.getElementById('send-image').addEventListener('click', () => {
    const imageInput = document.getElementById('image-input').files[0];
    if (imageInput) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const imageElement = document.getElementById('tft-image');
            imageElement.src = e.target.result;
            imageElement.style.width = "128px";
            imageElement.style.height = "128px";
            imageElement.style.display = 'block';
            document.getElementById('tft-message').textContent = '';
        };
        reader.readAsDataURL(imageInput);
    }
});
