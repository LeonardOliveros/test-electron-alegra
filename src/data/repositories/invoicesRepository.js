const connection = require('../../connection')
const filesRepository = require('./filesRepository')

const prefix = '/invoices'

class invoicesRepository {
  // Recupera las facturas
  static getInvoices(callback) {
    this.checkedInvoicesDelete()
    return connection.request(prefix, 'get', null, (err, res) => {
      const invoicesAPI = res || []

      if (err) {
        callback(err, null)
      }

      // Recupera las facturas del archivo invoices
      const invoices = filesRepository.getInvoices()
      // Filtra las facturas para solo dejar las nuevas
      const newInvoices = invoicesAPI.filter(invoice => !invoices.includes(invoice.id))

      if (newInvoices.length > 0) {
        // Crea los archivos de las nuevas facturas
        newInvoices.forEach(invoice2 => filesRepository.createFile(`${invoice2.id}.json`, invoice2))
        callback(null, newInvoices)
      }
      callback(null, [])
    })
  }

  // Actualiza el campo anotation de una factura
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

  /*
  * Chequea que facturqs fueron eliminadas
  * en fisico(archivo)
  */
  static checkedInvoicesDelete() {
    // Obtiene las facturas no encontradas(eliminadas)
    const invoicesDeleted = filesRepository.getInvoicesNotFound()
    // Recorre el array
    invoicesDeleted.forEach((invoiceDeleted) => {
      // Actualiza el campo anotation
      this.updateInvoice(invoiceDeleted)
      // Agrega la factura al invoicesDeleted
      filesRepository.delInvoice(invoiceDeleted)
    })
  }
}

module.exports = invoicesRepository
