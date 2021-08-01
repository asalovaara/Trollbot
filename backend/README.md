## Node.js backend with react static frontend working as a Single-page-app

To run this application locally you will need to have [Node.js](https://nodejs.org/en/) libary installed on your computer.

### Install
Run script `npm install` to install needed Node.js packages.

### Build
Run script `npm run build` to create a production build of the frontend.

### Starting the application
After Installing and Building the application can now be run locally with the command `npm start`.

Visit [http://localhost:3001](http://localhost:3001) to view it in the browser.

### Clean
Run script `npm run clean` to remove the generated production build version of the frontend from the folder.

### MongoDB
Good instructions for installing and running mongo can be found [here](https://docs.mongodb.com/manual/administration/install-community/)

After setting up the database, run Rasa with the following command: `rasa run --enable-api --endpoints endpoints.yml --cors "*"`

Convert the conversation into a CSV log by running mongoService.js, e.g. `node services/eventLogger/logWriter.js`. The file is created in the logs directory, located in the project root.

To get a pretty Excel file, follow the instructions provided [here](https://support.affinity.co/hc/en-us/articles/360044453711-How-to-open-CSV-files-with-the-correct-delimiter-separator)
