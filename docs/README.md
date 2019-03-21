# Amazee Silverback

`amazee/silverback` is a composer package adding common project dependencies, tooling and configuration scaffolding to Amazee Drupal projects. It aims to improve product quality and reduce maintenance costs by encouraging three simple principles:

1. **Maximize open source:** Lower initial costs, technical debt and maintenance costs by using and contributing to open source code as much as possible. For every feature required by a project that is not solvable by configuration or theming, try to find a generic solution that can be contributed and added as a dependency to `amazeelabs/silverback`.
2. **Minimize requirements:** It has to be as easy as possible to work on a project. If you need the production database and a local elasticsearch cluster to edit CSS files, you are doing microservices terribly wrong. *Example:* By default silverback development sites run on SQLite. MySQL is considered a performance optimization, and it's not in the projects scope to test Drupal's database abstraction layer.
3. **Testability first:** A project has to be fully testable with only the git repository at any time. All required assets (test content, media, configuration) have to be set up during the installation process. It **must not** rely on production data. Every feature and bug fix has to bring a test case that can be reproduced. It might take more time initially, but it will pay off.

If you are looking how to create a silverback project or start working on one, head over to the [development](development/setup.md) section. 
