# @nfdi4plants/arc-web-view ![NPM Version](https://img.shields.io/npm/v/%40nfdi4plants%2Farc-web-view)

An Annotated Research Context web viewer in the style of GitHub's Primer ProductUI.

Displays basic information about an ARC ([Annotated Research Context](https://arc-rdm.org/)) and allows to navigate through its structure.

👀 check out the [demo](https://freymaurer.github.io/ARCWebView/)

# Install

`npm i @nfdi4plants/arc-web-view`

```tsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BaseStyles, ThemeProvider } from '@primer/react'
import '@primer/primitives/dist/css/functional/themes/light.css'
import "@primer/css/dist/primer.css";
import { WebViewer } from '@nfdi4plants/arc-web-view'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <BaseStyles>
        <WebViewer /> // will load with empty view
      </BaseStyles>
    </ThemeProvider>
  </StrictMode>,
)

```

# development

This component uses GitHubs Primer ProductUI.

Find more information below:

- Components: https://primer.style/product/components/
- Responsive: https://github.com/primer/css/blob/b5e009778ec01b6e983cba6cbf89cebfdc5a4124/docs/content/support/breakpoints.md#media-query-mixins

## Public components

1. Apply changes
2. Change version in `package.json`
3. Build component library `npm run build:lib`
4. Publish component library `npm publish --access public`

## Deploy to GitHub Pages

1. Deploy using `gh-pages` npm library: `npm run deploy`

## Build WebApp 

1. build web app using `npm run build`