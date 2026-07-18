FROM node:20-bullseye
USER root
RUN apt-get update && \
    apt-get install -y ffmpeg webp git && \
    apt-get upgrade -y && \
    rm -rf /var/lib/apt/lists/*
USER node
WORKDIR /home/node/app
COPY --chown=node:node . .
RUN yarn install --network-concurrency 1 --ignore-engines
EXPOSE 7860
ENV NODE_ENV=production
CMD ["npm", "start"]
