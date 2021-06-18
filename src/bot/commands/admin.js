const {
  MessageType
} = require('@adiwajshing/baileys')

const storage = require('../../lib/storage')
const options = require('../../lib/options')
const pathSimiKeys = './src/storage/simikeys.json'

const simikeys = async (args, to, whatsapp) => {
  args.shift()
  args.shift()
  const keys = await storage.getItem(pathSimiKeys)
  if (args[0]) {
    if (args[0] === 'add') {
      const addKey = args[1] || undefined
      if (addKey !== undefined) {
        await storage.addItem(pathSimiKeys, addKey)
        await whatsapp.sendMessage(to.remoteJid, '*Berhasil menambahkan simikey👍🏼👍🏼*',
          MessageType.text)
      }
    } else if (args[0] === 'del') {
      const delKey = args[1] || undefined
      if (delKey !== undefined) {
        await storage.delItem(pathSimiKeys, (keys) => {
          let newKeys = []
          keys.forEach(r => {
            if (key !== delKey) {
              newKeys.push(r)
            }
          })
          return newKeys
        })
        await whatsapp.sendMessage(to.remoteJid, '*Berhasil menghapus simikey👍🏼👍🏼*',
          MessageType.text)
      }
    }
  } else {
    await whatsapp.sendMessage(to.remoteJid, keys.join('\n\n'), MessageType.text)
  }
}

const commands = {
  simikeys
}

module.exports = async (msg, whatsapp) => {
  const adminId = await options.get('adminId')

  if (adminId != msg.key.remoteJid) return

  const msgType = Object.keys(msg.message)[0]
  if (msgType === MessageType.text || msgType === MessageType.extendedText) {
    const text = msg.message.conversation || msg.message.extendedTextMessage.text
    const args = text.substr(1).toLowerCase().split(' ')
    if (args[1] && commands[args[1]]) {
      await commands[args[1]](args, msg.key, whatsapp)
    }
  }
}