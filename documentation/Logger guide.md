# Guide to using the logger feature to create logs of conversations

## Basic usage

### The database

All conversation steps are stored in a MongoDb database in real time by the [Rasa tracker](https://rasa.com/docs/rasa/tracker-stores/). The configurations for this can be found in the ```endpoints.yml``` file of the rasa folder.

### The logger

Create a log file by running the command ```npm run log``` in the backend folder. This generates a CSV-format log file in the logs folder. 

## Log contents

### Log fields explained

```timestamp``` Rasa timestamps are in [Unix epoch time](https://www.epoch101.com/). For better human-readability, the timestamps are converted to local time (dd.mm.yyyy hh.mm.ss).<br>
```event``` The triggered event, e.g. bot or user utterance. <br>
```name``` <br>
```event source``` <br>
```userID``` <br>
```username``` The username of the user who sent the message, if the event is a message. <br>
```message``` The text content of the message, if the event is a message. <br>
```policy``` [The policy](https://rasa.com/docs/rasa/policies/) that Rasa used to determine this event. <br>
```confidence``` The confidence with which Rasa decided that this is the correct event to trigger in this situation. <br>
```interpreted intent``` The intent that Rasa interpreted for the user's last message. For example, opening, if the user said "Hello". <br>
```story step``` <br>
```story``` The story that Rasa is currently following. <br>
```rule``` <br>
