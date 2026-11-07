# Eventora – Responsive Event Management Website

A modern, mobile-first event discovery and registration site built with **vanilla HTML5, CSS3 and JavaScript (ES6+)**. No build step, no dependencies.

## Features
- Hero section with *Explore Events* CTA, plus featured and upcoming events
- Event cards with image, name, date, venue and short description
- Live search by name and category filter chips, with a clear empty state
- Event details dialog (image, title, date, time, venue, category, description) with **Register Now**
- Registration form with JavaScript validation (required fields, email format, 10-digit phone, event selection) and a confirmation message
- Responsive layout (phone, tablet, desktop), accessible navigation, keyboard focus styles, reduced-motion support

> Registration is a front-end demo: no data is sent or stored, as there is no backend.

## Technologies
HTML5 · CSS3 (Grid, Flexbox, custom properties) · JavaScript ES6+ · Git/GitHub

## Project structure
```
index.html
css/styles.css
js/events.js   # event data
js/app.js      # rendering, search/filter, dialog, validation
```

## Run locally
Open `index.html` in a browser, or serve the folder:
```
python -m http.server 8000   # then visit http://localhost:8000
```

## Deploy
- **GitHub Pages:** Settings → Pages → Deploy from branch `main` / root.
- **Netlify / Vercel:** import the repo; no build command, publish directory `/`.

## Screenshots
Add screenshots to `assets/` and link them here:
`![Home](assets/home.png)` `![Events](assets/events.png)`

## Author
Your Name · your-github-username
