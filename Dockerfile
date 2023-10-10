FROM npm:alphine
WORKDIR /app
COPY . .
RUN npm i
ENTRYPOINT [ "npm", "run", "start" ]
EXPOSE 2101