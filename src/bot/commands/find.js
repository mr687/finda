const {
  MessageType
} = require('@adiwajshing/baileys')
const storage = require('../../lib/storage')
const stop = require('./stop')

const responseWait = "*Mencari...🕵🏻🕵🏼‍♂️*"
const responseFound = "*Percakapan dimulai👋🏼👋🏼*"

const sendWait = async (to, whatsapp) => {
  await stop(to, whatsapp)

  if (Math.random() < 0.7) {
    await storage.addRoom({
      'roomId': to.key.remoteJid + 'simsimi',
      'client1': to.key,
      'client2': 'simsimi'
    })

    await sendFound(to, whatsapp)
    return
  }

  const waitingList = await storage.getWaiting()
  if (waitingList.length > 0 && waitingList[0].remoteJid !== to.key.remoteJid) {
    const waiter = waitingList.shift()
    await storage.delWaiting(waiter)
    await storage.addRoom({
      'roomId': waiter.remoteJid + to.key.remoteJid,
      'client1': waiter,
      'client2': to.key
    })
    await sendFound(to, whatsapp)
    await sendFound({
      key: waiter
    }, whatsapp)
    return
  }
  if (waitingList.find(predicate => predicate.remoteJid === to.key.remoteJid) === undefined) {
    await storage.addWaiting(to.key)
  }
  await whatsapp.sendMessage(to.key.remoteJid, responseWait, MessageType.text)
}

const sendFound = async (to, whatsapp) => {
  await whatsapp.sendMessage(to.key.remoteJid, responseFound, MessageType.text)
}

module.exports = sendWait