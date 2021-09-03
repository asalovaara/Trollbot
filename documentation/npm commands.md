

## npm command reference

All npm commands are run with the command "npm run COMMAND".


### Backend


#### start

Starts the application in production mode

#### dev

Starts the application in developement mode

#### log

Generates logs for rooms. Further details in Logger guide. 

Parametres:

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

*WARNING!* Tracker store conversation histories contain all of the raw conversation data saved by Rasa and deletion is not advised unless backups have been made. This option was mainly added for removing test room conversation histories from the tracker store.

**-\-list**

Using the parameter `--list` will print a list of the conversation histories stored in the tracker store. **No csv files are written and** `--delete` **and** `--room` **parameters are ignored**. 

Example: To list conversation histories in the MongoDB Atlas cloud tracker store, run `npm run log -- --atlas --list`.


#### add-artists

Fetches data of artists listed in backend/data/artists.txt -file from musicbrainz.

#### build

Creates a production build of the application. Required to be run first when running the application in production mode.

#### clean

Removes the production build

#### test

Runs automated tests.



### Frontend


#### start

Starts a frontend server

#### build

Builds a production build.

#### test

Runs automated tests for the frontend

