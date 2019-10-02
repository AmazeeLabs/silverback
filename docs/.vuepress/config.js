module.exports = {
  title: 'Silverback',
  description: 'Silverback documentation.',
  base: '/silverback/',
  themeConfig: {
    algolia: {
      indexName: 'silverback',
      apiKey: '96b7a6dce03d75cac64b0e9715fea89e'
    },
    nav: [
      {text: 'Home', link: '/'},
      {
        text: 'Development', items: [
          {text: 'Setup', link: '/development/setup'},
          {text: 'Workflow', link: '/development/workflow'},
          {text: 'Testing', link: '/development/testing'},
          {text: 'Debugging', link: '/development/debugging'},
          {text: 'Lagoon', link: '/development/lagoon'},
          {text: 'Storybook', link: '/development/storybook'},
          {text: 'Webpack', link: '/development/webpack'}
        ]
      },
      {
        text: 'Features',
        items: [
          {text: 'Translations', link: '/features/translations/'},
          {text: 'WYSIWYG Editor', link: '/features/sections/'},
        ]
      },
    ],
    sidebarDepth: 2,
    sidebar: 'auto',
    displayAllHeaders: true,
    repo: 'AmazeeLabs/silverback',
    repoLabel: 'GitHub',
    docsDir: 'docs',
    docsBranch: 'master',
    editLinks: true,
    editLinkText: 'I found a typo and I don\'t want to keep it!'
  },
  markdown: {
    lineNumbers: true
  },
};
