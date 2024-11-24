/*
--------------------------------------------------------------------
Proyecto Integral: P-EMCOSYS (Potro - EMergency COmmunication SYstem)
Integrantes del equipo:
    1. Luis Garcia
    2. Octavio Rodriguez
    3. Isaac Vazquez
 --------------------------------------------------------------------
Este programa es para que el ESP32 pueda controlar los componentes 
físicos, además de que permite las peticiones HTTP para que la lógica
realice cambios desde la página HTML
----------------------------------------------------------------------
*/

// LIBRERÍAS A UTILIZAR
#include <WiFi.h>
#include <WebServer.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <HTTPClient.h>

// DECLARACIÓN Y CONFIGURACION DE RED
const char* ssid = "";
const char* password = "";

WebServer server(80);

// DEFINICIÓN DE PINES DE COMPONENTES
const int tft_cs = 5;
const int tft_rst = 4;
const int tft_dc = 2;
Adafruit_ST7735 tft = Adafruit_ST7735(tft_cs, tft_dc, tft_rst);

const int led1 = 17;
const int led2 = 16;
const int led3 = 15;
const int btnen = 26;
const int btnap = 25;
const int buzzer = 33;

// MICROFONO
const int digitalPin = 27; // DO del sensor de sonido
const int analogPin = 34; // AO del sensor de sonido
//const int buzzerMicro = 35; // Pin para el buzzer
//const int ledMicro = 21; // PIN del led para el micro

int digitalValue = 0;
int analogValue = 0;

//bool ledMicros = false;

// VARIABLES DE ESTADO PARA LOS COMPONENTES
bool led1s = false;
bool led2s = false;
bool led3s = true;
bool buzzers = false;
bool tfts = false;
int btnens = 0;
int btnaps = 0;

// PROCESO DE CONEXIÓN DE RED
void setup() {
    Serial.begin(115200);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Conectando a WiFi...");
    }
    Serial.println("Conectado a la red WiFi");

    // OBTENCIÓN DE LA IP LOCAL DE LA ESP32
    Serial.print("Dirección IP del ESP32: ");
    Serial.println(WiFi.localIP());

    // INICIALIZACIÓN DE LOS COMPONENTES
    pinMode(led1, OUTPUT);
    pinMode(led2, OUTPUT);
    pinMode(led3, OUTPUT);
    pinMode(buzzer, OUTPUT);
    pinMode(btnen, INPUT_PULLUP);
    pinMode(btnap, INPUT_PULLUP);

    // PARA EL MICROFONO

    pinMode(digitalPin, INPUT);
    //pinMode(buzzerMicro, OUTPUT);
    //pinMode(ledMicro, OUTPUT);

    Serial.println("Prueba del sensor de sonido con buzzer iniciada...");

    // SE TERMINA LO DEL MICROFONO

    digitalWrite(led1, LOW);
    digitalWrite(led2, LOW);
    digitalWrite(led3, HIGH);

    // PARA EL MICROFONO
    //digitalWrite(ledMicro, LOW);
    // SE TERMINA EL MICROFONO

    led1s = false;
    led2s = false;
    led3s = true;
    buzzers = false;
    tfts = false;

    // INICIALIZACIÓN DE LA TFT
    tft.initR(INITR_BLACKTAB);

    // RUTAS PARA CONTROLAR COMPONENTES DESDE BACKEND/FRONTEND (ENDPOINTS)
    configurarRutas();

    // INICIO DE SERVIDOR
    server.begin();
    Serial.println("Servidor iniciado");
}

void loop() {
  server.handleClient();

  if (digitalRead(btnen)==LOW) {
    digitalWrite(led1, HIGH); 
    digitalWrite(led2, HIGH);
    digitalWrite(led3, LOW);
    tone(buzzer, 1000);
    tft.fillScreen(ST77XX_WHITE);
    tft.setTextColor(ST77XX_BLACK);
    tft.setTextSize(1);
    tft.setCursor(10, 10);
    tft.println("Encendida");
  } else if (digitalRead(btnap)==LOW) {
    digitalWrite(led1, LOW);
    digitalWrite(led2, LOW);
    digitalWrite(led3, HIGH);
    noTone(buzzer);
    tft.fillScreen(ST77XX_BLACK);
    tft.setTextColor(ST77XX_WHITE);
    tft.setTextSize(1);
    tft.setCursor(10, 10);
    tft.println("Apagada");
  }

}

// FUNCIONES PARA CONFIGURAR RUTAS Y RESPUESTAS
void configurarRutas() {
  // -------------------------LED 1-------------------------
    server.on("/led1/state", HTTP_GET, []() {
        sendCORSResponse(200, led1s ? "true" : "false");
    });
    server.on("/led1/on", HTTP_POST, []() {
        led1s = true;
        digitalWrite(led1, HIGH);
        sendCORSResponse(200, "{\"status\": \"Encendido\"}");
    });
    server.on("/led1/off", HTTP_POST, []() {
        led1s = false;
        digitalWrite(led1, LOW);
        sendCORSResponse(200, "{\"status\": \"Apagado\"}");
    });
    // -------------------------LED 2-------------------------
    server.on("/led2/state", HTTP_GET, []() {
        sendCORSResponse(200, led2s ? "true" : "false");
    });
    server.on("/led2/on", HTTP_POST, []() {
        led2s = true;
        digitalWrite(led2, HIGH);
        sendCORSResponse(200, "{\"status\": \"Encendido\"}");
    });
    server.on("/led2/off", HTTP_POST, []() {
        led2s = false;
        digitalWrite(led2, LOW);
        sendCORSResponse(200, "{\"status\": \"Apagado\"}");
    });
    // -------------------------LED 3-------------------------
    server.on("/led3/state", HTTP_GET, []() {
        sendCORSResponse(200, led3s ? "true" : "false");
    });
    server.on("/led3/on", HTTP_POST, []() {
        led3s = true;
        led2s = false;
        buzzers = false;
        digitalWrite(led3, HIGH);
        digitalWrite(led2, LOW);
        noTone(buzzer);
        sendCORSResponse(200, "{\"status\": \"Encendido\"}");
    });
    server.on("/led3/off", HTTP_POST, []() {
        led3s = false;
        digitalWrite(led3, LOW);
        sendCORSResponse(200, "{\"status\": \"Apagado\"}");
    });
    // -------------------------BUZZER-------------------------
    server.on("/buzzer/state", HTTP_GET, []() {
        sendCORSResponse(200, buzzers ? "true" : "false");
    });
    server.on("/buzzer/on", HTTP_POST, []() {
        buzzers = true;
        tone(buzzer, 1000);
        sendCORSResponse(200, "{\"status\": \"Sonando\"}");
    });
    server.on("/buzzer/off", HTTP_POST, []() {
        buzzers = false;
        noTone(buzzer);
        sendCORSResponse(200, "{\"status\": \"Silencio\"}");
    });
    
    // -------------------------TFT SCREEN-------------------------
    server.on("/tft/state", HTTP_GET, []() {
        sendCORSResponse(200, tfts ? "true" : "false");
    });
    server.on("/tft/on", HTTP_POST, []() {
        tfts = true;
        // Código para "encender" tft
        tft.fillScreen(ST77XX_WHITE);  // Rellena con color blanco
        // muestra mensaje de la tft encendida
        tft.setTextColor(ST77XX_BLACK);
        tft.setTextSize(1);
        tft.setCursor(10, 10);
        tft.println("Encendida");
        sendCORSResponse(200, "{\"status\": \"Encendida\"}");
    });
    server.on("/tft/off", HTTP_POST, []() {
        tfts = false;
        // Código para "apagar" tft
        tft.fillScreen(ST77XX_BLACK);  // Rellena con color negro
        // muestra mensaje de la tft apagada
        tft.setTextColor(ST77XX_WHITE);
        tft.setTextSize(1);
        tft.setCursor(10, 10);
        tft.println("Apagada");
        sendCORSResponse(200, "{\"status\": \"Apagada\"}");
    });
    
    // -------------------------TFT SCREEN MESSAGE-------------------------
    server.on("/tft/message", HTTP_POST, []() {
        if (server.hasArg("text")) {
            String message = server.arg("text");
            tft.fillScreen(ST77XX_BLACK);
            tft.setTextColor(ST77XX_WHITE);
            tft.setCursor(10, 10);
            tft.print(message);
            Serial.println("Recibiendo mensaje para la pantalla TFT: " + message);
            sendCORSResponse(200, "{\"status\": \"Mensaje mostrado\"}");
        } else {
            sendCORSResponse(400, "{\"error\": \"No se proporcionó texto\"}");
        }
    });

    // Manejo de solicitudes OPTIONS para CORS en TFT Message
    server.on("/tft/message", HTTP_OPTIONS, []() {
        server.sendHeader("Access-Control-Allow-Origin", "*");
        server.sendHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
        server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
        server.send(204); // Respuesta sin contenido
    });

    // -------------------------MANEJO DE SOLICITUDES OPTIONS PARA CORS-------------------------
    server.onNotFound([]() {
        if (server.method() == HTTP_OPTIONS) {
            sendCORSResponse(204, ""); // Respuesta vacía para OPTIONS
        } else {
            sendCORSResponse(404, "{\"error\": \"Ruta no encontrada\"}");
        }
    });

    // RUTA PARA CONTROLAR EL MICROFONO
    server.on("/", []() {
      // Leer el estado de la salida digital del sensor
      digitalValue = digitalRead(digitalPin);
      // Leer el valor analógico (opcional)
      analogValue = analogRead(analogPin);
      /*
      // Mostrar valores en el monitor serial
      Serial.print("Digital: ");
      Serial.print(digitalValue);
      Serial.print(" | Analogico: ");
      Serial.println(analogValue);

      // Activar el buzzer si se detecta sonido
      if (digitalValue == HIGH && analogValue >= 1) {
        tone(buzzerMicro, 1000); // Reproduce un tono de 1000 Hz
        digitalWrite(ledMicro, HIGH);
        Serial.println("¡Sonido detectado! Activando buzzer...");
        } else {
          noTone(buzzerPin); // Apaga el buzzer
          digitalWrite(ledMicro, LOW);
          Serial.println("Sin detecciones.");
          }
          */
    server.send(200, "text/plain", String(digitalValue));
    });
}

void sendCORSResponse(int code, const char* response) {
    server.sendHeader("Access-Control-Allow-Origin", "*"); // Permitir todas las fuentes
    server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
    server.send(code, "application/json", response);
}