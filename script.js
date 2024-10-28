document.getElementById('btn-on').addEventListener('click', () => {
    // Encender Pantalla TFT
    document.getElementById('screen-state').textContent = 'Encendida';
    document.getElementById('led1').textContent = 'Encendido';
    
    // Iniciar buzzer cada 3 segundos
    let buzzerInterval = setInterval(() => {
        document.getElementById('buzzer-state').textContent = 'Sonando';
        document.getElementById('led2').textContent = 'Encendido';

        setTimeout(() => {
            document.getElementById('buzzer-state').textContent = 'Silencio';
        }, 1000);
    }, 3000);

    // Guardar el intervalo en un atributo para poder pararlo
    document.getElementById('btn-off').buzzerInterval = buzzerInterval;
});

document.getElementById('btn-off').addEventListener('click', () => {
    // Apagar Pantalla TFT
    document.getElementById('screen-state').textContent = 'Apagada';
    document.getElementById('led1').textContent = 'Apagado';
    document.getElementById('led2').textContent = 'Apagado';
    document.getElementById('buzzer-state').textContent = 'Silencio';
    document.getElementById('led3').textContent = 'Encendido';

    // Detener el buzzer
    clearInterval(document.getElementById('btn-off').buzzerInterval);
});
