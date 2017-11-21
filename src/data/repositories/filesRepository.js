const fs = require('fs')

const filenameBase = 'invoices'

class filesRepository {
  // Obtiene las facturas agregadas al invoices
  static initFileInvoices() {
    // Validar no si existe el archivo
    if (!fs.existsSync(filenameBase)) {
      console.log('Creando archivo invoices')
      return fs.writeFile(filenameBase, '', (err) => {
        if (err) {
          throw err
        }
        return true
      })
    }
    // Ya existe el archivo
    console.log('Ya existe archivo invoices')
    return true
  }

  static getInvoices() {
    const invoices = [];
    // Verifica si existe
    if (fs.existsSync(filenameBase)) {
      // Se lee el archivo y se convierte en array
      const data = fs.readFileSync(filenameBase, 'utf8').split('\n')
      // Se recorre el array
      data.forEach((invoice) => invoice !== '' && invoices.push(parseInt(invoice, 10)))
    }
    return invoices
  }

  static addInvoice(invoiceId) {
    fs.appendFile(filenameBase, `${invoiceId}\n`, (err) => {
      if (err) {
        console.log(err)
        return false
      }
      console.log('Agregada factura al invoices')
      return true
    })
  }

  static getInvoicesNotFound() {
    const invoices = this.getInvoices()

    return fs.readdir('.', (err, filenames) => {
      filenames.forEach((filename) => {
        if (filename.match(/[0-9].json/)) {
          const filenameTemp = parseInt(filename.replace(/.json/, ''), 10)
          // Valida si existe el id en el array
          if (invoices.includes(filenameTemp)) {
            // Se captura el index del elemento
            const index = invoices.indexOf(filenameTemp)
            /*
            * Se elimina el elemento para dejar
            * solo los elementos no encontrados
            */
            invoices.splice(index, 1)
          }
        }
      })
      // tmpInvoices.forEach(invoice => delInvoice(invoice))
      return invoices
    })
  }

  static createFile(file, content) {
    // Verifica si existe
    if (!fs.existsSync(file)) {
      // Se parsea el object a string
      const string = JSON.stringify(content)
      /*
      * Se crea el archivo que contendra
      * el json de la factura
      */
      fs.writeFile(file, string, 'utf8', (err) => {
        // Si hay error al crear el archivo lo muestra en consola
        if (err) {
          console.log(err)
          return false
        }
        // Se agrega al archivo invoices
        this.addInvoice(file.replace(/.json/, ''))
        // Se agrega al archivo invoices
        console.log(`Archivo creado: ${file}`)
        return true
      })
    }
  }
}

module.exports = filesRepository
