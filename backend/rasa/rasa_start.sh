#!/bin/bash
set -m
rasa run actions &
rasa run --endpoints endpoints-docker.yml --credentials credentials-docker.yml --enable-api --cors "*"
fg %1


