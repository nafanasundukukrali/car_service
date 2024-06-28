FROM node:lts-alpine
ADD package.json /app/package.json
ADD yarn.lock /app/yarn.lock
WORKDIR /app
RUN yarn install
ADD . /app
ENV NODE_ENV=test
RUN yarn build
CMD ["yarn", "test"]