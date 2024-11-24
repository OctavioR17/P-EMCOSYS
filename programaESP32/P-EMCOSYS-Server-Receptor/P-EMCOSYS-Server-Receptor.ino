#include <WiFi.h>
#include <HTTPClient.h>

const char* ssid = "";
const char* password = "";
const char* serverName = "http://IP_ESP_SERVIDOR/";

const int ledPin = 18;
const int buzzerPin = 26;

void setup() {
  pinMode(ledPin, OUTPUT);
  pinMode(buzzerPin, OUTPUT);
  Serial.begin(115200);

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConectado al WiFi");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    HTTPClient http;
    http.begin(serverName);
    int httpResponseCode = http.GET();

    if (httpResponseCode == 200) {
      String payload = http.getString();
      int value = payload.toInt();
      if (value == 1) {
        digitalWrite(ledPin, HIGH);
        tone(buzzerPin, 1000);  // Suena a 1kHz
        delay(500);
        noTone(buzzerPin);
      } else {
        digitalWrite(ledPin, LOW);
      }
    } else {
      Serial.println("Error al conectar al servidor");
    }
    http.end();
  }
  delay(1000); // Tiempo entre solicitudes
}
