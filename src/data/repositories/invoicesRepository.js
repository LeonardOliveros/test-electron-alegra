const connection = require('../../connection')

const prefix = '/invoices'

class invoicesRepository {
  static getInvoices(callback) {
    return connection.request('/invoices', 'get', (err, res) => {
      if (err) {
        callback(err, null)
      }
      callback(null, res)
    })
  }
}

module.exports = invoicesRepository
