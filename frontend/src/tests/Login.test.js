import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Login from '../components/groupchat/Login'

test('Renders correctly', () => {
  localStorage.setItem('prolific_pid', 'TestDummyValue')
  const component = render(<Login />)
  expect(component.container).toHaveTextContent('Username')
})