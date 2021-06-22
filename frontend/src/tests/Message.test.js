import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Message from '../components/Message'

test('Renders correctly', () => {
  const message = {
    id: 123,
    date: '1.1.2020',
    user: 'Human',
    body: 'Test message'
  }

  const component = render(
  <Message
    message={message.body}
    timestamp={message.date}
    photoURL=''
    displayName={message.user}
    avatarDisp=''
    position={message.user}
  />)
  expect(component.container).toHaveTextContent('00:00')
  expect(component.container).toHaveTextContent('Human')
  expect(component.container).toHaveTextContent('Test message')
})
