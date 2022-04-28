FROM node:14-slim  as frontend

ENV SKIP_PREFLIGHT_CHECK=true

# Install app dependencies

WORKDIR /usr/src/app/frontend
COPY ./frontend/ ./

# Build frontend

RUN npm install \
 && npm install react-scripts@3.4.1 -g \
 && npm run build 

# - Backend

FROM node:14-alpine3.15
WORKDIR /usr/src/app
COPY ./backend/ ./
COPY --from=frontend /usr/src/app/frontend/build/ ./build/
RUN  apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python \
  && npm install \
  && mkdir /usr/src/logs \
  && adduser -D appuser

USER appuser

# Start app 

EXPOSE 3001

CMD npm run dev
