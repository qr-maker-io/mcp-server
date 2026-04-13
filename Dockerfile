FROM node:20-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev
COPY dist/ ./dist/
ENV QR_MAKER_API_KEY=glama-introspection
CMD ["node", "dist/index.js"]
