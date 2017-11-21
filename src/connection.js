const request = require('request')

const config = require('./config')

const baseUrl = `${config.app.url_api}`
const credentials = new Buffer(`${config.app.email}:${config.app.token}`).toString('base64')
const auth = `Basic ${credentials}`

class connection {
  static request(prefix, method, body, callback) {
    return request[method]({
      uri: `${baseUrl}${prefix}`,
      headers: {
        Authorization: auth
      },
      json: true,
      body,
    }, (err, res) => {
      if (err) {
        callback(err, null)
      }
      callback(null, res.body)
    })
  }
}

module.exports = connection
