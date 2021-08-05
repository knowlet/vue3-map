# syntax=docker/dockerfile:experimental

# Set Frontend Builder
FROM node:alpine as builder
RUN apk --update --no-cache add git openssh-client
WORKDIR /usr/app
# Copy package.json
COPY package.json package-lock.json ./
# Install libraries
RUN npm install
# Copy working tree
COPY . .
# Build prod
RUN npm run build

# Packaging deployment image
FROM nginx:alpine

COPY --from=builder /usr/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
