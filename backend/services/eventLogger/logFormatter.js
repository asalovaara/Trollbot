const defaultActions = ['action_listen', 'action_restart', 'action_session_start', 'action_default_fallback', 'action_deactivate_loop', 'action_revert_fall', 'action_two_stage_fallback', 'action_default_ask_affirmation', 'action_default_ask_rephrase', 'action_back', 'action_unlikely_intent']

const ignoredEvents = ['user_featurization']

const formatTimestamp = (epoch) => {
    var utcSeconds = epoch
    var d = new Date(0)
    d.setUTCSeconds(utcSeconds)
    return d.toLocaleString()
}

const formatIntent = (obj) => {

    if (obj.parse_data !== undefined) {
        const intentName = obj.parse_data.intent.name
        obj.intent = intentName
    }

    return obj
}

const formatAction = (obj) => {

    if (defaultActions.includes(obj.name)) {
        obj.event = 'triggered Rasa default action'
        obj.name = 'action: ' + obj.name
    } else if (obj.name.includes('utter')) {
        obj.event = 'triggered bot response'
        obj.name = 'response: ' + obj.name
    } else {
        obj.event = 'triggered custom action'
        obj.name = 'action: ' + obj.name
    }

    return obj
}

const formatEvent = (obj) => {

    if (obj.event === 'action') {
        obj = formatAction(obj)
    } else if (obj.event === 'slot') {
        obj.event = 'slot value was set'
        obj.name = 'slot: ' + obj.name + ' | value: ' + obj.value
    } else if (obj.event === 'user') {
        obj.event = 'user uttered'
    } else if (obj.event === 'bot') {
        obj.event = 'bot uttered'
    } else if (obj.event === 'session_started') {
        obj.event = 'started new conversation session'
    }

    obj.timestamp = formatTimestamp(obj.timestamp)
    obj = formatIntent(obj)

    return obj
}

const removeIgnoredEvents = (arr) => {

    const trimmedArr = arr.filter(obj => !(ignoredEvents.includes(obj.event)))

    return trimmedArr

}

module.exports = {formatEvent, removeIgnoredEvents}