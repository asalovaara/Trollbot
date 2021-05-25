import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import MessageBox from '../components/MessageBox'

test('Renders correctly', () => {
  const component = render(<MessageBox />)
  expect(component.container).toHaveTextContent('Message')
  expect(component.container).toHaveTextContent('Send')
  expect(component.container).toHaveTextContent('Clear')
})