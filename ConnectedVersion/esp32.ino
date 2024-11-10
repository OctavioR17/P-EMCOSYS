/*
// Librerías a utilizar
#include <WiFi.h> //-- Sirve para todo lo de red
#include <ESPAsyncWebServer.h> //-- Sirve para el servidor web
#include <ESP32_MailClient.h> //-- Es el cliente de correos del ESP32

const char* ssid = "SSID";
const char* password = "PASSWORD";

AsyncWebServer server(80);

const int screenPin = 12; // Pin de la pantalla
const int led1 = 14;      // Pin del LED 1
const int led2 = 27;      // Pin del LED 2
const int led3 = 26;      // Pin del LED 3

// Configuración de envío de correo
SMTPData smtpData;

void setup() {
  Serial.begin(115200);

  // Configurar el WiFi
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando a WiFi...");
  }
  Serial.println("Conectado a WiFi");

  // Configuración de pines
  pinMode(screenPin, OUTPUT);
  pinMode(led1, OUTPUT);
  pinMode(led2, OUTPUT);
  pinMode(led3, OUTPUT);

  // Definir rutas HTTP
  server.on("/turnOnScreen", HTTP_GET, [](AsyncWebServerRequest *request){
    digitalWrite(screenPin, HIGH);
    request->send(200, "application/json", "{\"status\":\"pantalla encendida\"}");
  });

  server.on("/turnOffScreen", HTTP_GET, [](AsyncWebServerRequest *request){
    digitalWrite(screenPin, LOW);
    request->send(200, "application/json", "{\"status\":\"pantalla apagada\"}");
  });

  server.on("/turnOnLED", HTTP_GET, [](AsyncWebServerRequest *request){
    String led = request->getParam("led")->value();
    if (led == "1") digitalWrite(led1, HIGH);
    else if (led == "2") digitalWrite(led2, HIGH);
    else if (led == "3") digitalWrite(led3, HIGH);
    request->send(200, "application/json", "{\"status\":\"LED encendido\"}");
  });

  server.on("/turnOffLED", HTTP_GET, [](AsyncWebServerRequest *request){
    String led = request->getParam("led")->value();
    if (led == "1") digitalWrite(led1, LOW);
    else if (led == "2") digitalWrite(led2, LOW);
    else if (led == "3") digitalWrite(led3, LOW);
    request->send(200, "application/json", "{\"status\":\"LED apagado\"}");
  });

  // Ruta para enviar correo electrónico
  server.on("/sendEmail", HTTP_GET, [](AsyncWebServerRequest *request){
    sendEmail();
    request->send(200, "application/json", "{\"status\":\"correo enviado\"}");
  });

  server.begin();
  Serial.println("Servidor iniciado");
}

void sendEmail() {
  smtpData.setLogin("smtp.example.com", 587, "tuemail@example.com", "tu_contraseña");
  smtpData.setSender("ESP32", "tuemail@example.com");
  smtpData.setRecipient("destinatario@example.com");
  smtpData.setSubject("Notificación desde ESP32");
  smtpData.setMessage("Este es un mensaje de prueba desde ESP32", false);

  if (MailClient.sendMail(smtpData)) {
    Serial.println("Correo enviado con éxito");
  } else {
    Serial.println("Error enviando el correo");
  }
  
  smtpData.empty();
}

void loop() {
  // No se necesita código en el loop
}
*/