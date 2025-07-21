import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  tutorialSidebar: [
    {
      type: "category",
      label: "Get started",
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Basic concepts",
          id: "basics",
        },
        {
          type: "category",
          label: "Tutorials",
          collapsed: false,
          items: [
            {
              type: 'doc',
              label: "Redux",
              id: 'tutorials/redux',
            },
            {
              type: 'doc',
              label: 'Zustand',
              id: "tutorials/zustand",
            },
            {
              type: 'doc',
              label: 'MobX',
              id: "tutorials/mobx",
            },
          ],
        },
        {
          type: "doc",
          label: "Examples",
          id: "examples",
        },
      ],
    },
    {
      type: "category",
      label: "Recipes",
      collapsed: false,
      items: [
        {
          type: "doc",
          label: "Composing sagas",
          id: "recipes/composing",
        },
        {
          type: "doc",
          label: "Fetching data",
          id: "recipes/fetching-data",
        },
        {
          type: "doc",
          label: "Error handling",
          id: "recipes/error-handling",
        },
        {
          type: "doc",
          label: "Concurrency and racing",
          id: "recipes/concurrency",
        },
        {
          type: "doc",
          label: "Waiting future actions",
          id: "recipes/future-actions",
        },
        {
          type: "doc",
          label: "Debouncing and throttling",
          id: "recipes/debouncing-and-throttling",
        },
        {
          type: "doc",
          label: "Non-blocking calls",
          id: "recipes/non-blocking-calls",
        },
        {
          type: "doc",
          label: "No state management?",
          id: "recipes/no-state-management",
        },
        {
          type: "doc",
          label: "Testing",
          id: "recipes/testing",
        },
      ],
    },
    {
      type: "doc",
      label: "Glossary",
      id: "glossary",
    },
    {
      type: "doc",
      label: "API reference",
      id: "api",
    },
    {
      type: "doc",
      label: "Troubleshooting",
      id: "troubleshooting",
    },
    {
      type: "doc",
      label: "Comparing to alternatives",
      id: "alternatives",
    },
  ],
};

export default sidebars;
