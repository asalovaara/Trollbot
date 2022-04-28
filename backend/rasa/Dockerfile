FROM python:3.7-slim-buster

WORKDIR /usr/src/app/rasa
COPY . ./

RUN pip install -U pip \
 && pip install -r requirements.txt \
 && rasa train --data data_nice --out models_nice \
 && rasa train --data data_troll --out models_troll \
 && chmod +x rasa_start.sh \
 && adduser appuser

# Start app 

USER appuser

CMD bash rasa_start.sh
