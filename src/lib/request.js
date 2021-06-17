const axios = require('axios')

module.exports = {
  get: (url) => {
    axios.get(url)
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error);
      })
  },
  post: (url, data, options, fn) => {
    axios.post(
      url,
      data,
      options
    ).then(response => {
      return fn(response)
    }).catch(error => {
      return fn(undefined)
    })
  }
}