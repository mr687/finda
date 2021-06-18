const request = require('../lib/request')

module.exports = (msg, fn) => request.post(
  'https://wsapi.simsimi.com/190410/talk', {
    'utext': msg,
    'lang': 'id',
    'country': ['ID']
  }, {
    headers: {
      'Content-type': 'application/json',
      'x-api-key': [
        'CSaACCD~TCK25YwQ7f8id~V7CXGD5WDMKaxnhD98',
        'tIwL9LLYlccK9Ei.SXNHt-i4QMc3mbVHdrU8_Zg3',
        'h7b3GPCtssiwFyD0v1IVP2CI33hbTxLbvcLoJeJN',
        '7fY_w0c2ViLHecwPMULHe3481Nv9cOBVnNxNmwEt',
        'MgT_sjPHRrFl2pMwq9leYoPuK9h6fNXBhTvT0t-u',
        'rCKsXOo5JAKuNFem9egi7enANqSm3oYybj4GPCFd',
        'm6mHm~UF9nhdZr_cDGtQjjvtXXm1O~1r2k-awQ43',
        'SSa8qHJ4oFfApfa-Y5FMns2o2Rsk7RS8novxugo5',
        'kRzUny7R_M1bSIewGoDJG3cDI_9nwzGbqG.lPO5D'
      ][Math.floor(Math.random() * 6)]
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