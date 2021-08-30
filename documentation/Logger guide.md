# Guide to using the logger feature to create logs of conversations

## Setting up the MongoTrackerStore for Rasa

Rasa's conversation data must be stored within a MongoDB database. This is done by:

1. Running a MongoDB database either locally or remotely.
2. Configuring Rasa to use a [MongoTrackerStore](https://rasa.com/docs/rasa/tracker-stores/#mongotrackerstore).
3. Always starting the Rasa server with the `--endpoints` flag.

### Using a local tracker store

1. [Instructions for installing and running MongoDB locally.](https://docs.mongodb.com/manual/administration/install-community/)
2. The configuration for the tracker store can be found in the `endpoints.yml` file of the `backend/rasa` folder. For the local MongoTrackerStore, use: 

```YAML
tracker_store:
  type: mongod
  url: mongodb://localhost:27017
  db: Trollbot
  username:
  password:
  ```
3. Use the `--endpoints` flag when starting the Rasa server (recommended command: `rasa run --enable-api --cors "*" --endpoints endpoints.yml --debug`).

### Using the tracker store in MongoDB Atlas cloud service

1. Already up and running. For more info on MongoDB Atlas, see https://docs.atlas.mongodb.com/.
2. Config provided separately.
3. Use the `--endpoints` flag when starting the Rasa server (recommended command: `rasa run --enable-api --cors "*" --endpoints endpoints.yml --debug`).

## Logger

Create log files by running the command `npm run log` in the backend folder. This generates CSV-format log files in the `logs` folder. The behavior of the logger can be altered with parameters by using `npm run log -- --parameter` for one parameter or `npm run log -- --parameter1 --parameter2` etc. for multiple parameters. 

NOTE: Parameters with invalid names are ignored.  

### Parameters

**-\-atlas**

By default, `npm run log` generates csv log files based on the contents of the local MongoDb tracker store. Use the parameter `--atlas` to generate csv logs based on the conversations stored in the MongoDB Atlas cloud.

**-\-room**

By default, `npm run log` generates csv logs for all conversations found in the tracker store. To generate a csv log for only one room, use the parameter `--room` followed by a space and the room name.

Example: To generate a csv log for the room *Testroom*, run `npm run log -- --room Testroom`.

**-\-delete**

When using the `--delete` parameter, instead of writing csv files, the application will delete all conversation histories from the tracker store. Individual conversations can be deleted by specifying a room with the `--room` parameter.

Example: To delete the tracker store conversation history for room *Testroom*, run `npm run log -- --room Testroom --delete`.

*WARNING!* Tracker store conversation histories contain all of the raw conversation data saved by Rasa and deletion is not advised unless backups have been made. This option was mainly added for removing test room conversation histories from the tracker store.

**-\-list**

Using the parameter `--list` will print a list of the conversation histories stored in the tracker store. **No csv files are written and** `--delete` **and** `--room` **parameters are ignored**. 

Example: To list conversation histories in the MongoDB Atlas cloud tracker store, run `npm run log -- --atlas --list`.

## Log contents

### Log fields explained

`timestamp` Rasa timestamps are in [Unix epoch time](https://www.epoch101.com/). For better human-readability, the timestamps are converted to local time (dd.mm.yyyy hh.mm.ss).

`event` The triggered event, e.g. bot or user utterance.

`name` The name of the triggered event. For slots, both slot name and the value are written. For slots housing objects (i.e. users and artists), only changes in object property values are written.

`event source` Indicates whether the the event was generated on the Rasa server or added to the tracker by Trollbot backend (rasaService.js).

`userID` The unique id identifying a user.

`username` The username of the user who sent the message, if the event is a message.

`message` The text content of the message, if the event is a message.

`policy`  [The policy](https://rasa.com/docs/rasa/policies/) that Rasa used to determine this event.

`confidence` The confidence with which Rasa decided that this is the correct event to trigger in this situation.

`interpreted intent` The intent Rasa interpreted for the user's last message. For example, opening, if the user said "Hello".

`story step` Used for story matching, story step names link events to story steps found in stories.yml.

`story` Possible stories Rasa is currently following.

`rule` Possible rules Rasa is currently following

### Story matching explained

Certain tracker events suchs as user intents, bot responses and custom actions can be directly linked to steps found in Rasa's stories training data found in stories.yml. To estimate which of the stories the bot is likely following at any given point, these events are tagged with the names of their training data counterparts.

Different event types use different fields in detemining the story step name:

event: `user uttered` interpreted intent: `example_intent`  story step: `intent: example_intent` stories.yml step: `intent: example_intent`

event: `triggered Rasa custom action` name: `action: action_example_custom_action` story step:`action: action_example_custom_action` stories.yml step: `-action: action_example_custom_action`

event: `triggered bot response` name: `response: utter_example_phrase` story step: `action: utter_example_phrase` stories.yml step: `- action: utter_example_phrase`

event: `slot value was set` field: `slot: example_slot | example_value` story step: `example_slot: example_value` stories.yml step: `- slot was set: - example_slot: example_value`

NOTE: Only slots whose values alter story paths (e.g. `task_activated`) are used in story matching. If more such slots are introduced, their names must be added to the storyAlteringSlots array in logFormatter.js for corresponding story steps to be generated.

The story matcher reads the log row by row and every time a story step tag is encountered, the following actions are taken:

1. The story step is compared with a list of possible stories.
	- If a story does not contain the story step, it is removed from the list.
	- If a story does contain the story step, the corresponding step under the story is marked as matched and cannot be matched again until the list of possible stories is refreshed

2. If the list of possible stories is now empty, the list is refreshed and 1. is repeated.

3. The names of possible stories are written under the stories column next to the story step.

## Updating the logFormatter

Correct formatting of new custom actions and slots may require manually updating the `logFormatter.js` located in the `backend/services/eventLogger` folder.