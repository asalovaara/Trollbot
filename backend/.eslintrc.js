module.exports = {
  'env': {
    'node': true,
    'commonjs': true,
    'jest/globals': true,
    'cypress/globals': true,
    'es2021': true
  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaVersion': 12
  },
  'rules': {
    'indent': [
      'error',
      2
    ],
    'linebreak-style': 0,
    'quotes': [
      'error',
      'single'
    ],
    'semi': [
      'error',
      'never'
    ]
  },
  'plugins': [
    'jest', 'cypress'
  ]
}
