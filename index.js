const { default: makeWASocket, useSingleFileAuthState, DisconnectReason, delay } = require('@adiwajshing/baileys')
const pino = require('pino')

const { state, saveState } = useSingleFileAuthState('./auth_info.json')

// Create the socket connection
const sock = makeWASocket({
  logger: pino({ level: 'silent' }),
  printQRInTerminal: true,
  auth: state
})

sock.ev.on('connection.update', async (update) => {
  const { connection, lastDisconnect } = update
  if (connection === 'close') {
    console.log('Disconnected due to ', lastDisconnect.error)
    // Reconnect on disconnect
    sock.connect()
  }
})

sock.ev.on('messages.upsert', async (m) => {
  console.log('Received message: ', m.messages)
  // Add your command handling logic here
})

sock.ev.on('creds.update', saveState)
