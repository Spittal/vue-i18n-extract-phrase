FROM node:alpine

RUN apk add yarn
RUN yarn global add vue-i18n-phrase
