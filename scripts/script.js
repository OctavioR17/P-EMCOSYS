//P-EMCOSYS
//INTEGRANTES: Luis Feregrino, Octavio Rodriguez e Isaac Misael

document.addEventListener("DOMContentLoaded", function () {
    // Limpiar campos al cargar la página
    document.getElementById("message-input").value = "";
    document.getElementById("image-input").value = "";

    // Referencias de los botones y estado de la pantalla
    const btnOn = document.getElementById("btn-on");
    const btnOff = document.getElementById("btn-off");
    const screenState = document.getElementById("screen-state");
    const sendMessageButton = document.getElementById("send-message");
    const sendImageButton = document.getElementById("send-image");

    // Función para verificar el estado de la pantalla
    function updateSendButtons() {
        const isScreenOn = screenState.textContent === "Encendida";
        sendMessageButton.disabled = !isScreenOn;
        sendImageButton.disabled = !isScreenOn;
    }

    // Actualizar botones al cargar la página
    updateSendButtons();

    // Escuchar cambios de encendido y apagado de pantalla
    btnOn.addEventListener("click", function () {
        screenState.textContent = "Encendida";
        updateSendButtons();
    });

    btnOff.addEventListener("click", function () {
        screenState.textContent = "Apagada";
        updateSendButtons();
        // Limpiar mensaje e imagen si se apaga la pantalla
        document.getElementById("tft-message").textContent = "Pantalla apagada";
        document.getElementById("tft-image").style.display = "none";
        document.getElementById("tft-image").src = "";
    });
});

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


document.addEventListener("DOMContentLoaded", function () {
    // Elementos de la interfaz
    const emailHistoryList = document.getElementById("email-history-list");
    const sendEmailButton = document.getElementById("send-email");
    const emailInput = document.getElementById("email-input");

    // Historial de envíos (máximo 3)
    let emailHistory = [];

    // Función para enviar correo (simulado)
    function sendEmail() {
        const email = emailInput.value;
        const recipients = document.querySelectorAll("#emails li").length; // Contar destinatarios registrados
        const timestamp = new Date().toLocaleString();

        // Guardar en el historial
        emailHistory.unshift({ timestamp, recipients });
        if (emailHistory.length > 3) emailHistory.pop(); // Limitar a 3 elementos

        // Actualizar la interfaz con el historial
        updateEmailHistory();

        // Limpiar el campo de entrada de correo
        emailInput.value = "";
    }

    // Función para actualizar la lista de historial en la interfaz
    function updateEmailHistory() {
        emailHistoryList.innerHTML = "";
        emailHistory.forEach(entry => {
            const listItem = document.createElement("li");
            listItem.textContent = `Enviado el: ${entry.timestamp} a ${entry.recipients} destinatarios`;
            emailHistoryList.appendChild(listItem);
        });
    }

    // Escuchar el evento de envío de correo
    sendEmailButton.addEventListener("click", sendEmail);
});
