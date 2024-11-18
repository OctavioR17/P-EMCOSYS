/*
--------------------------------------------------------------------
Proyecto Integral: P-EMCOSYS (Potro - EMergency COmmunication SYstem)
Integrantes del equipo:
    1. Luis Garcia
    2. Octavio Rodriguez
    3. Isaac Vazquez
 --------------------------------------------------------------------
Este programa es la lógica del proyecto lo que permite la manipulación
de la página HTML y además realiza la conexión con los componentes físicos
----------------------------------------------------------------------
*/

document.addEventListener("DOMContentLoaded", () => {
    const screenState = document.getElementById("tft");
    const sendMessageButton = document.getElementById("send-message");
    const sendImageButton = document.getElementById("send-image");

    const emailHistory = [];
    const emailList = [];
    const esp_ip = "";

    let emailMessage = '';
    let emailImage = null;

    // INICIALIZAR CAMPOS Y BOTONES
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

        document.getElementById("btn-on").addEventListener("click", () => toggleled1(true));
        document.getElementById("btn-off").addEventListener("click", () => toggleled1(false));
        document.getElementById("btn-on").addEventListener("click", () => toggleled2(true));
        document.getElementById("btn-off").addEventListener("click", () => toggleled2(false));
        document.getElementById("btn-on").addEventListener("click", () => toggleled3(true));
        document.getElementById("btn-off").addEventListener("click", () => toggleled3(false));
        document.getElementById("btn-on").addEventListener("click", () => togglebuzzer(true));
        document.getElementById("btn-off").addEventListener("click", () => togglebuzzer(false));
        document.getElementById("btn-on").addEventListener("click", () => toggletft(true));
        document.getElementById("btn-off").addEventListener("click", () => toggletft(false));
        
        document.getElementById("tft-message").textContent = isOn ? "Encendida" : "Apagada";
        document.getElementById("tft-image").style.display = "none";

        //document.getElementById("tft").textContent = isOn ? "Apagada" : "Encendida";
        updateSendButtons();
        updateled1s();
        updateled2s();
        updateled3s();
        updatebuzzers();
        updatetfts();
    }

    // --------------------FUNCIONES PARA ACTUALIZAR ESTADO DE LED 1--------------------
    function updateled1s() {
        fetch(`http://${esp_ip}/led1/state`)
            .then(response => response.text())
            .then(state => {
                const isOn = state === "true";
                document.getElementById("led1").textContent = isOn ? "Encendido" : "Apagado";
            })
            .catch(error => console.error("Error al obtener el estado de led1:", error));
    }

    function toggleled1(isOn) {
        const endpoint = isOn ? "/led1/on" : "/led1/off";
        fetch(`http://${esp_ip}${endpoint}`, { method: "POST" })
            .then(response => {
                if (response.ok) {
                    console.log(`led1 ${isOn ? "Encendido" : "Apagado"} correctamente.`);
                    updateled1s(); // Actualiza el estado en la interfaz después del cambio
                } else {
                    console.error(`Error al ${isOn ? "encender" : "apagar"} led1.`);
                }
            })
            .catch(error => console.error("Error de red al controlar led1:", error));
    }

    // --------------------FUNCIONES PARA ACTUALIZAR ESTADO DE LED 2--------------------
    let led2Interval = null;

    function updateled2s() {
        fetch(`http://${esp_ip}/led2/state`)
            .then(response => response.text())
            .then(state => {
                const isOn = state === "true";
                document.getElementById("led2").textContent = isOn ? "Encendido" : "Apagado";
            })
            .catch(error => console.error("Error al obtener el estado de led2:", error));
    }

    function toggleled2(isOn) {
        const endpoint = isOn ? "/led2/on" : "/led2/off";
        fetch(`http://${esp_ip}${endpoint}`, { method: "POST" })
            .then(response => {
                if (response.ok) {
                    console.log(`led2 ${isOn ? "Encendido" : "Apagado"} correctamente.`);
                    updateled2s(); // Actualiza el estado en la interfaz después del cambio

                    // Si led2 se enciende, se inician las pausas
                    if (isOn) {
                        if (!led2Interval) {
                            led2Interval = setInterval(() => {
                                // Alternar el estado del LED2 cada segundo
                                fetch(`http://${esp_ip}/led2/state`)
                                    .then(response => response.text())
                                    .then(state => {
                                        const currentState = state === "true";
                                        const newState = !currentState;
                                        fetch(`http://${esp_ip}/led2/${newState ? "on" : "off"}`, { method: "POST" });
                                    })
                                    .catch(error => console.error("Error al alternar led2:", error));
                            }, 1000);  // Pausa de 1 segundo (1000 ms)
                        }
                    } else {
                        // Si el LED2 se apaga, detener las pausas
                        clearInterval(led2Interval);
                        led2Interval = null;
                    }
                } else {
                    console.error(`Error al ${isOn ? "encender" : "apagar"} led2.`);
                }
            })
            .catch(error => console.error("Error de red al controlar led2:", error));
    }

    // --------------------FUNCIONES PARA ACTUALIZAR ESTADO DE LED 3--------------------
    function updateled3s() {
        fetch(`http://${esp_ip}/led3/state`)
            .then(response => response.text())
            .then(state => {
                const isOn = state === "true";
                document.getElementById("led3").textContent = isOn ? "Encendido" : "Apagado";
            })
            .catch(error => console.error("Error al obtener el estado de led3:", error));
    }

    function toggleled3(isOn) {
        const endpoint = isOn ? "/led3/off" : "/led3/on";
        fetch(`http://${esp_ip}${endpoint}`, { method: "POST" })
            .then(response => {
                if (response.ok) {
                    console.log(`led3 ${isOn ? "Encendido" : "Apagado"} correctamente.`);
                    updateled3s(); // Actualiza el estado en la interfaz después del cambio
                } else {
                    console.error(`Error al ${isOn ? "encender" : "apagar"} led3.`);
                }
            })
            .catch(error => console.error("Error de red al controlar led3:", error));
    }

    // --------------------FUNCIONES PARA ACTUALIZAR ESTADO DEL BUZZER--------------------
    let buzzerInterval = null; 
    function updatebuzzers() {
        fetch(`http://${esp_ip}/buzzer/state`)
            .then(response => response.text())
            .then(state => {
                const isOn = state === "true";
                document.getElementById("buzzer").textContent = isOn ? "Sonando" : "Silencio";
            })
            .catch(error => console.error("Error al obtener el estado del buzzer:", error));
    }

    function togglebuzzer(isOn) {
        const endpoint = isOn ? "/buzzer/on" : "/buzzer/off";
        fetch(`http://${esp_ip}${endpoint}`, { method: "POST" })
            .then(response => {
                if (response.ok) {
                    console.log(`buzzer ${isOn ? "Sonando" : "Silencio"} correctamente.`);
                    updatebuzzers(); // Actualiza el estado en la interfaz después del cambio

                    // Si el buzzer esta sonando, hace pausa de 1 seguno
                    if (isOn) {
                        if (!buzzerInterval) {
                            buzzerInterval = setInterval(() => {
                                // Alternar el estado del buzzer cada segundo
                                fetch(`http://${esp_ip}/buzzer/state`)
                                    .then(response => response.text())
                                    .then(state => {
                                        const currentState = state === "true";
                                        const newState = !currentState;
                                        fetch(`http://${esp_ip}/buzzer/${newState ? "on" : "off"}`, { method: "POST" });
                                    })
                                    .catch(error => console.error("Error al alternar buzzer:", error));
                            }, 1000);  // Pausa de 1 segundo (1000 ms)
                        }
                    } else {
                        // Si el buzzer se apaga, detener las pausas
                        clearInterval(buzzerInterval);
                        buzzerInterval = null;
                    }
                } else {
                    console.error(`Error al ${isOn ? "sonar" : "silenciar"} buzzer.`);
                }
            })
            .catch(error => console.error("Error de red al controlar buzzer:", error));
    }

    // --------------------FUNCIONES PARA ACTUALIZAR ESTADO DE LA TFT--------------------
    function updatetfts() {
        fetch(`http://${esp_ip}/tft/state`)
            .then(response => response.text())
            .then(state => {
                const isOn = state === "true";
                document.getElementById("tft").textContent = isOn ? "Encendida" : "Apagada";
            })
            .catch(error => console.error("Error al obtener el estado de la tft:", error));
    }

    function toggletft(isOn) {
        const endpoint = isOn ? "/tft/on" : "/tft/off";
        fetch(`http://${esp_ip}${endpoint}`, { method: "POST" })
            .then(response => {
                if (response.ok) {
                    console.log(`tft ${isOn ? "Encendida" : "Apagada"} correctamente.`);
                    updatetfts(); // Actualiza el estado en la interfaz después del cambio
                } else {
                    console.error(`Error al ${isOn ? "encender" : "apagar"} tft.`);
                }
            })
            .catch(error => console.error("Error de red al controlar tft:", error));
    }

    function sendTFTMessage(message) {
        fetch(`http://${esp_ip}/tft/message`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: `text=${encodeURIComponent(message)}`,
        })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error(error));
    }

    // --------------------ENVIO DE MENSAJES Y CARGA DE IMAGENES--------------------
    // Envío de mensaje y carga de imagen
    sendMessageButton.addEventListener("click", () => {
        const message = document.getElementById("message-input").value.trim();
        document.getElementById("tft-message").textContent = message || "Mensaje vacío";
        document.getElementById("tft-image").style.display = "none";
        // Ejemplo de uso
        sendTFTMessage(`${message}`);
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

            emailImage = imageInput;
        } else {
            alert("Por favor selecciona una imagen para mostrar.");
        }
    });

    // --------------------REGISTRO DE CORREOS ELECTRÓNICOS--------------------
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

    // --------------------ACTUALIZACIÓN DE LA LISTA DE CORREOS--------------------
    function updateEmailList() {
        const emailUl = document.getElementById('emails');
        emailUl.innerHTML = emailList.map(email => `<li>${email}</li>`).join('');
    }

    // --------------------HISTORIAL DE ENVIOS DE CORREOS (3 MÁXIMO)--------------------
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

        console.log("Email list:");
        console.log(emailList);

        console.log("Email content:");

        emailMessage = document.getElementById("message-input").value.trim();
        emailImage = document.getElementById("image-input").files[0];

        console.log(emailMessage);
        console.log(emailImage);

        const formData = new FormData();
        formData.append('address', emailList);
        formData.append('message', emailMessage);
        if (emailImage) {
            formData.append('image', emailImage);
        }

        const resut = fetch('http://localhost:1117/sendemail', {
            method: 'POST',
            body: formData,
        }).then(response => {
            if (response.status === 200) {
                return response.json();
            } else {
                throw new Error('Failed to send email');
            }
        })
        .then(data => {
            console.log('Success:', data);
            alert("Correo(s) enviado(s) con éxito.");
        })
        .catch((error) => {
            console.error('Error:', error);
            alert("Error al enviar correo(s).");
        });
    });

    // --------------------ACTUALIZACIÓN DEL HISTORIAL DE CORREOS ENVIADOS--------------------
    function updateEmailHistory() {
        emailHistoryList.innerHTML = emailHistory
            .map(entry => `<li>Enviado el: ${entry.timestamp} a ${entry.recipients} destinatarios</li>`)
            .join('');
    }
});