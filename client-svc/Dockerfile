FROM node:20-alpine

WORKDIR /app

# Minimal package.json so we can install express
COPY package.json package-lock.json ./
RUN npm ci --only=production

# App code
COPY server.js .

EXPOSE 5001

# Lightweight healthcheck that uses Node's stdlib (no curl/wget needed)
HEALTHCHECK --interval=10s --timeout=3s --retries=10 CMD node -e "require('http').get('http://127.0.0.1:5001/health',res=>process.exit(res.statusCode===200?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "server.js"]
