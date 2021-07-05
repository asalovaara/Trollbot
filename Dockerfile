FROM node:13.12.0-alpine

ENV SKIP_PREFLIGHT_CHECK=true
ENV PUBLIC_URL=/trollbot
ENV REACT_APP_API_URL=https://ohtup-staging.cs.helsinki.fi/trollbot/api

# Install app dependencies

WORKDIR /app
COPY . ./

# - Frontend

WORKDIR /app/frontend
RUN npm install
RUN npm install react-scripts@3.4.1 -g

# Build app

RUN npm run build
WORKDIR /app
RUN cp -r frontend/build/ backend/build
RUN rm -r frontend

# - Backend
WORKDIR /app/backend
RUN npm install

WORKDIR /app

EXPOSE 3001

# Start app 

CMD npm run start-staging --prefix backend
