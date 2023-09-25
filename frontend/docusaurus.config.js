// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require("prism-react-renderer/themes/github");
const darkCodeTheme = require("prism-react-renderer/themes/dracula");

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: "foresight-next",
  tagline: "landing page",
  url: "https://your-docusaurus-test-site.com",
  baseUrl: "/",
  onBrokenLinks: "warn",
  onBrokenMarkdownLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "fsn.org",
  projectName: "landing_page",
  i18n: {
    defaultLocale: "de",
    locales: ["de"],
  },
  customFields: {
    env: process.env.REACT_APP_ENV
  },
  presets: [
    [
      "classic",
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve("./sidebars.js")
        },
        blog: {
          showReadingTime: true
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      }),
    ],
  ],
  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        items: [
          {
            to: "/",
            label: "Homes"
          },
          {
            to: "/things",
            label: "Things",
          },
          {
            to: "/thing-registry",
            label: "Thing Registry",
          },
          {
            type: "doc",
            docId: "intro",
            position: "left",
            label: "Dokumentation",
          },
        ],
      },
      footer: {
        style: "dark",
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    })
};

module.exports = config;
