#!/bin/bash
set -m
rasa run actions &
rasa run -p 5005 -m models_nice --endpoints endpoints-docker.yml --credentials credentials-docker.yml --enable-api --cors "*" &
rasa run -p 5006 -m models_troll --endpoints endpoints-docker.yml --credentials credentials-docker.yml --enable-api --cors "*"
fg %1


