FROM node:alpine as builder

WORKDIR /app

COPY ./package.json ./
COPY ./tsconfig.json ./

RUN npm install
RUN npm install -g typescript
RUN npm install -g ts-node


COPY ./ ./

RUN chmod 777 node_modules
RUN npm run build

FROM nginx
EXPOSE 3000

COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

