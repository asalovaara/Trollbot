FROM ubuntu:latest

WORKDIR /usr/src/app/rasa
COPY . ./

RUN apt-get update \
  && apt-get -y install sudo \
  && sudo apt install -y python3-dev python3-pip \
  && pip install rasa \
  && rasa train

# Start app 

EXPOSE 5055
EXPOSE 5005

COPY rasa_start.sh .
RUN chmod +x rasa_start.sh
CMD bash rasa_start.sh
