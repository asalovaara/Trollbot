## Guide to using, editing and configuring Docker for this project


# Editing or changing the address subfolder Docker image deploys to

In this project, we have used Docker as part of our staging configuration. 
In our staging environment, Docker was used to help us maintain an up-to-date version of our program at all times.
Because of this, Docker is now configured for the specific needs of the staging server. As such, if you intend to set up this software for your own use, you may need to make changes to the current configuration.

On the staging server, our application was running in a subfolder \/trollbot. If you do not intend to run this software in a subfolder, or if you intend to use a subfolder with a different address, you should change the environment variables defined in Dockerfile. 
In the Dockerfile which can be found in the root of the project, there are four environment variables which need to be changed:

PUBLIC_URL=/trollbot

API_URL=/api

SOCKET_SERVER_URL=/trollbot

REACT_APP_API_URL=https://ohtup-staging.cs.helsinki.fi/trollbot/api

These define various addressess the app uses. PUBLIC_URL defines the location of the app in relation to the domain. 
API_URL defines the api address, and REACT_APP_API_URL defines the api address that the client uses to connect to the server api.
As you may notice, these addresses were different in our particular use case. You may have to change these depending on your needs.
Finally, SOCKET_SERVER_URL defines where the socket connects. This can be the same location as the PUBLIC_URL, but it is seperately configurable.

After making changes, please run "docker-compose build" to build the project. If you want to test the application locally, run "docker-compose up". If you want to update docker hub, run "docker-compose push".
 

# Configuring docker-compose