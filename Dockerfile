FROM node:14-slim

ENV SKIP_PREFLIGHT_CHECK=true
ENV PUBLIC_URL=/trollbot
ENV API_URL=/api
ENV REACT_APP_API_URL=https://ohtup-staging.cs.helsinki.fi/trollbot/api
ENV REACT_APP_SOCKET_SERVER_URL=/trollbot
ENV REACT_APP_SOCKET_ENDPOINT=https://ohtup-staging.cs.helsinki.fi

# Install app dependencies

WORKDIR /app
COPY . ./

RUN apt-get update || : && apt-get install python -y

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

CMD npm start --prefix backend
