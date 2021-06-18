const fs = require('fs')
const request = require('../lib/request')

const pathSimiKeys = './src/storage/simikeys.json'

const readKeys = fs.readFileSync(pathSimiKeys)
const apiKeys = JSON.parse(readKeys)
const apiKey = apiKeys[Math.floor(Math.random() * apiKeys.length - 1)]

module.exports = (msg, fn) => request.post(
  'https://wsapi.simsimi.com/190410/talk', {
    'utext': msg,
    'lang': 'id',
    'country': ['ID']
  }, {
    headers: {
      'Content-type': 'application/json',
      'x-api-key': apiKey
    }
  },
  (response) => {
    if (response.status === 200) {
      return fn(response.data)
    } else {
      let newApiKeys = []
      apiKeys.forEach(key => {
        if (key !== apiKey) {
          newApiKeys.push(key)
        }
      })
      fs.writeFileSync(pathSimiKeys, JSON.stringify(newApiKeys, null, '\t'))
    }
    return fn(undefined)
  }
)