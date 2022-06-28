--- FILE MANAGEMENT ---

The server has fairly strict limitations on file usage. Most commands have to be run using sudo, as the command files have limited execution right.
When creating new files or directories, chmod-command should be used to make anything created readable and executable by the user. This is necessary with directories, since the ch-command cannot be used with sudo, so entering and using any files within new directories is impossible without expanding it's usage rights.

Here is a short guide for using chmod:

sudo chmod a+r <target> gives reading rights to target.
sudo chmod a+rx <target> gives read and execution rights to target.
sudo chmod a+rwx <target> gives read, write and execution rights to target.

r, w and x can be used in any combination to give any rights you need.

As mentioned, when creating directories, it might be a good idea to always give read and execution rights to it. In general, I would limit the ability to write to files and directories to cases where it is absolutely necessary.

--- SERVER FILES ---

All files related to running the server are located in the "/server"-directory. 
These files include the .env-files, docker-compose, the certificates, watchtower and nginx.conf.

nginx.conf is a configuration file for nginx. Nginx manages the server's network communications. 

The certificates-directory contains the certificates used by the server.

The watchtower-directory contains a docker-compose.yml file used to launch watchtower. Watchtower is used to automatically update any running docker container to the newest version when new updates are released.

The .env and .env.rasa files pass environment variables to the backend server and the rasa server respectively.
The specific environment variables and their values are documented in application server documentation's Docker guide.
The variables needed are MONGODB_URI, RASA_NETWORK and TASK_COMPLETE_REDIRECT_TARGET. Remember, that TASK_COMPLETE_REDIRECT_TARGET needs to link to Prolific as instructed by Prolific's setup guide.


The server is set up using Docker. This means that all services are running in docker containers. These containers are managed using docker-compose as defined in the file docker-compose.yml.
As such, there are not that many services installed directly on the server. It is possible to install nginx and watchtower directly on the host computer if it is deemed necessary.
In that case, everything nginx related should be removed from docker-compose.yml.


--- HOW TO OPERATE THE SERVER ---

The server starts with the command "sudo docker-compose up -d" and is shut down with the command "sudo docker-compose down".

You can generate logs with the command 

  sudo docker exec -it server_trollbot_1 npm run log -- --atlas

server_trollbot_1 is the default name for the application server's docker container. If there are issues, please check the name of the containers and use the appropriate one.
Containers can be listed with the command "sudo docker container ls".


--- ON CERTIFICATES ---

The certificates have been issued through The University of Helsinki. The certificates in .pem-format. 

For nginx, the files have been renamed to .key for the key file and .crt for the certificate file. The file contents have not been changed.

