#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <SPI.h>

#define TFT_CS 5
#define TFT_RST 4
#define TFT_DC 2
#define LED1 17
#define LED2 16
#define LED3 15
#define BUTTON1 26
#define BUTTON2 25
#define BUZZER 33
const byte pinBuzzer = 33;

Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST);

bool tftOn = false;
unsigned long previousMillis = 0;
const long interval = 3000;

void setup() {
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(BUTTON1, INPUT_PULLUP);
  pinMode(BUTTON2, INPUT_PULLUP);
  pinMode(BUZZER, OUTPUT);

  tft.initR(INITR_BLACKTAB);
  tft.fillScreen(ST77XX_BLACK);
  digitalWrite(LED1, LOW);
  digitalWrite(LED2, LOW);
  digitalWrite(LED3, LOW);
}

void loop() {
  if (digitalRead(BUTTON1) == LOW) {
    if (!tftOn) {
      tftOn = true;
      tft.fillScreen(ST77XX_BLACK);
      tft.setCursor(10, 30);
      tft.setTextSize(2);
      tft.setTextColor(ST77XX_WHITE);
      tft.print("Enviando alerta");  // Mostrar el mensaje en la pantalla
      digitalWrite(LED3, LOW);
      digitalWrite(LED1, HIGH);
      previousMillis = millis();
    }
  }

  if (digitalRead(BUTTON2) == LOW) {
    if (tftOn) {
      tftOn = false;
      tft.fillScreen(ST77XX_BLACK);
      digitalWrite(LED1, LOW);
      digitalWrite(LED2, LOW);
      digitalWrite(LED3, HIGH);
      noTone(BUZZER);
    }
  }

  if (tftOn) {
    unsigned long currentMillis = millis();
    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      tone(BUZZER, 500, 600);
      digitalWrite(LED2, HIGH);
      delay(500);
      digitalWrite(LED2, LOW);
    }
  }
}
