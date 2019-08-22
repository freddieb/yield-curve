# ---- Base Node ----
FROM node:8 AS base
WORKDIR /usr/src/app

# ---- Dependencies ----
FROM base AS dependencies  
# Wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
RUN npm install

# ---- Copy Files/Build ----
FROM dependencies AS build  
WORKDIR /usr/src/app
COPY . /usr/src/app
RUN npm run sass:compile

# --- Release with Alpine ----
FROM node:8.9-alpine AS release  
# Create directory
WORKDIR /usr/src/app
COPY --from=dependencies /usr/src/app/package.json ./
# Install dependencies
RUN npm install --only=production
COPY --from=build /usr/src/app ./
CMD ["node", "index.js"]