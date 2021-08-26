# Guide for deploying this project

### Requirements

This application requires Python, Node.js, npm and rasa to run.

 - (Node.js and npm installation guide)[https://docs.npmjs.com/downloading-and-installing-node-js-and-npm]
 - (Python downloads)[https://www.python.org/downloads/]
 - (Rasa installation guide)[https://rasa.com/docs/rasa/installation]

### Setting things up

First, you need to install all the app dependancies. This is done by running the command "npm install" in both frontend and backend directories.
Next, you should run the command "npm run build" in the backend directory. If succesful, there should now be a directory called "build" in the backend directory.

If you now run the command "npm start", you should get a message "Server running in port: 3001". You should see the application running in browser at localhost:3001.
If everything is working thus far, we can move on.

### Setting up the rasa servers

Rasa's directory can be found in the "backend" directory. First we need to train an AI model for rasa to use. This can be done by running the command "rasa train". After the model has been trained, it appears in the "models" directory.
Next, you need to start the rasa server. There are two servers that need to be running simultaneously, the main rasa server and an action server. The main server can be started with the command "rasa run --enable-api --cors "*"", and the action server can be started with the command "rasa run actions".

If there are any need for making any changes to rasa deployment, please consult the rasa-guide.


### .env-file

There are some environment variables that cannot be publicly avalible, se they are stored in an .env-file intead. Just create a file with the name ".env" in the project root. Each line in this file should define an environment variable. The following environment variables should be contained in this file:

 - MONGODB_URI: MONGODB_URI defines the location of the MongoDB database. As this has connected to a database in a cloud server, it contains the username and password of the account used. Please consult MongoDB-documentation on the exact content for this field.


### Deploying with docker

Another way to deploy the application is by using Docker. Docker has the advantage in the fact that you do not need to have all the dependencies installed locally in order to run the application. It also allows you to control the environment in which the app runs in. 
It can be a bit difficult to use in developement though. Building an image takes some time, so a small change can become an hour-long wait. Regardless, Docker can be useful when there is a need to get the application running quickly or there is a need to control the environment the application runs in.

(Docker installation guide can be found here)[https://docs.docker.com/engine/install/#desktop]. 

First, you should edit the Dockerfiles and docker-compose.yml to match the environment you want to run your application in. Guide on how to do this can be found in the Docker guide.

To build the application into docker images, run "docker-compose build". After the application has been buildt, you can start a docker container with the command "docker-compose up".
By default the application runs in port 3001.

### Socket considerations

This application uses a socket to move information between the front- and backends. In some cases, such as if you are using a proxy like nginx, it may be useful to know about socket implementation in this app.
This app uses Node.js Socker.io library. As such, the frontend connects to the backend by sending an upgrade request. This request goes to the address "DOMAINNAME/socket.io". 
If your environment has special considerations for the use of sockets, please look for guides specific to that environment.