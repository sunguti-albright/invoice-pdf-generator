FROM node:18-alpine as build

WORKDIR /app

COPY package*.json .

RUN npm install 

COPY . .

RUN npm run build


FROM nginx

RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d

COPY --from=build /app/dist/pdf-invoice /usr/share/nginx/html

EXPOSE 80