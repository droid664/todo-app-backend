FROM node:20-alpine

WORKDIR /opt/data/

COPY package*.json ./

COPY tsconfig*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 1337

CMD ["node", "./dist/main.js"]