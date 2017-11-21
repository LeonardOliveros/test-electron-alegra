const connection = require('../../connection')
const filesRepository = require('./filesRepository')

const prefix = '/invoices'

class invoicesRepository {
  static getInvoices(callback) {
    this.checkedInvoicesDelete()
    return connection.request(prefix, 'get', null, (err, res) => {
      if (err) {
        callback(err, null)
      }

      const invoices = filesRepository.getInvoices()
      const newInvoices = res.filter(invoice => !invoices.includes(invoice.id))

      newInvoices.forEach(invoice2 => filesRepository.createFile(`${invoice2.id}.json`, invoice2))
      callback(null, newInvoices)
    })
  }

  static updateInvoice(invoiceId) {
    const body = { anotation: `Factura eliminada en local el ${new Date()}` }
    return connection.request(`${prefix}/${invoiceId}`, 'put', body, (err, res) => {
      if (err) {
        console.log(err)
        return false
      }
      return res
    })
  }

  static checkedInvoicesDelete() {
    const invoicesDeleted = filesRepository.getInvoicesNotFound()
    invoicesDeleted.forEach((invoiceDeleted) => {
      this.updateInvoice(invoiceDeleted)
      filesRepository.delInvoice(invoiceDeleted)
    })
  }
}

module.exports = invoicesRepository
