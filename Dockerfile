# BUILD IMAGE
#   docker build --rm -t core-dashboard .
#
# RUN CONTAINER
#   docker run --name core-dashboard-dev -ti -p 3000:3000 core-dashboard:latest


FROM node:12.8.0-alpine
MAINTAINER core.ac.uk

ENV NODE_ENV development

WORKDIR /app
ADD . /app
RUN npm ci
RUN npm run build

EXPOSE 3000

# default command runs dev server
CMD npm run start --host 0.0.0.0
