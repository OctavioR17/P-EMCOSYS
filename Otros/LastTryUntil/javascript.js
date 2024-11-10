document.addEventListener("DOMContentLoaded", () => {
    const sendMessageButton = document.getElementById("send-message");
    const sendImageButton = document.getElementById("send-image");
    const emailList = [];
    const emailHistory = [];

    // Función para habilitar/deshabilitar botones de envío dependiendo del estado de la pantalla
    function updateSendButtons(isScreenOn) {
        sendMessageButton.disabled = !isScreenOn;
        sendImageButton.disabled = !isScreenOn;
    }

    // Encendido y apagado de la pantalla TFT
    document.getElementById("btn-on").addEventListener("click", () => {
        fetch("/turn_on_screen")
            .then(response => response.json())
            .then(data => {
                updateSendButtons(true); // Si la pantalla se encendió, habilitamos los botones
                document.getElementById("screen-state").textContent = "Encendida";
            });
    });

    document.getElementById("btn-off").addEventListener("click", () => {
        fetch("/turn_off_screen")
            .then(response => response.json())
            .then(data => {
                updateSendButtons(false); // Si la pantalla se apagó, deshabilitamos los botones
                document.getElementById("screen-state").textContent = "Apagada";
            });
    });

    // Enviar mensaje a la pantalla TFT
    sendMessageButton.addEventListener("click", () => {
        const message = document.getElementById("message-input").value.trim();
        if (message) {
            fetch(`/show_message?msg=${encodeURIComponent(message)}`)
                .then(response => response.json())
                .then(data => {
                    document.getElementById("tft-message").textContent = message || "Mensaje vacío";
                    document.getElementById("tft-image").style.display = "none";
                });
        }
    });

    // Enviar imagen a la pantalla TFT
    sendImageButton.addEventListener("click", () => {
        const imageInput = document.getElementById("image-input").files[0];
        if (imageInput) {
            const reader = new FileReader();
            reader.onload = function(e) {
                fetch(`/show_image?img=${encodeURIComponent(e.target.result)}`)
                    .then(response => response.json())
                    .then(data => {
                        document.getElementById("tft-image").src = e.target.result;
                        document.getElementById("tft-image").style.display = 'block';
                        document.getElementById("tft-message").textContent = '';
                    });
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

    // Enviar correos electrónicos
    document.getElementById('send-email').addEventListener("click", () => {
        if (emailList.length === 0) {
            alert("No hay correos registrados para enviar.");
            return;
        }

        // Enviar los correos electrónicos al backend (ESP32)
        fetch("/send_email", {
            method: 'POST',
            body: JSON.stringify({ emails: emailList }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            alert("Correo(s) enviado(s) con éxito.");
            emailHistory.unshift({ timestamp: new Date().toLocaleString(), recipients: emailList.length });
            if (emailHistory.length > 3) emailHistory.pop();
            updateEmailHistory();
        });
    });

    // Mostrar historial de envíos
    function updateEmailHistory() {
        const emailHistoryList = document.getElementById("email-history-list");
        emailHistoryList.innerHTML = emailHistory
            .map(entry => `<li>Enviado el: ${entry.timestamp} a ${entry.recipients} destinatarios</li>`)
            .join('');
    }
});
