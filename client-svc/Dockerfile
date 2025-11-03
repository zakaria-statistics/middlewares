FROM node:20-alpine
WORKDIR /app

# copy only package.json
COPY package.json ./
RUN npm install --only=production

# app code
COPY server.js .

EXPOSE 5001
HEALTHCHECK --interval=10s --timeout=3s --retries=10 CMD node -e "require('http').get('http://127.0.0.1:5001/health',res=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"
CMD ["node", "server.js"]
