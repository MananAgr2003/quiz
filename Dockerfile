FROM node:12.18.3-alpine3.12

# Create app directory
WORKDIR /usr/src/app

#Copy files

COPY . .

# Install app dependencies
RUN npm i --legacy-peer-deps

CMD ["npm", "run", "start"]