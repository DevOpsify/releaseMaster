FROM node:6.2.1

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

RUN npm install -g bower
COPY package.json /usr/src/app/
RUN npm install
COPY .bowerrc /usr/src/app
COPY bower.json /usr/src/app
RUN bower install --allow-root

COPY . /usr/src/app
CMD [ "npm", "start" ]
