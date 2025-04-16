
## execução com 100% Docker
docker compose build
docker compose up -d
docker exec -it chatbot-nodejs bash -c 'npm start'

## execução com 100% NodeJS
npm install
npm start

## execução com 50% NodeJS e 50% Docker
npm i
npm run start:docker