FROM node:9

WORKDIR /home/node/app

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

COPY . .

CMD node app.js

EXPOSE 8080
