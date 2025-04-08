const { default: makeWASocket, useMultiFileAuthState, fetchLatestBaileysVersion, DisconnectReason } = require('@adiwajshing/baileys');
const qrcode = require('qrcode-terminal');

const startBot = async () => {
  const { state, saveState } = await useMultiFileAuthState('./auth_info');
  const { version } = await fetchLatestBaileysVersion();
  const sock = makeWASocket({
    version,
    printQRInTerminal: true,
    auth: state
  });

  sock.ev.on('qr', qr => {
    qrcode.generate(qr, { small: true });
  });

  sock.ev.on('close', ({ reason }) => {
    console.log('Connection closed due to', reason);
  });

  sock.ev.on('messages.upsert', async (m) => {
    console.log('Received message:', m.messages);
    // Process incoming messages here (commands, replies, etc.)
  });

  // Add your commands for kicking, banning, and other features here
  sock.sendMessage = async (jid, message) => {
    try {
      await sock.sendMessage(jid, message);
    } catch (err) {
      console.error('Error sending message:', err);
    }
  };

  console.log('Bot is running...');
};

startBot();

sock.ev.on('messages.upsert', async (m) => {
  const message = m.messages[0];
  const sender = message.key.fromMe ? 'You' : message.key.remoteJid;

  if (message.message.conversation === '!kick') {
    if (config.admin.includes(sender)) {
      await sock.groupParticipantsUpdate(message.key.remoteJid, [sender], 'remove');
      sock.sendMessage(message.key.remoteJid, { text: 'User has been kicked.' });
    }
  }

  if (message.message.conversation === '!ban') {
    if (config.admin.includes(sender)) {
      await sock.groupParticipantsUpdate(message.key.remoteJid, [sender], 'remove');
      sock.sendMessage(message.key.remoteJid, { text: 'User has been banned.' });
    }
  }

  // Add more commands as per your needs
});
