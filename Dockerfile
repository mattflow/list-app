ARG NODE_VERSION=14.15.3

FROM node:${NODE_VERSION} AS BUILDER

WORKDIR /client

COPY client/package.json .
COPY client/yarn.lock .

RUN yarn install

COPY client .

RUN npm run build


FROM node:${NODE_VERSION}-alpine

ENV NODE_ENV=production

WORKDIR /app

COPY package.json .
COPY yarn.lock .

RUN yarn install

COPY . .

RUN rm -rf client

COPY --from=builder /client/build ./client/build

EXPOSE 8080

CMD ["npm", "start"]