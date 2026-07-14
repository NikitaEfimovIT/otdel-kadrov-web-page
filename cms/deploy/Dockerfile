# Strapi 5 — продакшн-образ. Класть в КОРЕНЬ проекта Strapi (рядом с package.json).
# Сборка в два этапа: сначала билд админки, потом лёгкий рантайм-образ.

FROM node:20-alpine AS build
RUN apk add --no-cache build-base python3 vips-dev
WORKDIR /opt/app
COPY package*.json ./
RUN npm install --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:20-alpine
RUN apk add --no-cache vips-dev
ENV NODE_ENV=production
WORKDIR /opt/app
COPY --from=build /opt/app ./
EXPOSE 1337
CMD ["npm", "run", "start"]
