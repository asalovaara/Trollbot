# Guide for deploying this project

### Requirements

This application requires Python, Node.js, npm and rasa to run.

 - [Node.js and npm installation guide](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
 - [Python downloads](https://www.python.org/downloads)
 - [Rasa installation guide](https://rasa.com/docs/rasa/installation)

### Setting things up

First, install all the app dependancies. This is done by running the command "npm install" in both frontend and backend directories.
Next, run the command "npm run build" in the backend directory. If succesful, there should now be a directory called "build" in the backend directory.

Now running the command "npm start", the message "Server running in port: 3001" should appear in the terminal. The application should now running in browser at localhost:3001.

If building through the backend fails, the command can be run in the frontend directory and move the build directory to the backend directory manually.

### Setting up the rasa servers

The actual chatbot is based on rasa. Rasa runs a server separate from the main application, so you need to open more terminals for it. Rasa has three servers. A nice bot server, a troll bot server and an action server. 

Rasa's directory can be found in the "backend" directory. First rasa needs a trained AI models. 
Both bots need seperate models. The nice bot model is trained with the command "rasa train --data data_nice --out models_nice". The troll bot model is trained with the command "rasa train --data data_troll --out models_troll"

After the models have been trained, they appear in their respective "models" directories.

Next the rasa servers can be started. 
The nice bot server can be started with the command "rasa run -p 5005 -m models_nice --enable-api --cors "*"". 
The troll bot server can be started with the command "rasa run -p 5006 -m models_troll --enable-api --cors "*"". 
The action server can be started in a separate terminal with the command "rasa run actions".

If there are any need for making any changes to rasa deployment, please consult the rasa guide.


### .env-file

There are some environment variables that cannot be publicly avalible, se they are stored in an .env-file intead. Create a file with the name ".env" in the project root. Each line in this file should define an environment variable. The following environment variables should be contained in this file:

 - MONGODB_URI: MONGODB_URI defines the location of the MongoDB database. As this has connected to a database in a cloud server, it contains the username and password of the account used. Please consult MongoDB-documentation on the exact content for this field.

 - CLIENT_ID and CLIENT_SECRET: These variables are for using Spotify's API. To set these values, a Spotify account is needed. This account is then linked to Spotify for Developers, where the values of these variables are generated. 
 

### Deploying with docker

Another way to deploy the application is by using Docker. Docker has the advantage in the fact that you do not need to have all the dependencies installed locally in order to run the application. It also allows for control over the environment in which the app runs in. 
It can be a bit difficult to use in developement though. Building an image takes some time, so a small change can become an hour-long wait. Regardless, Docker can be useful when there is a need to get the application running quickly or there is a need to control the environment the application runs in.

[Docker installation guide can be found here](https://docs.docker.com/engine/install/#desktop). 

First the Dockerfiles and docker-compose.yml have to be edited to match the environment the application will be running in. All information regarding configuring docker is found in the Docker guide.

To build the application into docker images, run "docker-compose build". After the application has been built, they can be run in a docker container with the command "docker-compose up".
By default the application runs in port 3001.

### Socket considerations

This application uses a socket to move information between the front- and backends. In some cases, such as when using a proxy like nginx, it may be useful to know about socket implementation in this app.
This app uses Node.js Socker.io library. As such, the frontend connects to the backend by sending an upgrade request. This request goes to the address "DOMAINNAME/socket.io".

Issues with the socket are generally seen in lack of response on the server to actions and lack some elements in the client.
