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
3. Use the `--endpoints` flag when starting the Rasa server (recommended commands: `rasa run -m models_nice --enable-api --cors "*" --endpoints endpoints.yml --debug` for the normal bot and `rasa run -m models_troll --enable-api --cors "*" --endpoints endpoints.yml -p 5006 --debug` for the troll bot).

### Using the tracker store in MongoDB Atlas cloud service

1. Already up and running. For more information on MongoDB Atlas, see our [MongoDB Atlas guide](MongoDB%20Atlas%20guide.md) and the [MongoDB Atlas documentation](https://docs.atlas.mongodb.com/) at mongodb.com.
2. Config provided separately.
3. Use the `--endpoints` flag when starting the Rasa server (recommended commands: `rasa run -m models_nice --enable-api --cors "*" --endpoints endpoints.yml --debug` for the normal bot and `rasa run -m models_troll --enable-api --cors "*" --endpoints endpoints.yml -p 5006 --debug` for the troll bot).

## Logger

Create log files by running the command `npm run log` in the backend folder. This generates CSV-format log files in the `logs` folder. Log files use the following name format:

`log_[room]_[file creation time (DDMMYYYY_HHmmss)]`

### Parameters

The behavior of the logger can be altered with parameters by using `npm run log -- --parameter` for one parameter or `npm run log -- --parameter1 --parameter2` etc. for multiple parameters. 

NOTE: Parameters with invalid names are ignored.

**-\-atlas**

By default, `npm run log` generates csv log files based on the contents of the local MongoDb tracker store. Use the parameter `--atlas` to generate csv logs based on the conversations stored in the MongoDB Atlas cloud.

**-\-room**

By default, `npm run log` generates csv logs for all conversations found in the tracker store. To generate a csv log for only one room, use the parameter `--room` followed by a space and the room name.

Example: To generate a csv log for the room *Testroom*, run `npm run log -- --room Testroom`.

**-\-data**

By default, log writer's story matcher uses the stories.yml and rules.yml in the data folder associated with the conversation's bot type. The type is chosen when creating a new room via admin tools. Using the `--data` parameter overrides the automatic data folder determination with a specified folder.

Example: To generate csv logs from a local tracker store when the bot was trained with the data folder `example_data`, run `npm run log -- --data example_data`.

**-\-delete**

When using the `--delete` parameter, instead of writing csv files, the application will delete all conversation histories from the tracker store. Individual conversations can be deleted by specifying a room with the `--room` parameter.

Example: To delete the tracker store conversation history for room *Testroom*, run `npm run log -- --room Testroom --delete`.

*WARNING!* Tracker store conversation histories contain all of the raw conversation data saved by Rasa and deletion is not advised unless backups have been made. Only use if:

a) The room is used for testing where storing the history is irrelevant.

or

b) A backup has been made of the MongoDB tracker store conversation document.

**-\-list**

Using the parameter `--list` will print a list of the conversation histories stored in the tracker store. **No csv files are written and** `--delete` **and** `--room` **parameters are ignored**. 

Example: To list conversation histories in the MongoDB Atlas cloud tracker store, run `npm run log -- --atlas --list`.

### Web GUI logger functionality

The Web User Interface features a limited version of the command line logger functionality. Working requires TRACKER_STORE_URL environment variable value to match the tracker store url used in the Rasa `endpoints.yml` file.

![Rooms list with log buttons](images/gui_log_gen.png)

**GENERATE LOG**: Fetches the corresponding conversation history from Rasa's tracker store database and creates a csv log of it in the `logs` folder.

**DELETE FROM TRACKER STORE**: Deletes the corresponding conversation history from Rasa's tracker store database. 

Note: Joining a room after conversation history deletion starts a new conversation which is saved in the tracker store under the same name. The old chat messages are still displayed in the room until Trollbot server is restarted, but have no effect on the bot's behavior.

*WARNING!* Once deleted from the tracker store, the conversation history cannot be recovered. Only click if:

a) The room is used for testing where storing the history is irrelevant.

or

b) A backup has been made of the MongoDB tracker store conversation document.

**GENERATE LOGS FOR ALL CURRENT ROOM**: Same as **GENERATE LOG** but for all rooms on the list.

**GENERATE LOGS FOR ALL TRACKER STORE CONVERSATIONS**: Same as the above but includes conversation histories for the rooms used during previous server runs. 

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

NOTE: Only slots whose values alter story paths (e.g. `task_activated`) are used in story matching. If more such slots are introduced, their names must be added to the storyAlteringSlots array in `logFormatter.js` for corresponding story steps to be generated.

The story matcher reads the log row by row and every time a story step tag is encountered, the following actions are taken:

1. The story step is compared with a list of possible stories.
	- If a story does not contain the story step, it is removed from the list.
	- If a story does contain the story step, the corresponding step under the story is marked as matched and cannot be matched again until the list of possible stories is refreshed

2. If the list of possible stories is now empty, the list is refreshed and 1. is repeated.

3. The names of possible stories are written under the stories column next to the story step.

## Updating and debugging the logger

Future changes in the Rasa training files and Trollbot backend may require updating the log formatting and story matching functionality to reflect them.

Logger files can be found in the `backend/services/eventLogger/` folder and are as follows:

`logWriterService.js` - Handles the tracker store database operations and the writing of csv files.
`logFormatter.js` - Turns the tracker store events into a human readable format, assigns event source and story step tags.
`storyMatcher.js` - Matches story steps with the ones found in the stories and rules files.
`yamlReader.js` - Used by the story matcher to read stories.yml and rules.yml files.

### logFormatter.js

The functions housed in logFormatter.js determine how different types of events appear on the csv log.

For csv log formatting and story matching to work correctly, the names of specific types of events need to be placed in the arrays found in this file.

**backendEvents**: This array is used to differentiate events appended to the tracker by Trollbot backend from those generated by Rasa. On the backend side, this event appending is handled by `rasaService.js` found in the `backend/services` folder.

**ignored events**: Events placed in this array are hidden from the csv log. 

**storyAlteringSlots**: Some Rasa slots alter story paths, meaning that different stories will be followed based on the values of these slots. When new story altering slots are introduced in Rasa, their names must also be placed here for story matching to work correctly.

For example, the slot `task_activated` is story altering. Its value is set to `true` after the task to select the best artist has been introduced. As a result, story paths requiring the `task_activated` slot to be set to `false` will no longer be followed.

