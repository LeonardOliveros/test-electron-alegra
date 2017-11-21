const $ = require('jquery')
const fs = require('fs')

const filenameInvoices = 'invoices'
let intervalId

const invoicesRepository = require('./data/repositories/invoicesRepository')
const filesRepository = require('./data/repositories/filesRepository')

filesRepository.initFileInvoices()
filesRepository.initFileInvoicesDeleted()

// Crea intervalo de 3 min para consultar el API
// 3min => 180000
const start = () => intervalId = setInterval(() => invoicesRepository.getInvoices((err, res) => res.forEach(invoice => notify(invoice.total, invoice.client.name))), 10000)

// Elimina el intervalo
const stop = () => clearInterval(intervalId)

// Agrega una notificacion en pantalla
const notify = (amount, client) => {
  if (client && amount) {
    let element = `<div class="alert alert-info alert-dismissible" role="alert">¡Tienes una venta por \$${amount} del cliente ${client}!</div>`
    $('#notify-list').prepend(element)
  }
}

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
