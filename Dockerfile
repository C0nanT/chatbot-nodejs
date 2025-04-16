FROM node:18-slim

ARG USER_ID=1000
ARG GROUP_ID=1000
RUN apt-get update && apt-get install -y --no-install-recommends sudo \
    && groupadd -g ${GROUP_ID} nodeuser \
    && useradd -l -u ${USER_ID} -g nodeuser -m nodeuser \
    && echo "nodeuser ALL=(ALL) NOPASSWD:ALL" > /etc/sudoers.d/nodeuser \
    && chmod 0440 /etc/sudoers.d/nodeuser

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

USER nodeuser
    
CMD ["npm", "start"]