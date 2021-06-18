const storage = require('./storage')

const pathOptions = './src/storage/options.json'

module.exports = {
  get: async (key) => {
    const options = await storage.getItem(pathOptions)
    if (options[key]) return options[key]
    return undefined
  }
}