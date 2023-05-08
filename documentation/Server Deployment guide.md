# How to Deploy Changes to the Application on the Server

The server uses Watchtower to automatically update the running containers to the newest versions. Watchtower tracks changes to the used image on Docker Hub, and automatically downloads the newest version of whatever image used. This means, that in order to update the application on the server, we only need to update the Docker images on Docker Hub.

### Deploy by Committing Changes to the Release-branch

This is the easiest way of committing changes to the server. The release branch automatically uploads a new image to Docker Hub, and as such automatically uploads any changes into production.

This means that all you need to do is to commit the needed changes to the release branch. This can be done in two ways. One, by committing changes directly to the release branch (not recommended), or two, create a pull request and merge the changes from another (usually main) branch.

Pull requests can be created on GitHub from the "Pull Requests" tab and by pressing the "New pull request"-button. You will be taken to the "Compare changes"-view. Here, select the base branch to be "release" and the compared branch to be "main". You can then see the changes to be committed. 

Create the pull request by pressing the "Create pull request"-button. Wait for the tests to complete, and if they pass, press the merge-button. 
If the test does not pass, commit the necessary fixes first. The pull request will remain in the Pull requests tab until it is closed.

### Deploy by Uploading a New Docker Image to Docker Hub

If for some reason you cannot use the release branch to upload the docker image, the same process can be done manually.

First create a *production* version image of the application. This can be done by specifying Dockerfile.prod to be used as dockerfile during image creation. Next, upload this image to Docker Hub. This can be done on the Docker CLI with docker push. Make sure you have access to the Docker Hub account used by the server.

And that is all! Watchtower should automatically download the new version to the server.

#### Changing the Docker Image Tracked By the Server

If for whatever reason you need to change the Docker images used on the server, then you will have to change the docker containers currently running on the server. Watchtower does not update stopped containers, so we need to change the old images to the new ones.

First, stop the existing docker containers by running the command "docker-compose down" in the server directory. Then, edit the docker-compose.yml-file, and set the "image"-field to refer to the new image.
Finally, run "docker-compose up" to start the server with the new images.
