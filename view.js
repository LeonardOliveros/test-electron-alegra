const $ = require('jquery')
const fs = require('fs')

const filenameInvoices = 'invoices'
let intervalId;

// Iniciar consulta de las facturas al API
$('#start').on('click', () => {
  $('#start').addClass('hidden')
  $('#stop').removeClass('hidden')
  start()
})

// Detener consulta al API
$('#stop').on('click', () => {
  $('#start').removeClass('hidden')
  $('#stop').addClass('hidden')
  stop()
})

/*
* Agrega una notificacion en pantalla
*
*/
const notify = (amount, client) => {
  if (client && amount) {
    let element = `<div class="alert alert-info alert-dismissible" role="alert">¡Tienes una venta por \$${amount} del cliente ${client}!</div>`
    $('#notify-list').prepend(element)
  }
}

// Carga y muestra las facturas
const loadAndDisplayInvoices = (invoices) => {
  // Recupera las facturas guardadas en el invoices
  getInvoicesFile((err, invoicesLocal) => {
    console.log(invoicesLocal)
    // Filtra las facturas guardadas en local
    const tmpInvoices = invoices.filter(invoice => !invoicesLocal.includes(invoice.id))
    const tmpInvoicesExists = invoices.map(invoice => invoicesLocal.includes(invoice.id) && invoice.id)
    refreshDeleteLocal(tmpInvoicesExists)
    console.log(tmpInvoices)
    // Recorre las facturas
    for (let item in tmpInvoices) {
      // Si no existe la factura en local se crea
      if (!fs.existsSync(`${tmpInvoices[item].id}.json`)) {
        // Se parsea el object a string
        const content = JSON.stringify(tmpInvoices[item])
        /*
        * Se crea el archivo que contendra
        * el json de la factura
        */
        fs.writeFile(`${tmpInvoices[item].id}.json`, content, 'utf8', (err) => {
          // Si hay error al crear el archivo lo muestra en consola
          if (err) return console.log(err)
          // Se agrega al archivo invoices
          addInvoice(tmpInvoices[item])
          // Si no, muestra que el archivo fue creado
          notify(1000, tmpInvoices[item].name)
          console.log(`Archivo creado: ${tmpInvoices[item].id}`)
        })
      }
    }
  })
}

// Obtener las facturas del API
const getInvoices = () => $.ajax('http://35.196.121.8/api/index').then((data) => loadAndDisplayInvoices(data.data));

// Crea intervalo de 3 min para consultar el API
// 3min => 180000
const start = () => intervalId = setInterval(() => getInvoices(), 10000)

// Elimina el intervalo
const stop = () => clearInterval(intervalId)

// Agrega facturar al invoices
const addInvoice = invoice => fs.appendFile(filenameInvoices, `${invoice.id}\n`)

// Agrega facturar al invoices
const delInvoice = invoice => console.log(`Factura eliminada en local el ${new Date()}`)

// Obtiene las facturas agregadas al invoices
const getInvoicesFile = (callback) => {
  const invoices = []
  // Validar si existe el archivo
  if (fs.existsSync(filenameInvoices)) {
    // Se lee el archivo y se convierte en array
    const data = fs.readFileSync(filenameInvoices, 'utf8').split('\n')
    // Se recorre el array
    data.forEach((invoice) => invoice !== '' && invoices.push(parseInt(invoice, 10)))
    return callback(null, invoices)
  }
  // De lo contrario se crea el archivo
  console.log('Creando archivo invoices')
  return fs.writeFile(filenameInvoices, '', (err) => {
    if (err) callback(err, null)
    return callback(null, invoices)
  })
}

// Obtiene las facturas agregadas al local
const refreshDeleteLocal = (invoicesCloud) => {
  const tmpInvoices = invoicesCloud
  // Validar si existe el archivo
  fs.readdir('.', (err, filenames) => {
    filenames.forEach((filename) => {
      if (filename.match(/[0-9].json/)) {
        const tmpFilename = parseInt(filename.replace('.json', ''), 10)
        // Valida si existe el id en el array
        if (tmpInvoices.includes(tmpFilename)) {
          // Se captura el index del elemento
          const index = tmpInvoices.indexOf(tmpFilename)
          /*
          * Se elimina el elemento para dejar
          * solo los elementos eliminados
          */
          tmpInvoices.splice(index, 1)
        }
      }
    })
    tmpInvoices.forEach(invoice => delInvoice(invoice))
  })
}
