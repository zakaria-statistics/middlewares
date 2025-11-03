FROM node:20-alpine
WORKDIR /app

COPY package.json ./
RUN npm install --only=production

COPY server.js .

EXPOSE 5002
HEALTHCHECK --interval=10s --timeout=3s --retries=10 CMD node -e "require('http').get('http://127.0.0.1:5002/health',res=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"
CMD ["node", "server.js"]
