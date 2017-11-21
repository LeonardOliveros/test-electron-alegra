const request = require('request')

const config = require('./config')

const baseUrl = `${config.app.url_api}/invoices`
const credentials = new Buffer(`${config.app.email}:${config.app.token}`).toString('base64')
const auth = `Basic ${credentials}`

class connection {
  static request(prefix, method, callback) {
    return request[method]({
      url: `${baseUrl}${prefix}`,
      headers: {
        Authorization: auth
      },
      json: true,
    }, (err, res) => {
      if (err) {
        callback(err, null)
      }
      callback(null, res.body)
    })
  }
}

module.exports = connection
