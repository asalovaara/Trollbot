import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
import MessageBox from '../components/MessageBox'

test('Renders correctly', () => {
  const component = render(<MessageBox />)
  expect(component.container).toHaveTextContent('Message')
  expect(component.container).toHaveTextContent('Send')
  expect(component.container).toHaveTextContent('Clear')
})

test('Form input and submit working correctly', () => {

  // https://jestjs.io/docs/mock-functions <-- info about Jest mocks 
  const setMessages = jest.fn()
  const component = render(<MessageBox messages={[]} setMessages={setMessages} />)

  const input = component.container.querySelector('input')
  const form = component.container.querySelector('form')

  fireEvent.change(input, {
    target: { value: 'Message text' }
  })
  fireEvent.submit(form)

  expect(setMessages.mock.calls).toHaveLength(1)
  const newMessage = setMessages.mock.calls[0][0][0]

  expect(newMessage.body).toBe('Message text')
  expect(newMessage.user).toBe('Human')
  expect(newMessage.id).toBe(1)
})

test('Clear button is working correctly', () => {
  const setMessages = jest.fn()
  const component = render(<MessageBox setMessages={setMessages} />)

  const button = component.getByText('Clear')
  fireEvent.click(button)

  // Checks that handler is called
  expect(setMessages.mock.calls).toHaveLength(1)
  // Checks that handler is given an empty array or 'cleared' array
  expect(setMessages.mock.calls[0][0]).toHaveLength(0)

})