const {
  MessageType
} = require('@adiwajshing/baileys')

const response = "*Penggunaan Finda:*\n" +
  "1. */help* : Daftar perintah yang digunakan\n" +
  "2. */simi* : Chat dengan simsimi\n" +
  "3. */find* : Mulai mencari teman baru\n" +
  "4. */stop* : Mengakhiri obrolan dengan teman\n\n" +
  "NOTE: JANGAN MENELPON ATAU VIDEO CALL ATAU AKAN DIBANNED ☺️☺️☺️☺️"

const send = async (to, whatsapp) => {
  await whatsapp.sendMessage(to.key.remoteJid, response, MessageType.text)
}

module.exports = send