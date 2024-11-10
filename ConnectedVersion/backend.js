document.getElementById("btn-on").addEventListener("click", () => {
    fetch("http://<ESP32_IP_ADDRESS>/turnOnScreen")
        .then(response => response.json())
        .then(data => {
            document.getElementById("screen-state").textContent = "Encendida";
            console.log("Pantalla encendida:", data);
        })
        .catch(error => console.error("Error:", error));
});

document.getElementById("btn-off").addEventListener("click", () => {
    fetch("http://<ESP32_IP_ADDRESS>/turnOffScreen")
        .then(response => response.json())
        .then(data => {
            document.getElementById("screen-state").textContent = "Apagada";
            console.log("Pantalla apagada:", data);
        })
        .catch(error => console.error("Error:", error));
});

document.getElementById("send-email").addEventListener("click", () => {
    fetch("http://<ESP32_IP_ADDRESS>/sendEmail")
        .then(response => response.json())
        .then(data => {
            document.getElementById("timestamp").textContent = new Date().toLocaleString();
            console.log("Correo enviado:", data);
        })
        .catch(error => console.error("Error enviando correo:", error));
});

// Encender y apagar LEDs
function toggleLED(led, action) {
    fetch(`http://<ESP32_IP_ADDRESS>/${action}LED?led=${led}`)
        .then(response => response.json())
        .then(data => {
            document.getElementById(`led${led}`).textContent = action === "turnOn" ? "Encendido" : "Apagado";
            console.log(`LED ${led} ${action === "turnOn" ? "encendido" : "apagado"}:`, data);
        })
        .catch(error => console.error(`Error cambiando estado del LED ${led}:`, error));
}

document.getElementById("btn-led1-on").addEventListener("click", () => toggleLED(1, "turnOn"));
document.getElementById("btn-led1-off").addEventListener("click", () => toggleLED(1, "turnOff"));
document.getElementById("btn-led2-on").addEventListener("click", () => toggleLED(2, "turnOn"));
document.getElementById("btn-led2-off").addEventListener("click", () => toggleLED(2, "turnOff"));
document.getElementById("btn-led3-on").addEventListener("click", () => toggleLED(3, "turnOn"));
document.getElementById("btn-led3-off").addEventListener("click", () => toggleLED(3, "turnOff"));
