const {
  WAConnection
} = require('@adiwajshing/baileys')
const fs = require('fs')

const receiver = require('./receiver')
const logger = require('../lib/logger')

const conn = new WAConnection()

conn.on('open', () => receiver.saveCredential(conn))
conn.on('chat-update', chats => receiver.onChatUpdate(chats, conn))

const connect = async () => {
  const path = './src/storage/auth_info.json';
  if (fs.existsSync(path)) {
    logger.system('Logged from auth info.')
    conn.loadAuthInfo(path)
  }
  await conn.connect()
}

module.exports = {
  connect
}