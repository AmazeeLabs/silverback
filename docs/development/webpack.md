---
menu: Development
route: webpack
---

# Webpack

The project is set up to use webpack to bundle drupal libraries, so they can be written in modern javascript and import packages from npm. Setup:

- `drush en -y webpack_babel` (there's webpack_react too if you need react)
- `yarn webpack-dev` - starts the local webpack dev server. This needs to be on all the time during development, so the libraries are built. If you don't want to change anything, but have the libraries working, run `drush webpack:build`.

## Known issues

- In case of javascript errors, first try disabling the aggregation at _/admin/config/development/performance_.
- Only one `yarn webpack-dev` can be running at any given point in time.
