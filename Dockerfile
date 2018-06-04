FROM quay.io/ukhomeofficedigital/nodejs-base:v8.11.1

ENV USER user-platform-public-ui
ENV GROUP group-platform-public-ui
ENV NAME platform-public-ui

WORKDIR /app

RUN groupadd -r ${GROUP} && \
    useradd -r -g ${GROUP} ${USER} -d /app && \
    mkdir -p /app && \
    chown -R ${USER}:${GROUP} /app

ADD . /app/

RUN npm install && npm run build

ENV NODE_ENV='production'

USER ${USER}

EXPOSE 8080

ENTRYPOINT exec node dist/server.js

