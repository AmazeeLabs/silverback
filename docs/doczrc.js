export default {
  title: "Silverback",
  description: "Documentation for Silverback.",
  base: "/silverback",
  typescript: true,
  menu: ["Home", "Development", "Features"],
  gatsbyRemarkPlugins: [
    {
      resolve: "gatsby-remark-vscode",
      options: {
        languageAliases: {
          gherkin: "shell",
        },
      },
    },
  ],
};
