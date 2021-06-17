const whatsapp = require('./bot/whatsapp')

const start = async () => {
  await whatsapp.connect();
}

start()