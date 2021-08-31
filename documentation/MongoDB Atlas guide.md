# MongoDB Atlas guide

Artists and user objects are stored in a MongoDB Atlas database.

To view the database in a browser, log in to [Atlas](https://www.mongodb.com/cloud/atlas) with the provided username and password.

At the moment, 3 collections exist in the Trollbot database: artists, conversations and users. The artists collection consists of a large number of popular artists. Each document includes the fields genres, professionalName and gender. The conversations collection contains some Rasa tracker data for logging purposes. The users collection contains user data. 

## Connecting to the database

In the source code, [Mongoose](https://mongoosejs.com/) is used for the database operations.

The command ```mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true } )``` is used to establish a connection to the cloud database. MONGODB_URI is defined as an environment variable.

## Schemas and models

In the files in backend/models, [schemas](https://mongoosejs.com/docs/guide.html) are defined for the artist and user objects. Schemas and models are an essential part of working with Mongoose.

A schema must be converted into a model so it can be used to save data into the database. This is currently done by calling mongoose.model() in the end of artist.js and user.js files.

In backend/databaseService, an instance of the user/artist class is created when calling saveUserToDatabase() or saveArtistToDatabase() respectively. The instance is provided with the desired parameters in JSON format. 

It is good to note that not all the parameters defined in the schema need to be set; for example, if the first name of an artist is unknown, the firstName parameter can be omitted without problem despite it being defined as a part of the artist schema.

## Queries

Querying the database with Mongoose’s commands is relatively straightforward:
* ```save()``` is used to save a new document 
* ```findOne()``` is used to find the first document that matches the given filter (e.g. “professionalName”)
* ```findOneAndUpdate()```does the same plus updates the found document (use the $push operation as in the addGenreToArtist() function)
* ```deleteMany()``` deletes the documents that match the given filter; if no filter is given, as in the deleteAll function, all the documents are deleted.
