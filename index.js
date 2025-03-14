const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = 3000;

const accountSid = 'your_account_sid';  // Replace with your Twilio Account SID
const authToken = 'your_auth_token';    // Replace with your Twilio Auth Token
const twilioPhoneNumber = 'whatsapp:+your_twilio_whatsapp_number';  // Replace with your Twilio WhatsApp number

const client = new twilio(accountSid, authToken);

// Middleware
app.use(bodyParser.json());

// Route to send WhatsApp message
app.post('/send-whatsapp', (req, res) => {
    const { to, message } = req.body;

    // Send WhatsApp message using Twilio API
    client.messages
        .create({
            body: message,
            from: twilioPhoneNumber,
            to: 'whatsapp:' + to
        })
        .then((message) => {
            res.json({ status: 'success', sid: message.sid });
        })
        .catch((error) => {
            res.status(500).json({ status: 'error', message: error.message });
        });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
