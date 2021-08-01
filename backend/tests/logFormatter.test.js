const formatter = require('../services/eventLogger/logFormatter')

let defaultActionEvent
let responseEvent
let customActionEvent
let userEvent
let botEvent
let slotEvent
let ignoredEvent

beforeEach(() => {
  defaultActionEvent = {
    event: 'action',
    timestamp: 1627495215.7365131,
    name: 'action_listen',
    policy: null,
    confidence: null,
    action_text: null,
    hide_rule_turn: false
  }

  responseEvent = {
    event: 'action',
    timestamp: 1627495216.009964,
    name: 'utter_test_response',
    policy: 'policy_0_MemoizationPolicy',
    confidence: 1,
    action_text: null,
    hide_rule_turn: false
  }

  customActionEvent = {
    event: 'action',
    timestamp: 1627495232.4870965,
    name: 'action_test_custom_action',
    policy: 'policy_2_TEDPolicy',
    confidence: 0.9988882541656494,
    action_text: null,
    hide_rule_turn: false
  }

  userEvent = {
    event: 'user',
    timestamp: 1627495216.0048747,
    text: 'testing testing',
    parse_data: {
      intent: {
        name: 'test_intent',
        confidence: 0.999884843826294
      },
    },
    input_channel: 'rest',
    message_id: '0a5ec7805cb746a0912b09df951ff3e7',
    metadata: {}
  }

  botEvent = {
    event: 'bot',
    timestamp: 1627495216.0099986,
    metadata: { utter_action: 'utter_bot_test' },
    text: 'This is a test phrase.',
    data: {
      elements: null,
      quick_replies: null,
      buttons: null,
      attachment: null,
      image: null,
      custom: null
    }
  }

  slotEvent = {
    event: 'slot',
    timestamp: 1627495216.0241756,
    name: 'test_passed',
    value: true
  }

  ignoredEvent = {
    event: 'user_featurization',
    timestamp: 1627495216.0099509,
    use_text_for_featurization: false
  }
})

test('correctly formats default action event', () => {
  const formattedEvent = formatter.formatEvent(defaultActionEvent)
  expect(formattedEvent.event).toEqual('triggered Rasa default action')
  expect(formattedEvent.name).toEqual('action: action_listen')
})

test('correctly formats custom action event', () => {
  const formattedEvent = formatter.formatEvent(customActionEvent)
  expect(formattedEvent.event).toEqual('triggered custom action')
  expect(formattedEvent.name).toEqual('action: action_test_custom_action')
})

test('correctly formats response event', () => {
  const formattedEvent = formatter.formatEvent(responseEvent)
  expect(formattedEvent.event).toEqual('triggered bot response')
  expect(formattedEvent.name).toEqual('response: utter_test_response')
})

test('correctly formats slot event', () => {
  const formattedEvent = formatter.formatEvent(slotEvent)
  expect(formattedEvent.event).toEqual('slot value was set')
  expect(formattedEvent.name).toEqual('slot: test_passed | value: true')
})

test('correctly formats user utterance', () => {
  const formattedEvent = formatter.formatEvent(userEvent)
  expect(formattedEvent.event).toEqual('user uttered')
  expect(formattedEvent.intent).toEqual('test_intent')
})

test('correctly formats bot utterance', () => {
  const formattedEvent = formatter.formatEvent(botEvent)
  expect(formattedEvent.event).toEqual('bot uttered')
})

test('correctly formats timestamp', () => {
  const formattedEvent = formatter.formatEvent(defaultActionEvent)
  expect(formattedEvent.timestamp).toEqual('28/07/2021, 21:00:15')
})

test('removes ignored events from the log', () => {
  const arr = [ignoredEvent, defaultActionEvent, ignoredEvent]
  const trimmedArr = formatter.removeIgnoredEvents(arr)
  expect(trimmedArr.length).toEqual(1)
  expect(trimmedArr[0].event).toEqual('action')
})

