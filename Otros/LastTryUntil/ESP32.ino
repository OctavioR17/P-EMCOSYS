#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <SPI.h>
#include <ArduinoJson.h>
#include <Base64.h>
#include <JPEGDecoder.h>
#include <ESP32_MailClient.h>

#define WIFI_SSID "tu_SSID"
#define WIFI_PASSWORD "tu_contraseña"

#define TFT_CS     5
#define TFT_RST    4
#define TFT_DC     2
#define LED1       17
#define LED2       16
#define LED3       15
#define BUZZER     33

Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST);
AsyncWebServer server(80);

bool tftOn = false;
String message = "";
String imageData = "";
unsigned long previousMillis = 0;
const long interval = 3000;

void setup() {
  // Configuración inicial
  Serial.begin(115200);
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(BUZZER, OUTPUT);

  // Conexión WiFi
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Conectando a WiFi...");
  }
  Serial.println("Conexión WiFi establecida");

  // Inicialización de la pantalla TFT
  tft.initR(INITR_BLACKTAB);
  tft.fillScreen(ST77XX_BLACK);
  
  // Rutas HTTP
  server.on("/turn_on_screen", HTTP_GET, [](AsyncWebServerRequest *request){
    tftOn = true;
    digitalWrite(LED1, HIGH);
    digitalWrite(LED3, LOW);
    request->send(200, "application/json", "{\"status\":\"Screen turned on\"}");
  });

  server.on("/turn_off_screen", HTTP_GET, [](AsyncWebServerRequest *request){
    tftOn = false;
    digitalWrite(LED1, LOW);
    digitalWrite(LED3, HIGH);
    noTone(BUZZER);
    request->send(200, "application/json", "{\"status\":\"Screen turned off\"}");
  });

  server.on("/show_message", HTTP_GET, [](AsyncWebServerRequest *request){
    if (request->hasParam("msg")) {
      message = request->getParam("msg")->value();
      showMessageOnScreen(message);
      request->send(200, "application/json", "{\"status\":\"Message displayed\"}");
    }
  });

  server.on("/show_image", HTTP_GET, [](AsyncWebServerRequest *request){
    if (request->hasParam("img")) {
      imageData = request->getParam("img")->value();
      showImageOnScreen(imageData);
      request->send(200, "application/json", "{\"status\":\"Image displayed\"}");
    }
  });

  server.on("/send_email", HTTP_POST, [](AsyncWebServerRequest *request){
    if (request->hasParam("emails", true)) {
      String emails = request->getParam("emails", true)->value();
      sendEmails(emails);
      request->send(200, "application/json", "{\"status\":\"Emails sent\"}");
    }
  });

  server.begin();
}

void loop() {
  if (tftOn) {
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      tone(BUZZER, 1000, 500); 
      digitalWrite(LED2, HIGH);
      delay(500); 
      digitalWrite(LED2, LOW);
    }
  }
}

void showMessageOnScreen(String msg) {
  if (tftOn) {
    tft.fillScreen(ST77XX_BLACK);
    tft.setCursor(30, 10);
    tft.setTextSize(1);
    tft.setTextColor(ST77XX_RED);
    tft.print("ALERTA DE");

    tft.setCursor(30, 20);
    tft.setTextSize(1);
    tft.setTextColor(ST77XX_WHITE);
    tft.print("EVACUACION");

    tft.setCursor(30, 30);
    tft.setTextSize(1);
    tft.setTextColor(ST77XX_WHITE);
    tft.print("SALIDA HACIA");

    tft.setCursor(30, 40);
    tft.setTextColor(ST77XX_CYAN); 
    tft.print("DERECHA");

    // Mostrar mensaje en la parte inferior
    tft.setCursor(30, 90);
    tft.setTextSize(1);
    tft.setTextColor(ST77XX_WHITE);
    tft.print(msg);
  }
}

void showImageOnScreen(String imgData) {
  // Decodificar la imagen base64
  int decodedLength = Base64.decodedLength(imgData.c_str());
  byte decodedData[decodedLength];
  Base64.decode(decodedData, imgData.c_str(), imgData.length());

  // Utilizar una librería para decodificar JPEG y mostrar en TFT
  JPEGDecoder decoder;
  decoder.decodeArray(decodedData, decodedLength);

  if (decoder.decode()) {
    // La imagen se decodificó correctamente
    int width = decoder.width;
    int height = decoder.height;

    // Mostrar la imagen en la pantalla TFT
    tft.setAddrWindow(0, 0, width - 1, height - 1);
    for (int row = 0; row < height; row++) {
      for (int col = 0; col < width; col++) {
        // Obtener el color de cada píxel de la imagen decodificada
        uint16_t color = decoder.getPixelColor(col, row);
        tft.pushColor(color);
      }
    }
  }
}

const char* smtp_server = "smtp.gmail.com";  // Servidor SMTP (puedes usar otro servidor si lo deseas)
const int smtp_port = 465;                   // Puerto SMTP (465 para SSL)
const char* smtp_user = "tucorreo@gmail.com";  // Tu dirección de correo
const char* smtp_password = "tu_contraseña";  // Contraseña de tu correo

void sendEmails(String emailList) {
  // Configuración del correo
  SMPT_Email email;
  email.sender.name = "Tu Nombre";
  email.sender.email = smtp_user;
  email.subject = "Alerta de evacuación";
  email.message = "Este es un mensaje automático de evacuación desde el ESP32.";

  // Dividir la lista de correos recibidos (por ejemplo, separados por coma)
  int startIndex = 0;
  while (startIndex < emailList.length()) {
    int commaIndex = emailList.indexOf(',', startIndex);
    if (commaIndex == -1) {
      commaIndex = emailList.length();
    }

    String emailAddress = emailList.substring(startIndex, commaIndex);
    email.addRecipient(emailAddress);  // Añadir la dirección de correo al mensaje
    startIndex = commaIndex + 1;
  }

  // Configuración SMTP
  SMTPSession smtp;
  smtp.debug(1);  // Activar el modo debug (opcional)
  
  // Conectar al servidor SMTP
  smtp.begin(smtp_server, smtp_port, smtp_user, smtp_password, true);

  // Enviar el correo
  if (smtp.sendMail(email)) {
    Serial.println("Correo(s) enviado(s) con éxito");
  } else {
    Serial.println("Error al enviar el correo");
  }

  // Cerrar sesión SMTP
  smtp.quit();
}