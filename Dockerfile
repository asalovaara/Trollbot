FROM node:13.12.0-alpine

# Install app dependencies

# Backend

WORKDIR /app

ENV PATH /app/backend/node_modules/.bin:$PATH

COPY backend/package.json ./
COPY backend/package-lock.json ./

WORKDIR /app/backend

RUN npm install --silent

#Frontend

WORKDIR /app

ENV PATH /app/frontend/node_modules/.bin:$PATH

COPY frontend/package.json ./
COPY frontend/package-lock.json ./

WORKDIR /app/frontend

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent


# Add app

WORKDIR /app
COPY . ./

# Start app
CMD ["npm", "start", "--prefix", "backend"]
CMD ["npm", "start", "--prefix", "frontend"]