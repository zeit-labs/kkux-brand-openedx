# Open edX Brand Package Interface

This project contains the default branding assets and style used in Open edX
applications. It is published on npm as `@openedx/brand-openedx`.

The file structure serves as an interface to be implemented for custom
branding and theming of Open edX.

## How to use this package

Applications in Open edX are configured by default to include this
package for branding assets and theming visual style.

To use a custom brand and theme...

1.  Fork or copy this project. Ensure that it lives in a location
    accessible to Open edX applications during asset builds. This may be
    a published git repo, npm, or local folder depending on your
    situation.
2.  Replace the assets in this project with your own logos or SASS
    theme. Match the filenames exactly. Open edX applications refer to
    these files by their filepath. Refer to the brand for edx.org at
    <https://github.com/edx/brand> for an example.
3.  Configure your Open edX instance to consume your custom brand
    package. Refer to this documentation on configuring the platform:
    https://docs.openedx.org/projects/openedx-proposals/en/latest/architectural-decisions/oep-0048-brand-customization.html
    [TODO: Add a link to documentation on configuring in Open edX MFE
    pipelines when it exists]
4.  Rebuild the assets and microfrontends in your Open edX instance to
    see the new brand reflected. [TODO: Add link to relevant
    documentation when it is completed].

## Files this package must make available

`/logo.svg`

![logo](/logo.svg)

`/logo-trademark.svg` A variant of the logo with a trademark ® or ™.
Note: This file must be present. If you don't have a trademark variant
of your logo, copy your regular logo and use that.

![logo-trademark](/logo-trademark.svg)

`/logo-white.svg` A variant of the logo for use on dark backgrounds

![logo-white](/logo-white.svg)

`/favicon.ico` A site favicon

![favicon](/favicon.ico)

`/paragon/images/card-imagecap-fallback.png` A variant of the default
fallback image for [Card.ImageCap] component.

![card-imagecap-fallback](/paragon/images/card-imagecap-fallback.png)

`/paragon/fonts.scss`, `/paragon/_variables.scss`,
`/paragon/_overrides.scss` A SASS theme for
[\@edx/paragon](https://github.com/openedx/paragon). Theming
documentation in Paragon is coming soon. In the meantime, you can start
a theme by the contents of [\_variables.scss (after line
7)](https://github.com/openedx/paragon/blob/master/scss/core/_variables.scss#L7-L1046)
file from the Paragon repository into this file.

## Development

### Prerequisites

- Node.js 18.17.0 (pinned via `.nvmrc`; run `nvm use` to switch)
- npm 9+

### Build the dist/ artifacts

The committed `dist/paragon-theme-*.css` files are **generated
artifacts**, not source. The source of truth is:

| Source | Compiles to | Used by |
|---|---|---|
| `paragon/_variables.scss` | `dist/paragon-theme-core.css` | `<link rel="preload" as="style">` (Paragon 23+ core CSS custom properties) |
| `paragon/_overrides.scss` | `dist/paragon-theme-variants-light.css` | Webpack entry point (light-variant selector-specific overrides) |
| `paragon/_fonts.scss` | (no compiled output) | Imported directly by MFE `App.scss` as `@edx/brand/paragon/fonts` — only contains an `@import url(...fonts.googleapis.com...)` declaration |

`dist/theme-urls.json` is the legacy-schema manifest
(`paths.minified`/`paths.default`) consumed by
`@openedx/frontend-build`'s `getParagonThemeCss` for webpack bundling.
It's hand-written and unchanged by the build pipeline.

### Workflow for editing brand colors / typography

```bash
nvm use                     # pick up .nvmrc (Node 18.17.0)
npm ci                      # install sass + transitives from lock file
# edit paragon/_variables.scss or paragon/_overrides.scss
npm run build               # regenerate dist/paragon-theme-*.css
git add paragon/ dist/      # commit SCSS sources + regenerated dist/ together
git commit -m "feat(brand): ..."
git push
```

`.github/workflows/build-dist.yml` runs on every PR + push to
`kkux.teak.prod` and `master`. It runs `npm ci && npm run build` and
verifies that the regenerated `dist/` matches the committed `dist/`.
If you forget to regenerate, CI fails with the actionable error:

> Run locally to regenerate, then commit:
>   npm ci
>   npm run build
>   git add dist/
>   git commit -m 'chore(brand): rebuild dist from SCSS'
>   git push

### Why sass is pinned to ~1.99.0

`engines.node`:
- `sass@1.99.0`: `>=14.0.0` — runs on Node 18.17.0 (our CI runner)
- `sass@1.100.0+`: `>=20.19.0` — would force a `.nvmrc` bump to Node 20+

`~1.99.0` (tilde) is intentional — it excludes the 1.100+ line so a
future `npm install` can't accidentally bump past the Node-18-compatible
range. If you do want Node 20+ sass, bump `.nvmrc` to 20 first, then
unpin sass.