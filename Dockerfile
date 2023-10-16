FROM node:18.16.1-alpine
WORKDIR /usr/app/
COPY package*.json ./
RUN npm install
COPY ../.. .
COPY .env ./dist
RUN npm run build
EXPOSE ${PORT}
CMD npm run start:dev

