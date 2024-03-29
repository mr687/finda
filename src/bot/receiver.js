const {
  MessageType,
  Mimetype
} = require('@adiwajshing/baileys')
const fs = require('fs')
const logger = require('../lib/logger')
const storage = require('../lib/storage')
const commands = require('./commands')
const stop = require('./commands/stop')
const options = require('../lib/options')
const apis = require('../api')
const {
  resolve
} = require('path')

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
    if (messageText.startsWith('/')) {
      const args = messageText.substr(1).toLowerCase().split(' ')
      const command = args[0]
      if (commands[command]) {
        await commands[command](message, whatsapp)
      }
    } else {
      const checkInRoom = await inRoom(senderId)

      if (checkInRoom === 'simsimi') {
        await sendFromSimsimi(senderId, messageText, whatsapp)
        return
      }

      if (checkInRoom !== undefined && checkInRoom !== 'simsimi') {
        await whatsapp.sendMessage(checkInRoom, messageText, messageType)
      }
    }
  } else {
    const checkInRoom = await inRoom(senderId)

    if (checkInRoom === 'simsimi') {
      await whatsapp.sendMessage(senderId, 'Simsimi hanya bisa chat text saja.☺️', MessageType.text)
      return
    }

    if (checkInRoom !== undefined && checkInRoom !== 'simsimi') {
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

const sendFromSimsimi = async (to, msg, whatsapp) => {
  apis.simsimi(msg, async (response) => {
    if (response === undefined) {
      await stop({
        key: {
          remoteJid: to
        }
      }, whatsapp)
      return
    }
    if (response.status === 200) {
      const simiDelay = await options.get('simiDelay') || 3000
      await new Promise(resolve => setTimeout(() => resolve(), simiDelay))
      await whatsapp.sendMessage(to, response.atext, MessageType.text)
    }
  })
}

const inRoom = async (sender) => {
  const rooms = await storage.getRooms()
  const checker = (p) => {
    return p.roomId.includes(sender)
  }
  const checkIfExists = rooms.find(checker)
  if (checkIfExists !== undefined) {
    let to;
    if (checkIfExists.client2 === 'simsimi') {
      return 'simsimi'
    }
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