FROM node:14
ENV NODE_ENV=production
ENV PORT=3000

RUN apt-get update \
    && apt-get install ffmpeg -y \
    && apt-get clean

WORKDIR /app

COPY ./package*.json .

COPY ./dist ./dist

RUN npm install --production

CMD [ "node", "dist/main.js" ]

## docker build --tag jefaokpta/node-whats:3.0 .
## docker run -d --name=whats-12 -p3001:3000 -e COMPANY=12 -e API_PORT=3001 --restart=on-failure -v `pwd`/whatsMedia:/whatsMedia jefaokpta/node-whats:3.1.0-homolog
## ATENCAO NAO ESQUECA DO COMANDO TSC!!!
