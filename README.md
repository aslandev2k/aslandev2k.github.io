# aslandev2k.github.io

Portfolio of Nguyen Tien Dat, live at <https://aslandev2k.github.io>.

Built with React, TypeScript and Vite. The page is prerendered to static HTML at build time, so
it stays readable without JavaScript and link previews see the full content.

## Commands

| Command       | What it does                               |
| ------------- | ------------------------------------------ |
| `pnpm dev`    | Starts the dev server                      |
| `pnpm lint`   | Type-checks and lints                      |
| `pnpm format` | Fixes formatting and lint issues           |
| `pnpm build`  | Builds and prerenders into `dist/`         |
| `pnpm ship`   | Builds and publishes `dist/` to `gh-pages` |

## How it works

The page is one set of dots, one for every organization that has Product Go installed. As you
scroll, the same dots rearrange into a figure for each chapter: a globe, a story map, a koi, a
row of medals.

| Path                       | What lives there                                    |
| -------------------------- | --------------------------------------------------- |
| `src/data/content.ts`      | Every word and number on the page                   |
| `src/figure/formations.ts` | Where each dot sits in each figure, as plain math   |
| `src/figure/engine.ts`     | The canvas loop that moves the dots between figures |
| `src/components/`          | The text rail: hero, chapters, experience, skills   |

The Marketplace counts in `content.ts` move. Re-read them before a release.
