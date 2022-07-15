FROM node:12.18.1

RUN npm install -g nodemon

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install 
COPY . .

EXPOSE 8080
CMD [ "nodemon" ]