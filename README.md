# Rakesh B Choudhary — Portfolio

A modern, minimal, token-driven portfolio website. Fully responsive with light/dark themes, accessible, and optimized for GitHub Pages.

## Project Structure
- src/index.html — main page
- src/styles/ — modular CSS:
  - base.css, navbar.css, sections.css, components.css, darkmode.css, certificates.css, skills-coding.css, snake-game.css
- src/main.js, src/snake-game.js — interactivity and game
- dist/ — built (minified) output for deployment
- gh-pages/ — local Git worktree checked out to the gh-pages branch (built site only)

## Design System
- CSS custom properties for:
  - Colors, spacing, radii, borders, shadows, transitions, typography
- Minimal interactive states
- Consistent visual language across light/dark modes

## Development
- Open src/index.html in a browser (no framework required).
- Edit modular CSS and JS under src/.

## Build (minify/optimize)
Requires Node.js (npm) once:
  npm install -D clean-css-cli html-minifier-terser terser svgo

From project root (PowerShell):
  # Clean & copy
  Remove-Item -Recurse -Force dist -ErrorAction SilentlyContinue
  New-Item -ItemType Directory -Path dist | Out-Null
  robocopy .\src .\dist /E

  # Ensure styles folder exists
  New-Item -ItemType Directory -Path dist\styles -Force | Out-Null

  # Minify CSS
  Get-ChildItem .\src\styles\*.css | ForEach-Object {
    npx cleancss -O2 -o ("dist\styles\" + .Name) .FullName
  }

  # Minify JS if present
  if (Test-Path .\src\main.js) { npx terser .\src\main.js -c -m -o .\dist\main.js }
  if (Test-Path .\src\snake-game.js) { npx terser .\src\snake-game.js -c -m -o .\dist\snake-game.js }

  # Minify HTML
  npx html-minifier-terser --collapse-whitespace --remove-comments --remove-redundant-attributes --minify-css true --minify-js true -o .\dist\index.html .\src\index.html

  # GitHub Pages hint
  New-Item -ItemType File -Path .\dist\.nojekyll -Force | Out-Null

## Deploy to GitHub Pages
First time (choose existing remote gh-pages if available):
  git fetch --all
  git ls-remote --exit-code --heads origin gh-pages *> 
  if (0 -eq 0) { git worktree add .\gh-pages gh-pages } else { git worktree add .\gh-pages -b gh-pages }

Publish built files:
  robocopy .\dist .\gh-pages /MIR
  git -C .\gh-pages add -A
  git -C .\gh-pages commit -m "Build: optimized static site"
  git -C .\gh-pages push -u origin gh-pages

Enable Pages (once):
  GitHub → Settings → Pages → Build and deployment → Deploy from a branch
  Branch: gh-pages, Folder: /(root)

## Branching
- main — source of truth
- optimize-pages — working branch for optimization and docs
- gh-pages — built static site only (no source files)

## License
This portfolio and content © Rakesh B Choudhary. All rights reserved.
