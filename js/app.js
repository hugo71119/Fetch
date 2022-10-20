const criptoSelect = document.querySelector('#criptomoneda')
const monedaSelect = document.querySelector('#moneda')
const formulario = document.querySelector('#formulario')
const resultadoHTML = document.querySelector('#resultado')


const objCriptos = {
    moneda: '',
    criptomoneda: ''
}
const obtenerCriptos = criptos => new Promise( resolve => {
    resolve(criptos)
})

document.addEventListener('DOMContentLoaded', () => {
    consultarCriptos()
    formulario.addEventListener('submit', submitForm)
    criptoSelect.addEventListener('change', leerValor)
    monedaSelect.addEventListener('change', leerValor)
})

function consultarCriptos() {
    const url = 'https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD'

    fetch(url)
        .then(respuesta => respuesta.json())
        .then(resultado => obtenerCriptos(resultado.Data))
        .then( criptos => selectCriptos(criptos))
}

function selectCriptos(criptos) {
    criptos.forEach(cripto => {
        const { FullName, Name } = cripto.CoinInfo;

        const option = document.createElement('option')
        option.value = Name
        option.textContent = FullName
        criptoSelect.appendChild(option)
    });
}

function leerValor(e){
    objCriptos[e.target.name] = e.target.value
    console.log(objCriptos)
}

function submitForm(e){
    e.preventDefault()

    const {moneda, criptomoneda} = objCriptos
    if (moneda === '' || criptomoneda === '') {
        alertaError('Ambos campos son obligatorios')
        return
    }

    consultarAPI()
}

function alertaError(msg){
    const errorExistente = document.querySelector('.error')

    if (!errorExistente) {
        const alerta = document.createElement('div')
        alerta.classList.add('bg-danger', 'text-center', 'text-light', 'py-3', 'fs-3', 'error')
        alerta.textContent = msg
        formulario.appendChild(alerta)
    
        setTimeout(() => {
            alerta.remove()
        }, 3000);
    }
}

function consultarAPI(){
    const { moneda, criptomoneda } = objCriptos

    const url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`

    fetch(url)
        .then( respuesta => respuesta.json() )
        .then( cotizacion => {
            mostrarResultado(cotizacion.DISPLAY[criptomoneda][moneda])
        })
}

function mostrarResultado(resultado) {
    limpiarPantalla()

    const { PRICE, CHANGEPCT24HOUR, LASTUPDATE } = resultado;

    // console.log(PRICE)

    const precio = document.createElement('p')
    precio.classList.add('fs-3')
    precio.innerHTML = `El precio es: <span class="fw-bold">${PRICE} ${objCriptos.moneda}</span>`

    const ultimaHora = document.createElement('p')
    ultimaHora.innerHTML = `Variacion de las ultimas 24 horas: <span class="fw-bold">${CHANGEPCT24HOUR}</span>`

    const actualizacionFinal = document.createElement('p')
    actualizacionFinal.innerHTML = `<p>Ultima Actualizacion <span class="fw-bold">${LASTUPDATE}</span></p>`

    resultadoHTML.appendChild(precio)
    resultadoHTML.appendChild(ultimaHora)
    resultadoHTML.appendChild(actualizacionFinal)
}

function limpiarPantalla() {
    while(resultadoHTML.firstChild){
        resultadoHTML.removeChild(resultadoHTML.firstChild)
    }
}