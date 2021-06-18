const {
  MessageType
} = require('@adiwajshing/baileys')
const simsimi = require('../../api/simsimi')
const storage = require('../../lib/storage')

module.exports = async (to, whatsapp) => {
  await storage.addRoom({
    'roomId': to.key.remoteJid + 'simsimi',
    'client1': to.key,
    'client2': 'simsimi'
  })

  await whatsapp.sendMessage(to.key.remoteJid, "*Chat dengan simi dimulai😱*", MessageType.text)
  return
}