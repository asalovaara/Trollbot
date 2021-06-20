FROM node:13.12.0-alpine

# Install app dependencies

# - Backend

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./

RUN npm install --silent

# Add app

COPY . ./

EXPOSE 3001

# Start app 

CMD npm start