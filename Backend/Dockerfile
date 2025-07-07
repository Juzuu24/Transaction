
FROM node:18-alpine


WORKDIR /app

# copy file package.json & package-lock.json
COPY package*.json ./

# install Dependencies
RUN npm install

# copy all code into Container
COPY . .

# install nodemon 
RUN npm install -g nodemon

# open port 4000
EXPOSE 4100

# Run app by nodemon (If want to run default use  `node login.js`)
CMD ["npx", "nodemon", "login.js"]
