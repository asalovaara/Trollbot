# Guide to using, editing and configuring Docker for this project

### About Dockerfiles and docker-compose

There are two dockerfiles in this project. One is located in the project root, and the second in the rasa files, at \/backend/rasa.
The one in project root is responsible for creating the application server. The one in the rasa folder is responsible for building the rasa servers.

If any of the ports are changed, remember to also change the ports both in the main application's dockerfile and in rasa's dockerfile.

These dockerfiles and the images they create are managed with the docker-compose.yml file. It is located in the project root.

 
### Editing or changing the address subfolder Docker image deploys to

In this project, we have used Docker as part of our staging configuration. 
In our staging environment, Docker was used to help us maintain an up-to-date version of our program at all times.
Because of this, the current Docker configuration is for the specific needs of that staging server. As such, the main dockerfile has to be tailored to the intended use environment.

The following environment variables are used by the application:

PUBLIC_URL

API_URL

REACT_APP_API_URL

REACT_APP_SOCKET_SERVER_URL

REACT_APP_SOCKET_ENDPOINT

RASA_NETWORK

MONGODB_URI
 
TASK_COMPLETE_REDIRECT_TARGET 

Of these REACT_APP_API_URL, REACT_APP_SOCKET_SERVER_URL and REACT_APP_SOCKET_ENDPOINT have to be in the Dockerfile. The rest can either be in the dockerfile, docker-compose.yml file or .env file.


PUBLIC_URL defines the location of the app in relation to the domain. This value can contain either the entire URL of just the subfolder. If the application isn't deployed in a subfolder, it can be left out.

API_URL defines the server's api address, and REACT_APP_API_URL defines the api address that the client uses to connect to it. As such, they may have different content. If the application is not deployed in a subfolder, API_URL can be left out.

REACT_APP_SOCKET_SERVER_URL defines where the socket connects. The value should be the subfolder the app runs in. Unlike PUBLIC_URL, this cannot contain the entire URL. If the application is not deployed into a subfolder, this variable is not needed.

REACT_APP_SOCKET_ENDPOINT defines the domain from which the backend is called. It should contain the entire domain without the subfolder.

RASA_NETWORK has the rasa servers' network. If rasa is run in a docker container the value should always be the hostname of the rasa service.
If the rasa server is being run locally, it should be "localhost".

MONGODB_URI is the location of the MongoDB database. When using MongoDB atlas the value should be the database location in atlas.

TASK_COMPLETE_REDIRECT_TARGET defines where the users are sent after they have completed the task.

If any of these variables is not set, they default to values for running on the application locally. 

After making changes running the command "docker-compose build" builds the project. The application can now be run with the command "docker-compose up". If you want to update the docker images in docker hub, run "docker-compose push".
Please note that if the application is configured to run in a subfolder, it will not work locally.

### Rasa's environment variables

Rasa has two environment variables. If the entire application is run through docker containers, there is no need to change these unless the hostnames are changed in docker-compose.
If hostnames are changed, the locations should be changed accordingly. If the port the backend deploys to is changed, the port in BACKEND_API_LOCATION should also be changed.

### Configuring docker-compose

In the docker-compose.yml file you can configure the services that the application is composed of. There are two services that are important for this application. trollbot runs the server, and trollbot-rasa runs the rasa-chatbot.
Both of these services have an image associated with them. If you wish to change the docker repository where the images are pushed or pulled from, please change the "image" field to match it. The format is  \[User]/\[Repository].

The "build" field links to the folder the Dockerfile associated with this service resides in. If you wish to add more services or change the locations of the dockerfiles of the existing services, edit this field.

The "hostname" field defines the name of the service's network. Changing this means changing the relevant fields in Dockerfiles. 

A field for the .env files should also be added to both trollbot-rasa and trollbot services. This is done by adding the field "env_file: ENV_FILE" with ENV_FILE being the filename of the .env file.
If the .env file is not located in the same directory as docker-compose.yml, it should contain the relative path to the .env file.
The contents of this .env file are detailed in the deployment guide. The .env files used by the main application and the one used by rasa should be different files.

### .env-file contents

For the main application, the following environment variables should be defined.

 - MONGODB_URI: MONGODB_URI defines the location of the MongoDB database. As this has connected to a database in a cloud server, it contains the username and password of the account used. Please consult MongoDB-documentation on the exact content for this field.

 - TRACKER_STORE_URL: Used by the Log Writer to fetch conversation histories from the correct tracker store when used via Web GUI. This value must be the same as the tracker store url used in the Rasa endpoints file.

 - CLIENT_ID and CLIENT_SECRET: These variables are for using Spotify's API. To set these values, a Spotify account is needed. This account is then linked to Spotify for Developers, where the values of these variables are generated. 
 

Rasa's .env file needs to contain the following environment variables:

 - MONGODB_URI: MONGODB_URI here should have the same content as in the other .env file.

 - MONGODB_DB_NAME: the name of the database used

 - MONGODB_USERNAME: Mongodb username

 - MONGODB_PASSWORD: Mongodb password

### Adding files to .dockerignore

.dockerignore files are in the same directory as the dockerfile associated with it.
Any files or directories you do not wish to be part of the docker image the said dockerfile defines should be added into this file.
Each line in this file should be a path to a file or a directory. Paths to directories should start with a "/".

### Docker volumes

Docker volumes are used to extract files from a docker container into a local filesystem. In this project's docker-compose, there has been set up a docker volume "logs". It extracts the logs generated in the docker container, and saves them in directory "logs". This directory is located in the same directory the docker-compose.yml-file is in.
