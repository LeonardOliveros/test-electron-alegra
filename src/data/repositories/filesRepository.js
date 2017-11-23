const fs = require('fs')

/*
* Carpeta donde se guardan las facturas
*/
const folderDefault = 'files'
/*
* Archivo donde se guardaran las facturas
* que fueron eliminadas en fisico
*/
const filenameConfig = `config`
/*
* Archivo donde se guardara la ruta
* donde se almacenaran las facturas
*/
const filenameBase = `invoices`
/*
* Archivo donde se guardaran las facturas
* que fueron eliminadas en fisico
*/
const filenameBaseDeleted = `deleted`

let dirInvoices

class filesRepository {
  static makeFolder(name) {
    if (!fs.existsSync(name)) {
      fs.mkdirSync(name)
    }
    return true
  }

  static createFolderDefault() {
    this.makeFolder(folderDefault)
  }

  // Crea archivo donde se guardara el directorio de las facturas
  static initFileConfig() {
    const file = `${folderDefault}/${filenameConfig}`
    // Verificar no si existe el archivo
    if (!fs.existsSync(file)) {
      return fs.writeFile(file, '', (err) => {
        if (err) {
          throw err
        }
        console.log('Creando archivo config')
        return true
      })
    }
    // Ya existe el archivo
    console.log('Ya existe archivo config')
    return true
  }

  // Crea archivo donde se guardaran las facturas
  static initFileInvoices() {
    const file = `${folderDefault}/${filenameBase}`
    // Verificar no si existe el archivo
    if (!fs.existsSync(file)) {
      return fs.writeFile(file, '', (err) => {
        if (err) {
          throw err
        }
        console.log('Creando archivo invoices')
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
    const file = `${folderDefault}/${filenameBaseDeleted}`
    // Validar no si existe
    if (!fs.existsSync(file)) {
      return fs.writeFile(file, '', (err) => {
        if (err) {
          throw err
        }
        console.log('Creando archivo invoicesDeleted')
        return true
      })
    }
    // Ya existe el archivo
    console.log('Ya existe archivo deleted')
    return true
  }

  // Recuperar las facturas del archivo invoices
  static getInvoices() {
    const invoices = [];
    const file = `${folderDefault}/${filenameBase}`
    // Verifica si existe
    if (fs.existsSync(file)) {
      // Se lee el archivo y se convierte en array
      const data = fs.readFileSync(file, 'utf8').split(',')
      // Se recorre el array
      data.forEach((invoice) => invoice !== '' && invoices.push(invoice))
    }
    return invoices
  }

  // Recuperar las facturas del archivo invoiceDeleted
  static getInvoicesDeleted() {
    const invoicesDeleted = [];
    const file = `${folderDefault}/${filenameBaseDeleted}`
    // Verifica si existe
    if (fs.existsSync(file)) {
      // Se lee el archivo y se convierte en array
      const data = fs.readFileSync(file, 'utf8').split(',')
      // Se recorre el array
      data.forEach(invoiceDeleted => invoiceDeleted !== '' && invoicesDeleted.push(invoiceDeleted))
    }
    return invoicesDeleted
  }

  // Agrega factura al archivo invoices
  static addInvoice(invoiceId) {
    fs.appendFile(`${folderDefault}/${filenameBase}`, `${invoiceId},`, (err) => {
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
    fs.appendFile(`${folderDefault}/${filenameBaseDeleted}`, `${invoiceId},`, (err) => {
      if (err) {
        console.log(err)
        return false
      }
      console.log('Agregada factura al deleted')
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
    const filenames = fs.readdirSync(dirInvoices)

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
  static createFile(invoiceId, content) {
    // Verifica si existe
    const file = `${dirInvoices}/${invoiceId}`
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
        this.addInvoice(invoiceId.replace(/.json/, ''))
        // Se agrega al archivo invoices
        console.log(`Archivo creado: ${file}`)
        return true
      })
    }
  }

  /*
  * Obtener el directorio para almacenar las facturas
  */
  static getConfig() {
    // Verifica si existe
    const file = `${folderDefault}/${filenameConfig}`
    if (fs.existsSync(file)) {
      // Se obtiene el contenido del archivo
      const data = fs.readFileSync(file, 'utf8').split('\n')
      dirInvoices = data[0]
      return dirInvoices
    }
    return false
  }

  /*
  * Setear el directorio para almacenar las facturas
  */
  static setConfig(directory) {
    // Verifica si existe
    if (fs.existsSync(`${folderDefault}/${filenameConfig}`)) {
      /*
      * Se crea el archivo que contendra
      * el directorio de las facturas
      */
      fs.writeFile(`${folderDefault}/${filenameConfig}`, directory, 'utf8', (err) => {
        // Si hay error al crear el archivo lo muestra en consola
        if (err) {
          console.log(err)
          return false
        }
        dirInvoices = directory
      })
      // Se seteo el directorio de las facturas
      console.log(`Directorio seteado: ${directory}`)
      return true
    }
    // Si no existe, se crean
    this.makeFolder(folderDefault)
    this.initFileConfig()
    this.setConfig(directory)
  }
}

module.exports = filesRepository
