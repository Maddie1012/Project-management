FROM node:20

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

ENV VITE_API_URL=http://api:8080/api

RUN npm run build

EXPOSE 3000
CMD ["npm", "run", "dev"]