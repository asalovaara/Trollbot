# Backend and Rasa guide

In this guide, the communication that happens between the backend and Rasa is briefly explained. Here, “backend” means the files and functionality in the backend folder except for the rasa folder, and “Rasa” means the files and functionality in the backend/rasa folder, mainly in the actions.py file.

Communication between the backend and Rasa goes two ways: backend gets the bot answer from Rasa by sending a request to the Rasa endpoint, and Rasa gets the genre information required in the conversation by sending a request to the backend api location.

Requests from the backend to the Rasa endpoint are made in backend/services/rasaService, and calls from Rasa to the backend are made in rasa/actions.py.

## Getting the bot answer from Rasa

In socketRouter() class in backend/controllers, when the socket receives the SEND_MESSAGE_TO_BOT_EVENT (emitted from the frontend), function getAnswer() from services/messagesService is called. GetAnswer() then calls the function sendMessageToRasa() from services/rasaService.

SendMessageToRasa() posts a request to the address RASA_ENDPOINT/webhooks/callback/webhook, where RASA_ENDPOINT is defined as an environment variable. The return value for this function is the bot answer from Rasa, which is also then returned by the getAnswer() function.

We configured Rasa to use the callback implementation instead of REST. This configuration is made in the rasa/credentials.yml file. More information [here](https://rasa.com/docs/rasa/connectors/your-own-website/)

## Setting the users and last message sender slots

In backend/rasaService(), requests to the Rasa tracker are utilized to set the users slot and the last message sender slot.

## Setting the genre slot

Rasa communicates with the backend through custom actions defined in backend/rasa/actions/actions.py. BACKEND_API_LOCATION is defined as an environment variable.

In function ActionSetGenreSlot() the genre for an artist is fetched through the backend api, by sending a get request to BACKEND_API_LOCATION/api/trollbot/genre/artist. This path is defined in the class backend/controllers/botRouter, and it calls the getArtistByName() function in databaseService with the artist name as its parameter.
