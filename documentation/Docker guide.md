# Guide to using, editing and configuring Docker for this project

### About Dockerfiles and docker-compose

There are two dockerfiles in this project. One resides in the project root, and the second is in the rasa-files, at \/backend/rasa.
The one in project root is responsible for creating the application server. The one in the rasa folder is responsible for building the rasa-server.

There should be no need to configure the dockerfile for rasa, but it can be edited if needed. The important thing is, that the ports used match with those programmed into the main application.

These dockerfiles are used by and the images they create can be managed with the docker-compose.yml file. It is located in the project root.

 
### Editing or changing the address subfolder Docker image deploys to

In this project, we have used Docker as part of our staging configuration. 
In our staging environment, Docker was used to help us maintain an up-to-date version of our program at all times.
Because of this, the current Docker configuration is for the specific needs of that staging server. As such, if you intend to set up this software for your own use, you may need to make changes to the current configuration.

On the staging server, our application was running in a subfolder \/trollbot. If you do not intend to run this software in a subfolder, or if you intend to use a subfolder with a different address, you should change the environment variables defined in Dockerfile. 
In the Dockerfile found in the root of the project there are four environment variables which need to be changed:

PUBLIC_URL=/trollbot

API_URL=/api

REACT_APP_API_URL=https<nolink>://ohtup-staging.cs.helsinki.fi/trollbot/api

REACT_APP_SOCKET_SERVER_URL=/trollbot



These define various addressess the app uses. PUBLIC_URL defines the location of the app in relation to the domain. As stated previously, our staging environment ran in subfolder  \/trollbot, so right now it has the value \/trollbot. This value can contain the entire address, if needed. 
API_URL defines the backend's api address, and REACT_APP_API_URL defines the api address that the client uses to connect to it. 
As you may notice, these addresses were different in our particular use case. You may have to change these depending on your needs. 
Finally, REACT_APP_SOCKET_SERVER_URL defines where the socket connects. This can be the same location as the PUBLIC_URL, but it is seperately configurable. Unlike PUBLIC_URL, this cannot contain the entire address.

After making changes, please run "docker-compose build" to build the project. If you want to test the application locally, run "docker-compose up". If you want to update docker hub, run "docker-compose push".
Please note that if the application is configured to run in a subfolder, it will not work locally. 

### Configuring docker-compose

In the docker-compose.yml file you can configure the services that the application is composed of. There are two services that are important for this application. trollbot-server runs the server, and trollbot-rasa runs the rasa-chatbot.
Both of these services have an image associated with them. If you wish to change the docker repository where the images are pushed or pulled from, please change the "image" field to match it. The format is  \[User]/\[Repository].

The "build" field links to the folder the Dockerfile associated with this service resides in. If you wish to add more services or change the location of the dockerfile of the existing services, edit this field.

### Adding files to .dockerignore

.dockerignore files are in the same directory as the dockerfile associated with it.
Any files or directories you do not wish to be part of the docker image the said dockerfile defines should be added into this file.
Each line in this file should be a path to a file or a directory. Paths to directories should start with a "/".
