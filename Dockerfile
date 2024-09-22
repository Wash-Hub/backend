###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM node:20-alpine As development

# Puppeteer 의존성 설치
RUN apk update && apk add --no-cache \
  chromium \
  nss \
  freetype \
  harfbuzz \
  ttf-freefont

# puppeteer에 브라우저 경로 알려주기
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

# Create app directory
WORKDIR /usr/src/app

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure copying both package.json AND package-lock.json (when available).
# Copying this first prevents re-running npm install on every code change.
COPY --chown=node:node package*.json ./

RUN npm install -g npm@10.3.0

# Install app dependencies using the `npm ci` command instead of `npm install`
RUN npm ci --force
#force 추가해야 도커환경내에서 빌드됌 <- npm i hybrid force 어쩌고했던 것 때문임,,,
#이부분은 nestjs 도커 설정한 부분을 살리면 실행되는걸 확인해야함 ^^

# Bundle app source
COPY --chown=node:node . .

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

