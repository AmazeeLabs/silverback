FROM amazeeio/node:10-builder as nodebuilder
RUN mkdir -p /app/storybook
COPY package.json yarn.lock /app/
RUN yarn install --pure-lockfile
COPY storybook /app/storybook/
RUN yarn run build-storybook

FROM amazeeio/nginx
COPY --from=nodebuilder /app/storybook/build /app

