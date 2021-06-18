const fs = require('fs')
const request = require('../lib/request')

const pathSimiKeys = './src/storage/simikeys.json'

const readKeys = fs.readFileSync(pathSimiKeys)
const apiKeys = JSON.parse(readKeys)

module.exports = (msg, fn) => request.post(
  'https://wsapi.simsimi.com/190410/talk', {
    'utext': msg,
    'lang': 'id',
    'country': ['ID']
  }, {
    headers: {
      'Content-type': 'application/json',
      'x-api-key': apiKeys[Math.floor(Math.random() * apiKeys.length - 1)]
    }
  },
  (response) => {
    if (response === undefined)
      return fn(undefined)
    if (response.status === 200) {
      return fn(response.data)
    }
    return fn(undefined)
  }
)