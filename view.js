let $ = require('jquery')
let fs = require('fs')
let filename = 'contacts'
let sno = 0

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
//fs.appendFile('contacts', name + ',' + email + '\n')
//addEntry(name, email)

const addEntry = (name, email) => {
  if (name && email) {
    sno++
    let updateString = '<tr><td>' + sno + '</td><td>' + name + '</td><td>' + email +'</td></tr>'
    $('#contact-table').append(updateString)
  }
}

const loadAndDisplayInvoices = (invoices) => {
  // Chequear si existe
  for (let item in invoices) {
    console.log(invoices)
    if (!fs.existsSync(`${invoices[item].id}.json`)) {
      // Se parsea el object a string
      const content = JSON.stringify(invoices[item])
      /*
      * Se crea el archivo que contendra
      * el json de la factura
      */
      fs.writeFile(`${invoices[item].id}.json`, content, 'utf8', (err) => {
        // Si hay error al crear el archivo lo muestra en consola
        if (err) {
          console.log(err)
        }
        // Si no, muestra que el archivo fue creado
        console.log(`Archivo creado: ${invoices[item].id}`)
      })
    }
  }
  /*if (fs.existsSync(invoce.id)) {
  let data = fs.readFileSync(filename, 'utf8').split('\n')
  data.forEach((contact, index) => {
    let [ name, email ] = contact.split(',')
    addEntry(name, email)
  })
  } else {
    console.log("File Doesn\'t Exist. Creating new file.")
    fs.writeFile(filename, '', (err) => {
      if (err) {
        console.log(err)
      }
    })
  }*/
}

// Obtener las facturas del API
const getInvoices = () => {
  $.ajax('http://35.196.121.8/api/index').then((data) => {
    console.log(data, new Date())
    loadAndDisplayInvoices(data.data)
  });
}

// Crea intervalo de 3 min para consultar el API
const start = () => {
  intervalId = setInterval(function() {
    getInvoices();
  }, 30000);
}

// Elimina el intervalo
const stop = () => {
  clearInterval(intervalId)
}

//loadAndDisplayInvoices()
