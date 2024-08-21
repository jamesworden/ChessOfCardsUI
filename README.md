# ChessOfCardsUI

## What is this?
This repository contains the code for the UI in [chessofcards.com](https://chessofcards.com/).

---

## Developer Commentary

### Deploying to production

- First, you must build the artifact that you intend to deploy. Use `build:prod` to build the project pointed at the production API. The build artifacts will be stored in the `dist/` directory.
- Then, reveal the contents of the ChessOfCardsUI folder in your file explorer. We will use these files later.
- Open a new browser tab to sign into the AWS Console. Go to S3 and find `chessofcards.com`. Replace all of its existing contents with that of the ChessOfCardsUI folder previously mentioned.
- All set! Note that there is no support for artifact versioning at this time.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).
