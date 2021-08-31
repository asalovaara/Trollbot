

## Guide to the frontend/backend interface

### HTTP

The frontend uses HTTP connections over the Axios library to connect to the backend in order to   get all the currently existing messages for a given room, get all the currently existing users for a given room, and to manage login status. Fetching functionality is implemented in `services/socket.js`, in functions `getRoomMessages()` and `getRoomUsers()`, respectively. Login functionality is implemented in `loginRouter.js`, in functions `login()` and `logout()`. 

### WebSocket

Persistent connections to between the frontend and the backend are implemented using WebSockets. This allows for real-time conversation updates and re-establishing connection automatically in the event of server failure. The project uses the Socket.IO library to manage WebSockets. Server-side functionality is handled in `socketRouter.js`, and client-side functionality is implemented in `chat.js`. Information is communicated between the frontend and backend using Socket.IO events involving things like notifying the server when the user is typing or sends a message, and then emitting these events to all other connected clients. Each conversation room has its own set of connected clients, recorded messages, and on the Rasa side, its own tracker. Once a user closes a connection, they are removed from the room to which they belong. 
