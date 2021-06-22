const axios = require('axios')
const {inspect} = require('util')
async function getRasaRESTResponse(message) {
    const response = await axios.post('http://localhost:5005/webhooks/rest/webhook', {
        "sender": "test_user",
        "message": message
    })
    console.log(`response: ${inspect(response.data[0].text)}`)
    return response.data[0].text


}

exports.getRasaRESTResponse = getRasaRESTResponse;