import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import TextInput from '../components/TextInput'

test('Renders correctly', () => {
  const component = render(<TextInput />)
  expect(component.container).toHaveTextContent('Type message')
})