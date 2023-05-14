# Compile the client into /gradetracklite/client/ in a temp stage
FROM node:18-alpine AS react-build

# Install first to allow layer caching (takes a long time)
WORKDIR /gradetracklite/client
COPY ./client/package*.json .
RUN npm install

# Copy over the rest for building
COPY ./client/ .
RUN npm run build

# Stage 2: copy over ui artifacts into server
FROM node:18-alpine AS server-build

# Copy the compiled client ui into /gradetracklite/server/dist
COPY --from=react-build /gradetracklite/client/dist /gradetracklite/server/public

# Now install the server
WORKDIR /gradetracklite/server

# Install first to allow layer caching (takes a long time)
COPY ./server/package*.json .
RUN npm install

# Copy over the rest to start running
COPY ./server/ .
EXPOSE 8000

# Actually start the server
CMD ["npm", "run", "start"]

