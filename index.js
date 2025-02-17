const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve static files from the public folder
app.use(express.static('public'));

// Initialize WhatsApp client with local authentication
const client = new Client({
    authStrategy: new LocalAuth()
});

// When a QR code is received, convert it to a data URL and emit it to the client
client.on('qr', (qr) => {
    console.log('QR code received');
    qrcode.toDataURL(qr, (err, url) => {
        if (err) {
            console.error('Error generating QR code', err);
            return;
        }
        io.emit('qr', url);
    });
});

// When the client is ready, notify connected web clients
client.on('ready', () => {
    console.log('WhatsApp Web Client is ready!');
    io.emit('ready');
});

// Listen for messages and respond to a specific command
client.on('message', async (msg) => {
    if (msg.body === '!ping') {
        msg.reply('Pong! 🏓');
    }
});

// Initialize the WhatsApp client
client.initialize();

// Log Socket.io connections
io.on('connection', (socket) => {
    console.log('A client connected');
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});
