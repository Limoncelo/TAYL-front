FROM node:latest
RUN apt-get -y update
RUN apt-get install -y bsdtar && ln -sf $(which bsdtar) $(which tar)
RUN curl https://install.meteor.com/ | sh

ENV METEOR_ALLOW_SUPERUSER=true
RUN mkdir /usr/src/app
RUN chmod -R 777 /usr/src/app
WORKDIR /usr/src/app

#USER node
COPY . /usr/src/app
RUN npm install node-modules
RUN chown -Rh node:node /usr/src/app

# RUN chmod -R 777 /usr/src/app
USER node

RUN localedef -i en_US -f UTF-8 en_US.UTF-8

RUN meteor npm install --save @babel/runtime

RUN meteor add iron:router
# RUN meteor create test
# WORKDIR /usr/src/app/meteor
CMD meteor run --port "http://$(hostname -i):8030"