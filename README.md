# Theo Kay Portfolio

Static portfolio site for Theo Kay featuring glassmorphism styling, a portfolio gallery, testimonial carousel, and Formspree contact integration.

## Deployment checklist

- Replace `yourFormId` in `index.html` with your actual Formspree form ID.
- Verify the `assets/` paths are correct and all images exist.
- Confirm `og:url` in `index.html` points to the final live domain.

## Recommended deployment options

### GitHub Pages

1. Push this repository to GitHub.
2. In repository settings, enable **Pages**.
3. Select the `main` branch and `/ (root)` folder.
4. Save and wait for the site URL.

### Netlify

1. Log in to Netlify.
2. Create a new site from Git.
3. Connect the repository and deploy from the root folder.
4. Optionally set custom domain and HTTPS.

### Vercel

1. Log in to Vercel.
2. Import the repository.
3. Select the root directory as the project source.
4. Deploy and configure your domain.

## Notes

- `index.html` is the entry point.
- `styles.css` contains the page styling.
- `script.js` handles form submission, navigation, portfolio modal, and carousel behavior.
- `portfolio.json` supplies portfolio items for the modal gallery.

## Local testing

Open `index.html` directly in a browser or use a simple local server:

```bash
# Python 3
python -m http.server 8000
```

Then visit `http://localhost:8000`.
