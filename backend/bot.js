


function botAnswer(message) {
    console.log('Entered bot:botAnswer.');
    console.log(`Message: ${message}`);
    if (message) {
        return "Sanoit: " + message;
    }
    return "Vastaus.";
}

exports.botAnswer = botAnswer;