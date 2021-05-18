import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Chat from '../components/Chat'

test('Renders correctly', () => {
  const component = render(<Chat />)
  expect(component.container).toHaveTextContent('Chat window')
})
