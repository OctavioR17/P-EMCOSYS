//P-EMCOSYS
//INTEGRANTES: Luis Feregrino, Octavio Rodriguez e Isaac Misael

document.getElementById('btn-on').addEventListener('click', () => {
    document.getElementById('screen-state').textContent = 'Encendida';
    document.getElementById('led1').textContent = 'Encendido';
    startBuzzer();

    document.getElementById('tft-message').textContent = 'Pantalla encendida';
    document.getElementById('tft-image').style.display = 'none';
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
    if (message.trim()) {
        document.getElementById('tft-message').textContent = message;
        document.getElementById('tft-image').style.display = 'none';
    } else {
        document.getElementById('tft-message').textContent = 'Mensaje vacío';
    }
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
    } else {
        alert("Por favor selecciona una imagen para mostrar.");
    }
});

// Registro de correos electrónicos
const emailList = [];

document.getElementById('register-email').addEventListener('click', () => {
    const emailInput = document.getElementById('email-input');
    const email = emailInput.value.trim();

    if (email && !emailList.includes(email)) {
        emailList.push(email);
        updateEmailList();
        emailInput.value = ''; // Limpiar el campo después de agregar el correo
    } else {
        alert("Introduce un correo válido o que no esté registrado.");
    }
});

function updateEmailList() {
    const emailUl = document.getElementById('emails');
    emailUl.innerHTML = '';

    emailList.forEach(email => {
        const li = document.createElement('li');
        li.textContent = email;
        emailUl.appendChild(li);
    });
}

// Envío de correo y registro de fecha/hora
document.getElementById('send-email').addEventListener('click', () => {
    if (emailList.length === 0) {
        alert("No hay correos registrados para enviar.");
        return;
    }

    const currentDate = new Date();
    const formattedDate = currentDate.toLocaleDateString();
    const formattedTime = currentDate.toLocaleTimeString();

    document.getElementById('timestamp').textContent = `${formattedDate} ${formattedTime}`;
    alert("Correo(s) enviado(s) con éxito.");
});