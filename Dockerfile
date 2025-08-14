FROM node:24.0-slim

WORKDIR /usr/src/app

COPY . .

RUN npm install

RUN npm install -g vite

RUN ln -s /usr/local/bin/node /usr/bin/node

EXPOSE 9615

ENTRYPOINT ["bin/evolution-manager", "server", "start"]