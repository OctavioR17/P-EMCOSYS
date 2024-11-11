import { send } from '../services/email.service.js';
import multer from 'multer';

const upload = multer();

export const sendEmail = async (req, res) => {

    upload.single('image')(req, res, async (err) => {
        if (err) {
            console.error('Error uploading file:', err);
            return res.status(500).json({ message: 'Error uploading file.' });
        }

        console.log('\n');
        console.log('\tSend Email');
        console.log(`Request method: ${req.method}`);
        console.log(`Request URL: ${req.url}`);
        console.log(`Request query parameters: ${JSON.stringify(req.query)}`);
        console.log(`Request body: ${JSON.stringify(req.body)}`);
        console.log('\n');

        const imageBase64 = req.file ? req.file.buffer.toString('base64') : null;

        try {
            const result = await send(req.body.address, req.body.message, imageBase64, req.file ? req.file.mimetype : null);
            if (result !== "Success") {
                console.log('Failed to send email.');
                return res.status(500).json({ message: 'Failed to send email.' });
            }
            console.log('Email sent successfully.');
            return res.status(200).json({ message: 'Email sent successfully.' });
        } catch (error) {
            console.error('Error sending email:', error);
            return res.status(500).json({ message: 'Failed to send email.' });
        }
    });

}