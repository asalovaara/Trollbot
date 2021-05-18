import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Message from '../components/Message'

test('Renders correctly', () => {
  const message = {
    id: 123,
    date: '1.1.2021',
    user: 'Human',
    body: 'Test message'
  }
  const component = render(<Message messageObject={message} />)

  expect(component.container).toHaveTextContent('1.1.2021')
  expect(component.container).toHaveTextContent('Human')
  expect(component.container).toHaveTextContent('Test message')
})
