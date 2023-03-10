# Pages

This folder should contain React components that are responsible for rendering entire pages such as the login page or the dashboard. They are the components that React-Router render for each route.

Although they are not conceptually different than the components in `/components`, page-generating components should be put here for organisation's sake.

## Naming convention:

Same as normal components: files names in UpperCamelCase.

## CSS Importing

When possible, CSS files should be imported from a page component or a normal component rather than `App.js`. This is because imported CSS files are inherited by all children and there may be conflicts between pages worked on by different people.