FROM node:13.12.0-alpine

ENV SKIP_PREFLIGHT_CHECK=true

# Install app dependencies
# - Backend

COPY backend backend/ ./
RUN npm install --silent --prefix backend

# - Frontend

WORKDIR /app

COPY frontend frontend/ ./
RUN npm install --silent --prefix frontend
RUN npm install react-scripts@3.4.1 -g --silent --prefix frontend

# Add app

COPY . ./

RUN npm run build --prefix frontend
RUN cp -r frontend/build/ backend/build

EXPOSE 3001

# Start app 

CMD npm start --prefix backend