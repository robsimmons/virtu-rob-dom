FROM node:latest
WORKDIR /site
COPY ./package.json /site/package.json
COPY ./package-lock.json /site/package-lock.json
RUN npm i
COPY . /site
RUN npm run build