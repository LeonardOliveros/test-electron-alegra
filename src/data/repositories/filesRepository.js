const fs = require('fs')

/*
* Carpeta donde se guardan las facturas
*/
const folder = 'files'
/*
* Archivo donde se guardaran las facturas
* que ya no son nuevas
*/
const filenameBase = `${folder}/invoices`
/*
* Archivo donde se guardaran las facturas
* que fueron eliminadas en fisico
*/
const filenameBaseDeleted = `${folder}/invoicesDeleted`

class filesRepository {
  static makeFolder(name) {
    if (!fs.existsSync(name)) {
      fs.mkdirSync(name)
    }
    return true
  }

  // Crea archivo donde se guardaran las facturas
  static initFileInvoices() {
    this.makeFolder(folder)
    // Verificar no si existe el archivo
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

  /*
  * Crea el archivo donde se guardaran las
  * facturas eliminadas
  */
  static initFileInvoicesDeleted() {
    this.makeFolder(folder)
    // Validar no si existe
    if (!fs.existsSync(filenameBaseDeleted)) {
      console.log('Creando archivo invoicesDeleted')
      return fs.writeFile(filenameBaseDeleted, '', (err) => {
        if (err) {
          throw err
        }
        return true
      })
    }
    // Ya existe el archivo
    console.log('Ya existe archivo invoicesDeleted')
    return true
  }

  // Recuperar las facturas del archivo invoices
  static getInvoices() {
    const invoices = [];
    // Verifica si existe
    if (fs.existsSync(filenameBase)) {
      // Se lee el archivo y se convierte en array
      const data = fs.readFileSync(filenameBase, 'utf8').split('\n')
      // Se recorre el array
      data.forEach((invoice) => invoice !== '' && invoices.push(invoice))
    }
    return invoices
  }

  // Recuperar las facturas del archivo invoiceDeleted
  static getInvoicesDeleted() {
    const invoicesDeleted = [];
    // Verifica si existe
    if (fs.existsSync(filenameBaseDeleted)) {
      // Se lee el archivo y se convierte en array
      const data = fs.readFileSync(filenameBaseDeleted, 'utf8').split('\n')
      // Se recorre el array
      data.forEach(invoiceDeleted => invoiceDeleted !== '' && invoicesDeleted.push(invoiceDeleted))
    }
    return invoicesDeleted
  }

  // Agrega factura al archivo invoices
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

  // Agrega factura al archivo invoiceDeleted
  static delInvoice(invoiceId) {
    fs.appendFile(filenameBaseDeleted, `${invoiceId}\n`, (err) => {
      if (err) {
        console.log(err)
        return false
      }
      console.log('Agregada factura al invoicesDeleted')
      return true
    })
  }

  /*
  * Obtiene los archivos de facturas que
  * fueron eliminadas
  */
  static getInvoicesNotFound() {
    const invoices = this.getInvoices()
    const invoicesDeleted = this.getInvoicesDeleted()
    const filenames = fs.readdirSync('files')

    filenames.forEach((filename) => {
      if (filename.match(/[0-9].json/)) {
        const filenameTemp = filename.replace(/.json/, '')
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
    return invoices.filter(invoice => !invoicesDeleted.includes(invoice))
  }

  /*
  * Crea archivo para una nueva factura
  */
  static createFile(file, content) {
    // Verifica si existe
    if (!fs.existsSync(file)) {
      // Se parsea el object a string
      const string = JSON.stringify(content)
      /*
      * Se crea el archivo que contendra
      * el json de la factura
      */
      fs.writeFile(`files/${file}`, string, 'utf8', (err) => {
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
