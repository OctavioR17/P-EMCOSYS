#include <TFT_eSPI.h> // Librería para la pantalla TFT (ST7735)
#include <SPI.h>

#define LED1_PIN 34
#define LED2_PIN 35
#define LED3_PIN 32
#define BUZZER_PIN 33
#define BUTTON1_PIN 25
#define BUTTON2_PIN 26

TFT_eSPI tft = TFT_eSPI();  // Inicializar la pantalla TFT
bool tftOn = false;         // Estado de la pantalla (apagada al inicio)
unsigned long previousMillis = 0;
const long interval = 3000; // Intervalo de 3 segundos para el buzzer

void setup() {
  // Configurar los pines de los LEDs y buzzer como salidas
  pinMode(LED1_PIN, OUTPUT);
  pinMode(LED2_PIN, OUTPUT);
  pinMode(LED3_PIN, OUTPUT);
  pinMode(BUZZER_PIN, OUTPUT);

  // Configurar los pulsadores como entradas
  pinMode(BUTTON1_PIN, INPUT_PULLUP);  // Pulsador 1
  pinMode(BUTTON2_PIN, INPUT_PULLUP);  // Pulsador 2

  // Inicializar la pantalla TFT
  tft.init();
  tft.setRotation(1); // Ajusta la rotación si es necesario
  tft.fillScreen(TFT_BLACK); // Pantalla comienza apagada

  Serial.begin(115200);
}

void loop() {
  // Leer el estado de los pulsadores
  bool button1State = digitalRead(BUTTON1_PIN) == LOW;  // Pulsador 1 presionado
  bool button2State = digitalRead(BUTTON2_PIN) == LOW;  // Pulsador 2 presionado

  // Encender la pantalla y el LED1 si el pulsador 1 se presiona
  if (button1State && !tftOn) {
    tftOn = true;
    tft.fillScreen(TFT_RED); // Enciende la pantalla (rojo de ejemplo)
    digitalWrite(LED1_PIN, HIGH); // Encender LED 1
  }

  // Apagar la pantalla y encender LED3 si el pulsador 2 se presiona
  if (button2State && tftOn) {
    tftOn = false;
    tft.fillScreen(TFT_BLACK); // Apagar la pantalla
    digitalWrite(LED1_PIN, LOW); // Apagar LED 1
    digitalWrite(LED3_PIN, HIGH); // Encender LED 3
    digitalWrite(LED2_PIN, LOW); // Apagar LED 2
    noTone(BUZZER_PIN); // Apagar el buzzer
  }

  // Si la pantalla está encendida, activar el buzzer cada 3 segundos
  if (tftOn) {
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;

      // Alternar el buzzer
      tone(BUZZER_PIN, 1000); // Emitir un tono
      delay(200);             // Esperar 200 ms
      noTone(BUZZER_PIN);     // Apagar el tono
    }

    // Encender LED 2 mientras el buzzer esté activo
    digitalWrite(LED2_PIN, HIGH);
  }

  // Si la pantalla está apagada, apagar LED 2 y buzzer
  if (!tftOn) {
    digitalWrite(LED2_PIN, LOW);
  }
}
