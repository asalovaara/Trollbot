FROM python:3.7-slim-buster 

WORKDIR /usr/src/app/rasa
COPY . ./

RUN pip install -U pip \
  && pip install -r requirements.txt

RUN rasa train nlu -c config.yml -u data/

# Start app 

EXPOSE 5055
EXPOSE 5005

COPY rasa_start.sh .
RUN chmod +x rasa_start.sh
CMD bash rasa_start.sh
