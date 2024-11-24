# P-EMCOSYS (Potro-Emergency Communication System)

P-EMCOSYS es un proyecto desarrollado para las materias **PIIS** y **PICD** en la Facultad de Ingeniería de la UAEMéx. Este sistema está diseñado para la comunicación en situaciones de emergencia dentro de la facultad.

## Características

- Control principal basado en **ESP32**.
- Interfaz web integrada para monitoreo y control.
- Componentes como LEDs, botones físicos y buzzer.
- Microfono el cual permite a los usuarios hablar y enviar un sonido que simula la voz a otro ESP32
- Dos ESP32 conectados entre si por medio del protocolo HTTP
- Javascript para la lógica del proyecto.

## Requisitos

- Microcontrolador ESP32 (2)
- leds (4)
- buzzers (2)
- tft (en este caso es utilizada la ST7735S)
- pulsadores (2)
- variedad de jumpers
- Sound sensor KY-038
- protoboards
- Cable tipo C (2)
- IDE Arduino con las bibliotecas necesarias. (integradas en una carpeta del proyecto)
- Algún editor de textos para configurar la red WiFi y la IP dada por el ESP32, o desde Arduino IDE
- Conexión Wi-Fi.
- Node.JS y npm (para el apartado de correos)

## Instalación

0. Realiza el circuito físico (las conexiones se encuentran en un apartado inferior)
1. Clona el repositorio: git clone https://github.com/OctavioR17/P-EMCOSYS.git
2. Configura las credenciales necesarias en los archivos necesarios (archivos ino y script)
3. Carga el archivo .ino a los ESP32 desde el IDE Arduino.
4. Abre el .html en el navegador de tu preferencia
5. Asegurate de que el ESP32 haya realizado una conexión correcta
6. Empieza a usar

## INSTALACIÓN Y CONFIGURACIÓN DE ACS (AZURE COMMUNICATION SERVICES)
Para poder hacer un uso correcto del apartado de correos electrónicos, accede a la carpeta azure-email dentro de la carpeta del proyecto, abre una terminal y realiza lo siguiente: 
1. npm install (esto instalará todas las dependencias necesarias)
2. npm run test (esto ejecutará el servicio y estará listo para usarse)

## Conexión de componentes en el ESP32:

<!-- ![Guia Conexion ESP32 Servidor](multimedia/circuitoServidor.jpg "Cricuito Servidor")
![Guia Conexion ESP32 Cliente](multimedia/circuitoCliente.jpg "Cricuito Cliente") -->

*ESP32 Servidor:*
1. led1Amarillo -> pinD17 (resistencia de lado del pin rojo, rojo, cafe, dorado, es la pata larga del led)
2. led2Rojo -> pinD16 (resistencia de lado del pin rojo, rojo, cafe, dorado, es la pata larga del led)
3. led3Verde -> pinD15 (resistencia de lado del pin rojo, rojo, cafe, dorado, es la pata larga del led)
4. buzzer -> pinD33 (resistencia de lado del pin rojo, rojo, cafe, es la pata )
5. btn1 -> pinD25
6. btn2 -> pinD26
Todo lo demás a tierra

Sound Sensor:
1. AO -> pin 34
2. GND -> Tierra
3. ´+´ -> VN/VIN o 3.3v
4. DO -> pin 27

TFT:
1. GND -> Tierra
2. VCC -> VN/VIN
3. SCL -> D18
4. SDA -> D23
5. RES -> D4
6. DC -> D2
7. CS -> D5

*ESP32 Cliente:*
1. led -> pin 18
2. buzzer -> pin 26

## Contribuciones
Las contribuciones son bienvenidas. Abre un issue o envía un pull request para sugerencias, correcciones o mejoras.

De antemano gracias.
2024.Todos los derechos reservados. 
~ Octavio Daniel Rodríguez González