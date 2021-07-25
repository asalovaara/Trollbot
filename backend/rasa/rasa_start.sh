#!/bin/bash
set -m
rasa run actions &
rasa run --enable-api --cors "*"
fg %1


