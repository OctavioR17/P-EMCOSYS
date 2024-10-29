#include <Adafruit_GFX.h>
#include <Adafruit_ST7735.h>
#include <SPI.h>

#define TFT_CS     5
#define TFT_RST    4
#define TFT_DC     2
#define LED1       17
#define LED2       16
#define LED3       15
#define BUTTON1    25
#define BUTTON2    26
#define BUZZER     33

Adafruit_ST7735 tft = Adafruit_ST7735(TFT_CS, TFT_DC, TFT_RST);

bool tftOn = false;
unsigned long previousMillis = 0;
unsigned long arrowMillis = 0;
const long interval = 3000;
int arrowX = 0; // Posición inicial de la flecha
int arrowSpeed = 2; // Velocidad de la flecha
int arrowWidth = 30; // Ancho total de la flecha (cuerpo + punta)

void setup() {
  pinMode(LED1, OUTPUT);
  pinMode(LED2, OUTPUT);
  pinMode(LED3, OUTPUT);
  pinMode(BUTTON1, INPUT_PULLUP);
  pinMode(BUTTON2, INPUT_PULLUP);
  pinMode(BUZZER, OUTPUT);

  tft.initR(INITR_BLACKTAB); 
  digitalWrite(LED1, LOW);
  digitalWrite(LED2, LOW);
  digitalWrite(LED3, LOW);
}

void loop() {
  if (digitalRead(BUTTON1) == LOW) { 
    if (!tftOn) {
      tftOn = true;
      tft.fillScreen(ST77XX_BLACK);
      drawText(); // Llama a la función para dibujar el texto
      digitalWrite(LED1, HIGH); 
      digitalWrite(LED3, LOW); 
      previousMillis = millis();
      arrowMillis = millis();
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

    // Controlar el buzzer para que suene cada 3 segundos
    if (currentMillis - previousMillis >= interval) {
      previousMillis = currentMillis;
      tone(BUZZER, 1000, 500); 
      digitalWrite(LED2, HIGH);
      delay(500); 
      digitalWrite(LED2, LOW);
    }

    // Mover la flecha cada 50 ms aproximadamente
    if (currentMillis - arrowMillis >= 1) {
      arrowMillis = currentMillis;
      moveArrow();  // Mover la flecha
    }
  }
}

void drawText() {
  // Mostrar el mensaje en la parte superior
  //tft.setCursor(10, 10);
  //tft.setTextSize(1);
  //tft.setTextColor(ST77XX_WHITE);
  //tft.print("Alerta de evacuacion");
  //tft.setCursor(10, 20);
  //tft.print("Salida hacia la derecha");
  //_--------------------------------------------------
     tft.setCursor(30, 10);
    tft.setTextSize(1);
    tft.setTextColor(ST77XX_RED);
    tft.print("ALERTA DE");
    
    tft.setCursor(30, 20);
    tft.setTextSize(1);
    tft.setTextColor(ST77XX_WHITE);
    tft.print("EVACUACION");
      // Texto de salida (SALIDA HACIA / EXIT TO)
    tft.setCursor(30, 30);
    tft.setTextSize(1);
    tft.setTextColor(ST77XX_WHITE);
    tft.print("SALIDA HACIA");

    tft.setCursor(30, 40);
    tft.setTextColor(ST77XX_CYAN);  // Parte en color
    tft.print("DERECHA");
    //----------------------------------------------------------







  // Mostrar el mensaje en la parte inferior
 // tft.setCursor(10, 110);
 // tft.setTextSize(1);
 // tft.print("Evacuation alert");
 // tft.setCursor(10, 120);
 // tft.print("Exit to right");
//-----------------------------------------------------------
  tft.setCursor(30, 90);
    tft.setTextSize(1);
    tft.setTextColor(ST77XX_WHITE);
    tft.print("EVACUATION");

    tft.setCursor(30, 100);
    tft.setTextSize(1);
    tft.setTextColor(ST77XX_RED);
    tft.print("ALERT");
     tft.setCursor(30, 110);
    tft.setTextSize(1);
    tft.setTextColor(ST77XX_WHITE);
    tft.print("EXIT TO");

    tft.setCursor(30, 120);
    tft.setTextColor(ST77XX_CYAN);  // Parte en color
    tft.print("RIGHT");
    //-----------------------------------------------------------


}

void moveArrow() {
  // Apagar la pantalla
  tft.fillScreen(ST77XX_BLACK);

  // Volver a dibujar el texto
  drawText();

  // Dibujar la flecha en su nueva posición (centro vertical, entre el texto superior e inferior)
  tft.fillRect(arrowX, 60, 20, 10, ST77XX_GREEN);    // Cuerpo de la flecha
  tft.fillTriangle(arrowX + 20, 55, arrowX + 20, 75, arrowX + 30, 65, ST77XX_GREEN); // Punta de la flecha

  // Mover la flecha hacia la derecha
  arrowX += arrowSpeed;

  // Si la flecha llega al borde derecho, reiniciarla
  if (arrowX > 128) {  // La pantalla es de 128x128 píxeles
    arrowX = -arrowWidth;  // Reiniciar posición de la flecha (fuera del borde izquierdo)
  }
}
