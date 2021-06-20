FROM node:13.12.0-alpine

# Install app dependencies

# - Frontend

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# Add app

COPY . ./

EXPOSE 3000

# Start app

CMD npm start