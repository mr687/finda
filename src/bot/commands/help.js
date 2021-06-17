const {
  MessageType
} = require('@adiwajshing/baileys')

const response = "Penggunaan Finda:\n" +
  "1. */help* : Daftar perintah yang digunakan\n" +
  "2. */find* : Mulai mencari teman baru\n" +
  "3. */stop* : Mengakhiri obrolan dengan teman\n\n" +
  "☺️☺️☺️☺️"

const send = async (to, whatsapp) => {
  await whatsapp.sendMessage(to.key.remoteJid, response, MessageType.text)
}

module.exports = send