FROM node:alpine
WORKDIR /usr/src/app
ENV NODE_ENV production
EXPOSE 3000

COPY package*.json ./
RUN npm install
COPY . .
CMD [ "npm", "start" ]
