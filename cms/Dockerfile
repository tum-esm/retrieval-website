FROM node:16
ENV NODE_ENV=production

# Install production dependencies.
COPY package.json package.json
COPY yarn.lock yarn.lock
COPY providers providers
RUN yarn install --production=true

# Build Strapi
COPY . .

CMD [ "yarn", "start" ]