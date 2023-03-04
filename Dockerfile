FROM node:12-alpine AS build

RUN apk add --no-cache python3 build-base

WORKDIR /app/

COPY package*.json ./
RUN npm install

COPY ./src ./src
RUN npm run build

FROM node:12-alpine

WORKDIR /app/

COPY package*.json ./
RUN npm install --production

COPY . ./
COPY --from=build /app/dist ./dist

CMD ["node", "."]
