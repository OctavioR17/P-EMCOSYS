# P-EMCOSYS (Potro-Emergency Communication System)

P-EMCOSYS es un proyecto desarrollado para las materias **PIIS** y **PICD** en la Facultad de Ingeniería de la UAEMéx. Este sistema está diseñado para la comunicación en situaciones de emergencia dentro de la facultad.

## Características

- Control principal basado en **ESP32**.
- Interfaz web integrada para monitoreo y control.
- Componentes como LEDs, botones físicos y buzzer.
- Javascript para la lógica del proyecto.

## Requisitos

- Placa ESP32.
   - leds (3)
   - buzzer
   - tft (en este caso fue usada la ST7735S)
   - pulsadores (2)
   - variedad de jumpers
   - protoboard
- IDE Arduino con las bibliotecas necesarias. (integradas en una carpeta del proyecto)
- Algún editor de textos para configurar la red WiFi y la IP dada por el ESP32
- Conexión Wi-Fi.
- Node.JS (para el apartado de correos)

## Instalación

1. Clona el repositorio: git clone https://github.com/OctavioR17/P-EMCOSYS.git
2. Configura las credenciales Wi-Fi en el archivo .ino.
3. Carga el archivo .ino al ESP32 desde el IDE Arduino.
4. Abre el .html en el navegador de tu preferencia
5. Asegurate de que el ESP32 haya realizado una conexión correcta
6. Empieza a usar

## INSTALACIÓN Y CONFIGURACIÓN DE ACS (AZURE COMMUNICATION SERVICES)
Para poder hacer un uso correcto del apartado de correos electrónicos, accede a la carpeta azure-email dentro de la carpeta del proyecto, abre una terminal y realiza lo siguiente: 
1. npm install (esto instalará todas las dependencias necesarias)
2. npm run test (esto ejecutará el servicio y estará listo para usarse)

## Imagen alusiva para la conexión de componentes en el ESP32:
(insertar imagen)
