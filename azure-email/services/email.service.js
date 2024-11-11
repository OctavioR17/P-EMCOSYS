import {EmailClient} from "@azure/communication-email";
import { connectionString, senderAddress } from "./config.js";

const header = `
    <head>
        <style>
            header {
                background-color: #4CAF50;
                color: #fff;
                padding: 10px;
                text-align: center;
                width: 70%;
            }
        </style>
    </head>
    <body>
        <header>
            <h1>P-EMCOSYS</h1>
        </header>
`;

const client = new EmailClient(connectionString);

export async function send(address, message, imageBase64, imageMimeType) {
    const emailMessage = {
        senderAddress,
        content: {
            subject: "P-EMCOSYS - Alerta",
            html: `
			<html>
                ${header}
				<body>
					<h1>${message}</h1>
				</body>
			</html>`,
        },
        recipients: {
            to: Array.isArray(address) ? address.map(addr => ({ address: addr })) : [{ address }],
        },
        attachments: imageBase64 ? [{
            name: 'image',
            contentInBase64: imageBase64,
            contentType: imageMimeType,
        }] : [],
    };

    console.log("Sending email...");

    console.log(emailMessage);
    console.log(address);
    console.log(message);

    //return "Success";
    
    const poller = await client.beginSend(emailMessage);
    const result = await poller.pollUntilDone();

    if(result.status === "Succeeded") {
        console.log("Email sent successfully.");
        return "Success";
    } else {
        console.error("Email failed to send.");
        return "Error";
    }
}