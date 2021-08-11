import { useState } from 'react'

export const useField = (type, defaultValue) => {
  const [value, setValue] = defaultValue ? useState(defaultValue) : useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  const clear = (event) => {
    event.preventDefault()
    setValue('')
  }

  return {
    type,
    value,
    onChange,
    clear
  }
}