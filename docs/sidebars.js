/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  tutorialSidebar: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installation',
        'getting-started/quick-start',
        'getting-started/configuration',
      ],
    },
    {
      type: 'category',
      label: 'Evaluation',
      items: [
        'evaluation/overview',
        'evaluation/datasets',
        'evaluation/providers',
        'evaluation/reports',
      ],
    },
    {
      type: 'category',
      label: 'CI/CD',
      items: [
        'cicd/workflows',
        'cicd/security',
      ],
    },
    {
      type: 'category',
      label: 'Architecture',
      items: [
        'adr',
      ],
    },
    'roadmap',
    'contributing',
  ],
};

export default sidebars;
