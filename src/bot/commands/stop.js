const {
  MessageType,
  ChatModification
} = require('@adiwajshing/baileys')
const storage = require('../../lib/storage')

const response = "*Percakapan berakhir.🤪*"

const send = async (from, whatsapp) => {
  const rooms = await storage.getRooms()
  const checker = (p) => {
    return p.roomId.includes(from.key.remoteJid)
  }
  const checkIfExists = rooms.find(checker)
  if (checkIfExists !== undefined) {
    const client1 = checkIfExists.client1
    const client2 = checkIfExists.client2

    await storage.delRoom(checkIfExists)
    await whatsapp.sendMessage(client1.remoteJid, response, MessageType.text)
    await whatsapp.sendMessage(client2.remoteJid, response, MessageType.text)
    // await whatsapp.modifyChat(
    //   client1.remoteJid,
    //   ChatModification.delete
    // )
    // await whatsapp.modifyChat(
    //   client2.remoteJid,
    //   ChatModification.delete
    // )
  }
  return
}

module.exports = send