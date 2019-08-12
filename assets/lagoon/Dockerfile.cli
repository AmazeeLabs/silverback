FROM amazeeio/php:7.2-cli-drupal as builder
COPY composer.json composer.lock load.environment.php package.json yarn.lock /app/
COPY scripts /app/scripts
COPY patches /app/patches
RUN composer install --no-dev --prefer-dist
RUN yarn install --pure-lockfile
COPY . /app
RUN yarn run build-library && yarn run build-storybook
RUN rm -rf /app/node_modules

FROM amazeeio/php:7.2-cli-drupal
COPY --from=builder /app /app

ENV NODE_ENV production

# Define where the Drupal Root is located
ENV WEBROOT=web
ENV SB_ENVIRONMENT=amazeeio
