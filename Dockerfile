FROM node:latest as base

#---------- PRE-REQS ----------
FROM base as backend
WORKDIR /app

COPY . /app/

RUN yarn install --frozen-lockfile
RUN yarn uninstall bcrypt
RUN yarn install bcrypt
