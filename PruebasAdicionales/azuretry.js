// Importa el SDK de ACS para email
const { EmailClient, EmailMessage } = require('@azure/communication-email');

// Configura tu string de conexión (obténlo desde el portal de Azure)
const connectionString = "CONNECTION_STRING_FROM_AZURE";
const emailClient = new EmailClient(connectionString);

// Función para enviar el correo
async function sendEmail(toEmail, subject, body) {
    const emailMessage = {
        sender: "you@yourdomain.com", // Configurado en Azure
        content: {
            subject: subject,
            plainText: body,
        },
        recipients: {
            to: [{ email: toEmail }]
        }
    };

    try {
        const poller = await emailClient.beginSend(emailMessage);
        const response = await poller.pollUntilDone(); // Espera hasta que el correo sea enviado
        console.log(`Correo enviado. ID: ${response.id}`);
    } catch (error) {
        console.error("Error enviando correo: ", error);
    }
}

// Llama a la función con los detalles del correo
sendEmail("correo@ejemplo.com", "Asunto del correo", "Contenido del correo en texto plano");
