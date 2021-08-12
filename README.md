# Software development project 2021

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A project by students in the Computer Science department of University of Helsinki.

### [DEMO](https://ohtup-staging.cs.helsinki.fi/trollbot)

## Description

An implementation of two chatbots for the purposes of a research that studies trolling on the internet.

## Implementation

Single page web application using Node.js and React.

## Installation

Read the README at backend folder.

Remember to train the Rasa bots when you first pull the new directory:

Nicebot: `rasa train --data data_nice --out models_nice`

Trollbot: `rasa train --data data_troll --out models_troll`

(The data for Nicebot comes from directory `data_nice` and the model is saved into directory `models_nice`.)

The nlu file is not shared between Nicebot and Trollbot. If you modify nice_nlu.yml, apply the same change to troll_nlu.yml as well.

## Usage

Start the local MongoDB database (instructions in backend README).

In backend folder: run backend with `npm start` (required for genre search).

In backend/rasa folder:

Use `rasa run actions` to run Rasa action server (required for custom actions).

Use `rasa run -m models_nice --enable-api --cors "*"` to run Rasa server for Nicebot 

or `rasa run -m models_troll --enable-api --cors "*"` for Trollbot.

(The `-m` argument chooses the latest model in the specified directory.)

In frontend folder: run frontend with `npm start`.

## Documentation

[Opening sequence](https://github.com/sumuh/Trollbot/tree/main/documentation/trollbot-openingSequnce.png)
