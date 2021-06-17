const {
  MessageType,
  Mimetype
} = require('@adiwajshing/baileys')
const fs = require('fs')
const logger = require('../lib/logger')
const storage = require('../lib/storage')
const commands = require('./commands')

const saveCredential = (whatsapp) => {
  logger.system('Credential updated!')

  const authInfo = whatsapp.base64EncodedAuthInfo()
  fs.writeFileSync('./src/storage/auth_info.json', JSON.stringify(authInfo, null, '\t'))
}

const onChatUpdate = async (chatUpdate, whatsapp) => {
  if (chatUpdate.hasNewMessage) {
    let msg = chatUpdate.messages.array[0];

    await onWaMessage(msg, whatsapp)
  }
}

const onWaMessage = async (message, whatsapp) => {
  if (message.key.fromMe) return
  if (!message.message) return

  const senderId = message.key.remoteJid
  if (senderId.includes('@g.us')) return

  const messageType = Object.keys(message.message)[0]

  if (messageType == MessageType.text || messageType == MessageType.extendedText) {
    const messageText = message.message.conversation || message.message.extendedTextMessage.text
    if (!messageText) return
    if (messageText.startsWith('/') && commands[messageText.substr(1)]) {
      await commands[messageText.substr(1)](message, whatsapp)
    } else {
      const checkInRoom = await inRoom(senderId)
      if (checkInRoom !== undefined) {
        await whatsapp.sendMessage(checkInRoom, messageText, messageType)
      }
    }
  } else {
    const checkInRoom = await inRoom(senderId)
    if (checkInRoom !== undefined) {
      if (
        messageType === MessageType.contactsArray ||
        messageType === MessageType.groupInviteMessage ||
        messageType === MessageType.product
      ) return

      if (messageType === MessageType.location || messageType == MessageType.liveLocation) {
        await whatsapp.sendMessage(
          checkInRoom,
          message.message[messageType],
          messageType
        )
      } else if (messageType === MessageType.contact) {
        await whatsapp.sendMessage(
          checkInRoom, {
            displayname: message.message[messageType].displayName,
            vcard: message.message[messageType].vcard
          },
          MessageType.contact
        )
      } else {
        const buffer = await whatsapp.downloadMediaMessage(message)
        let options = {}

        if (messageType === MessageType.document) {
          options = {
            mimetype: message.message[messageType].mimetype
          }
        }
        await whatsapp.sendMessage(
          checkInRoom,
          buffer,
          messageType,
          options
        )
      }
    }
  }
}

const inRoom = async (sender) => {
  const rooms = await storage.getRooms()
  const checker = (p) => {
    return p.roomId.includes(sender)
  }
  const checkIfExists = rooms.find(checker)
  if (checkIfExists !== undefined) {
    let to;
    if (checkIfExists.client1.remoteJid === sender) {
      to = checkIfExists.client2.remoteJid
    } else {
      to = checkIfExists.client1.remoteJid
    }
    return to
  }
  return undefined
}

module.exports = {
  saveCredential,
  onChatUpdate
}