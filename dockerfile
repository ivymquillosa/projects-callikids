FROM node:10-slim

WORKDIR /var/app
COPY ./package.json /var/app/package.json
RUN npm install
COPY ./ /var/app/

ENV PORT 8080
ARG NODE_ENV=development
ENV NODE_ENV=$NODE_ENV
EXPOSE 8080


ENV NODE_ENV development

CMD ["npm","start"]
