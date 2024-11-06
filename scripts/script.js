//P-EMCOSYS
//INTEGRANTES: Luis Feregrino, Octavio Rodriguez e Isaac Misael

document.addEventListener("DOMContentLoaded", () => {
    const screenState = document.getElementById("screen-state");
    const sendMessageButton = document.getElementById("send-message");
    const sendImageButton = document.getElementById("send-image");
    const emailList = [];
    const emailHistory = [];

    // Inicializar campos y botones
    document.getElementById("message-input").value = "";
    document.getElementById("image-input").value = "";
    updateSendButtons();

    // Función para actualizar botones de envío según el estado de la pantalla
    function updateSendButtons() {
        const isScreenOn = screenState.textContent === "Encendida";
        sendMessageButton.disabled = !isScreenOn;
        sendImageButton.disabled = !isScreenOn;
    }

    // Encendido y apagado de pantalla
    document.getElementById("btn-on").addEventListener("click", () => toggleScreen(true));
    document.getElementById("btn-off").addEventListener("click", () => toggleScreen(false));

    function toggleScreen(isOn) {
        screenState.textContent = isOn ? "Encendida" : "Apagada";
        document.getElementById("led1").textContent = isOn ? "Encendido" : "Apagado";
        document.getElementById("led3").textContent = isOn ? "Apagado" : "Encendido";
        document.getElementById("tft-message").textContent = isOn ? "Pantalla encendida" : "Pantalla apagada";
        document.getElementById("tft-image").style.display = "none";
        isOn ? startBuzzer() : stopBuzzer();
        updateSendButtons();
    }

    // Función para manejar el buzzer y LED2
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

    // Envío de mensaje y carga de imagen
    sendMessageButton.addEventListener("click", () => {
        const message = document.getElementById("message-input").value.trim();
        document.getElementById("tft-message").textContent = message || "Mensaje vacío";
        document.getElementById("tft-image").style.display = "none";
    });

    sendImageButton.addEventListener("click", () => {
        const imageInput = document.getElementById("image-input").files[0];
        if (imageInput) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageElement = document.getElementById("tft-image");
                imageElement.src = e.target.result;
                imageElement.style.display = 'block';
                document.getElementById("tft-message").textContent = '';
            };
            reader.readAsDataURL(imageInput);
        } else {
            alert("Por favor selecciona una imagen para mostrar.");
        }
    });

    // Registro de correos electrónicos
    document.getElementById('register-email').addEventListener('click', () => {
        const email = document.getElementById("email-input").value.trim();
        if (email && !emailList.includes(email)) {
            emailList.push(email);
            updateEmailList();
            document.getElementById("email-input").value = '';
        } else {
            alert("Introduce un correo válido o que no esté registrado.");
        }
    });

    function updateEmailList() {
        const emailUl = document.getElementById('emails');
        emailUl.innerHTML = emailList.map(email => `<li>${email}</li>`).join('');
    }

    // Historial de envíos (máximo 3)
    const emailHistoryList = document.getElementById("email-history-list");
    document.getElementById('send-email').addEventListener("click", () => {
        if (emailList.length === 0) {
            alert("No hay correos registrados para enviar.");
            return;
        }

        const timestamp = new Date().toLocaleString();
        emailHistory.unshift({ timestamp, recipients: emailList.length });
        if (emailHistory.length > 3) emailHistory.pop();
        updateEmailHistory();
        alert("Correo(s) enviado(s) con éxito.");
    });

    function updateEmailHistory() {
        emailHistoryList.innerHTML = emailHistory
            .map(entry => `<li>Enviado el: ${entry.timestamp} a ${entry.recipients} destinatarios</li>`)
            .join('');
    }
});