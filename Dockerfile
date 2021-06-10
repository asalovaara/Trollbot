FROM node:13.12.0-alpine

ENV SKIP_PREFLIGHT_CHECK=true

# Install app dependencies

WORKDIR /app
COPY . ./

# - Frontend

WORKDIR /app/frontend
RUN npm install
RUN npm install react-scripts@3.4.1 -g

# Build app

WORKDIR /app/frontend
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

CMD npm start --prefix backend