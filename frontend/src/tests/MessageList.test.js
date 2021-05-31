import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import MessageList from '../components/MessageList'

test('Renders correctly', () => {
  const messages = [{
    id: 1,
    date: '1.1.2021',
    user: 'Human',
    body: 'Test message'
  },
  {
    id: 2,
    date: '1.1.2021',
    user: 'Human',
    body: 'Test message 2'
  }]
  const component = render(<MessageList messages={messages} />)
  expect(component.container).toHaveTextContent('1.1.2021')
  expect(component.container).toHaveTextContent('Human')
  expect(component.container).toHaveTextContent('Test message')
  expect(component.container).toHaveTextContent('Test message 2')
})