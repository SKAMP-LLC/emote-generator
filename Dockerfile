FROM node:20-alpine

ENV APP_PATH=/app
ENV ASSET_PATH=/assets
ENV TEMP_PATH=/tmp

RUN apk add --no-cache  \
    python3 \
    g++ \
    build-base \
    cairo-dev \
    jpeg-dev \
    pango-dev \
    musl-dev \
    giflib-dev \
    pixman-dev \
    pangomm-dev \
    libjpeg-turbo-dev \
    freetype-dev

# Create starting directories.
RUN mkdir $APP_PATH
RUN mkdir $ASSET_PATH
RUN mkdir $APP_PATH/public
COPY . $TEMP_PATH

# Switch to the Express App and build it.
WORKDIR $TEMP_PATH
RUN npm i && npm run build
RUN cp -r ./node_modules /
RUN cp -r ./dist/* $APP_PATH

# Switch to the Vue App and build it.
# The destination is the Express App's public folder.
WORKDIR $TEMP_PATH/generator
RUN npm i && npm run build
RUN cp -r ./dist/* $APP_PATH/public

WORKDIR $APP_PATH

CMD ["node", "./app.js"]
