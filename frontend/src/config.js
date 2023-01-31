export const TITLE = process.env.REACT_APP_WEBSITE_NAME || 'Web-site Placeholder Name'
export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api'
export const SOCKET_SERVER_URL = process.env.REACT_APP_SOCKET_SERVER_URL || ''
export const SOCKET_ENDPOINT = process.env.REACT_APP_SOCKET_ENDPOINT || 'localhost:3001'

// Make sure to match bot type position with the corresponding port position
export const BOT_TYPES = [  'Normal', 'Troll',   ]
export const BOT_PORTS = [   5005,     5006,     ]