FROM node:23

WORKDIR /app

RUN corepack enable
RUN corepack enable
RUN yarn init -2

COPY package.json ./
COPY . /app

RUN yarn install
RUN yarn build

# Expose the port your application listens on
EXPOSE 3000

# Define the command to run your application
CMD ["yarn", "start"]