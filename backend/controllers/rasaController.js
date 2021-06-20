const axios = require('axios')

async function getRasaResponse() {
    const response = await axios.get('http://localhost:5005/')
    console.log(`response: ${response.data}`)
    return response.data


}

exports.getRasaResponse = getRasaResponse;