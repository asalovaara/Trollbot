# Software development project 2021

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A project by the students of the Computer Science department of the University of Helsinki.

### [DEMO](https://ohtup-staging.cs.helsinki.fi/trollbot)

## Description

An implementation of two chatbots for the purposes of a research that studies trolling on the internet.

## Implementation

React single page web application with a Node.js backend.

## Installation

For the application to run correctly you need to install on your machine:

- Node.js libary

- Rasa 

- Python

### 1. Install Node and dependencies

Read the README at the backend folder.

### 2. Train Rasa models

After installing rasa locally, create folders named `models_nice` and `models_troll` inside `/backend/rasa/`, because these folders are currently gitignored. These will be used to store models for the two bots.

Train rasa both models:

- Nicebot: `rasa train --data data_nice --out models_nice`

- Trollbot: `rasa train --data data_troll --out models_troll`

(The data for Nicebot comes from directory `data_nice` and the model is saved into directory `models_nice`.)

The nlu file is not shared between Nicebot and Trollbot. If you modify nice_nlu.yml, apply the same change to troll_nlu.yml as well.

### 3. Run Rasa actions and models

Start the local MongoDB database (instructions in backend README).

In backend folder: run backend with `npm start` (required for genre search).

In backend/rasa folder:

- Run `rasa run actions` for Rasa action server (required for custom actions).

- Run `rasa run -m models_nice --enable-api --cors "*"` for Nicebot model server.

- Run `rasa run -m models_troll --enable-api --cors "*" -p 5006` for Trollbot model server (using different port with the `-p 5000` argument).

(The `-m` argument chooses the latest model in the specified directory.)

### 4. Run the application

After installing Node and Rasa everything should be ready for running the application. Navigate `/backend/` folder where you can run the following commands:

- Run `npm run build` to build a production build of the frontend React application for the backend.

- Run `npm start` to start the application using the created build.

You should now be able to visit the application at (http://localhost:3001).

## Documentation

[Opening sequence](https://github.com/sumuh/Trollbot/tree/main/documentation/trollbot-openingSequnce.png)
