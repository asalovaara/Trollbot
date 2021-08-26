const formatter = require('../services/eventLogger/logFormatter')

let defaultActionEvent
let responseEvent
let customActionEvent
let userEvent
let botEvent
let slotEvent
let ignoredEvent
let usersEvent1
let usersEvent2
let artistsEvent1
let artistsEvent2

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

  usersEvent1 = {
    event: 'slot',
    timestamp: 1628705618.6094000,
    name: 'users',
    value: {
      '5i-abcdefghijklmnopq': {
        id: '753fd7c8-a973-4333-a6b5-085b9107ddc1',
        senderId: '5i-abcdefghijklmnopq',
        name: 'Tester1',
        room: 'testroom'
      }
    }
  }

  usersEvent2 = {
    event: 'slot',
    timestamp: 1628705618.6094093,
    name: 'users',
    value: {
      '5i-abcdefghijklmnopq': {
        id: '753fd7c8-a973-4333-a6b5-085b9107ddc1',
        senderId: '5i-abcdefghijklmnopq',
        name: 'Tester1',
        room: 'testroom'
      },
      '6i-jklmnopqrstuvwxyz': {
        id: '753fd7c8-a973-4333-a6b5-085b9107ddc2',
        senderId: '6i-jklmnopqrstuvwxyz',
        name: 'Tester2',
        room: 'testroom'
      }
    }
  }

  artistsEvent1 = {
    event: 'slot',
    timestamp: 1629147874.8944200,
    name: 'artists',
    value: {
      Testband1: { genre: 'pop' },
    }
  }

  artistsEvent2 = {
    event: 'slot',
    timestamp: 1629147874.8944395,
    name: 'artists',
    value: {
      Testband1: { genre: 'pop' },
      Testband2: { genre: 'metal' },
    }
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
  expect(formattedEvent.name).toEqual('slot: test_passed | true')
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
  const date = new Date(Date.UTC(2021, 6, 28, 18, 0, 15)).toLocaleString()
  expect(formattedEvent.timestamp).toEqual(date)
})

test('correctly formats users object updates', () => {
  const formattedEvent1 = formatter.formatEvent(usersEvent1)
  const formattedEvent2 = formatter.formatEvent(usersEvent2)
  expect(formattedEvent1.name).toEqual('slot: users | 5i-abcdefghijklmnopq: {"id":"753fd7c8-a973-4333-a6b5-085b9107ddc1","senderId":"5i-abcdefghijklmnopq","name":"Tester1","room":"testroom"}')
  expect(formattedEvent2.name).toEqual('slot: users | 6i-jklmnopqrstuvwxyz: {"id":"753fd7c8-a973-4333-a6b5-085b9107ddc2","senderId":"6i-jklmnopqrstuvwxyz","name":"Tester2","room":"testroom"}')
})

test('correctly formats artists object updates', () => {
  const formattedEvent1 = formatter.formatEvent(artistsEvent1)
  const formattedEvent2 = formatter.formatEvent(artistsEvent2)
  expect(formattedEvent1.name).toEqual('slot: artists | Testband1: {"genre":"pop"}')
  expect(formattedEvent2.name).toEqual('slot: artists | Testband2: {"genre":"metal"}')
})

test('removes ignored events from the log', () => {
  const arr = [ignoredEvent, defaultActionEvent, ignoredEvent]
  const trimmedArr = formatter.removeIgnoredEvents(arr)
  expect(trimmedArr.length).toEqual(1)
  expect(trimmedArr[0].event).toEqual('action')
})

