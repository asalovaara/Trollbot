FROM node:13.12.0-alpine

ENV SKIP_PREFLIGHT_CHECK=true
ENV PUBLIC_URL=/trollbot
ENV API_URL=/trollbot/api
ENV REACT_APP_API_URL=https://ohtup-staging.cs.helsinki.fi/trollbot/api

# Install app dependencies

WORKDIR /app
COPY . ./

# Build frontend

WORKDIR /app/frontend
RUN npm install \
  && npm install react-scripts@3.4.1 -g \
  && npm run build \
  && cp -r build/ ../backend/build \
  && rm -r ../frontend

# - Backend

WORKDIR /app/backend
RUN npm install

# Start app 

WORKDIR /app

EXPOSE 3001

CMD npm run start-staging --prefix backend
