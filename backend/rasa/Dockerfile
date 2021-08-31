FROM python:3.7-slim-buster 

ENV BACKEND_API_LOCATION=trollbot:3001
ENV ACTION_ENDPOINT_URL=http://trollbot-rasa:5055/webhook

WORKDIR /usr/src/app/rasa
COPY . ./

RUN pip install -U pip \
  && pip install -r requirements.txt

RUN rasa train --data data_nice --out models_nice
RUN rasa train --data data_troll --out models_troll

# Start app 

EXPOSE 5055
EXPOSE 5005

COPY rasa_start.sh .
RUN chmod +x rasa_start.sh
CMD bash rasa_start.sh
