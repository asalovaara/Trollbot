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

On the staging server, our application was running in a subfolder \/trollbot. If the final URL the app is intended to run in is not DOMAINNAME/trollbot, the environment variables defined in the main dockerfile have to be changed. 
In the Dockerfile found in the root of the project there are four environment variables which need to be changed:

PUBLIC_URL=/trollbot

API_URL=/api

REACT_APP_API_URL=https<nolink>://ohtup-staging.cs.helsinki.fi/trollbot/api

REACT_APP_SOCKET_SERVER_URL=/trollbot

REACT_APP_SOCKET_ENDPOINT=https<nolink>://ohtup-staging.cs.helsinki.fi

RASA_ENDPOINT=http<nolink>://trollbot-rasa:5005


These define various addressess the app uses. 

PUBLIC_URL defines the location of the app in relation to the domain. As stated previously, our staging environment ran in subfolder  \/trollbot, so right now it has the value \/trollbot. This value can contain the entire address, if needed. 

API_URL defines the server's api address, and REACT_APP_API_URL defines the api address that the client uses to connect to it. As such, they may have different content.

REACT_APP_SOCKET_SERVER_URL defines where the socket connects. The value should be the subfolder the app runs in. Unlike PUBLIC_URL, this cannot contain the entire URL. If the application is not deployed into a subfolder, this line can be removed.

REACT_APP_SOCKET_ENDPOINT defines the domain from which the backend is called. It should contain the entire domain without the subfolder.

Finally, RASA_ENDPOINT has the location of the main rasa server. If rasa is run in a docker container the value should be the hostname of the rasa service.
If the rasa server not run through a docker container, it should be "localhost". Otherwise its value should be the hostname of the rassa service. If the port the rasa server is located is somehow changed, the port should be changed here too.

If the app is run locally, with rasa running in a container, every environment variable other than RASA_ENDPOINT can be left unset, as the values default to localhost.

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

### Adding files to .dockerignore

.dockerignore files are in the same directory as the dockerfile associated with it.
Any files or directories you do not wish to be part of the docker image the said dockerfile defines should be added into this file.
Each line in this file should be a path to a file or a directory. Paths to directories should start with a "/".
