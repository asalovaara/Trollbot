FROM node:13.12.0-alpine

# Install app dependencies

# - Backend

WORKDIR /app

COPY backend/package.json ./
COPY backend/package-lock.json ./

WORKDIR /app/backend

RUN npm install --silent

# - Frontend

WORKDIR /app

COPY frontend/package.json ./
COPY frontend/package-lock.json ./

WORKDIR /app/frontend

RUN npm install --silent
RUN npm install react-scripts@3.4.1 -g --silent

# Add app

WORKDIR /app
COPY . ./

# Build app

WORKDIR /app/frontend
RUN npm run build

WORKDIR /app/backend
EXPOSE 3001

# Start app -- ONLY STARTS BACKEND FOR NOW

WORKDIR /app
CMD npm start --prefix backend