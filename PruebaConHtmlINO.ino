#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <SPI.h>

AsyncWebServer server(80);

void setup() {
    WiFi.softAP("P-EMCOSYS", "password123");
    IPAddress IP = WiFi.softAPIP();
    Serial.begin(115200);
    Serial.print("AP IP address: ");
    Serial.println(IP);

    // Inicialización de la pantalla, LEDs, etc.
    pinMode(LED1, OUTPUT);
    pinMode(LED2, OUTPUT);
    pinMode(LED3, OUTPUT);
    pinMode(BUZZER, OUTPUT);

    // Definir rutas de servidor
    server.on("/encenderPantalla", HTTP_POST, [](AsyncWebServerRequest *request){
        // Código para encender la pantalla y LED1
        digitalWrite(LED1, HIGH);
        request->send(200, "text/plain", "Pantalla encendida");
    });

    server.on("/apagarPantalla", HTTP_POST, [](AsyncWebServerRequest *request){
        // Código para apagar la pantalla y activar LED3
        digitalWrite(LED1, LOW);
        digitalWrite(LED3, HIGH);
        request->send(200, "text/plain", "Pantalla apagada");
    });

    server.on("/mostrarMensaje", HTTP_POST, [](AsyncWebServerRequest *request){
        String mensaje = request->arg("mensaje"); 
        // Lógica para mostrar el mensaje en la pantalla TFT
        tft.setCursor(10, 10);
        tft.setTextColor(ST77XX_WHITE);
        tft.print(mensaje);
        request->send(200, "text/plain", "Mensaje mostrado");
    });

    server.begin();
}