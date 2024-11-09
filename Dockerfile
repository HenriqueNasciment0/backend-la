FROM node:18-alpine AS builder

WORKDIR /app

RUN apk add --no-cache python3 make g++ 

COPY package*.json ./
COPY prisma ./prisma/

RUN npm ci

RUN npx prisma generate

COPY . .

RUN npm run build

RUN npm prune --production

FROM node:18-alpine AS production

WORKDIR /app

RUN apk add --no-cache python3 make g++

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

RUN npx prisma generate

EXPOSE 4000

CMD ["npm", "run", "start:prod"]