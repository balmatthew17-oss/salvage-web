# Salvage (website)

Website version of the Salvage app: faulty PS5 / PS5 Pro / Xbox Series consoles, controllers, Nvidia RTX cards and RTX gaming laptops on eBay UK, with fault tags and what each seller says is wrong.

A GitHub Actions job searches eBay every 15 minutes with your API keys, reads new listings' descriptions, and publishes the results with the site to GitHub Pages. Your keys stay in repository secrets and never reach the page.

## Setup
1. **Settings → Secrets and variables → Actions → New repository secret**: add `EBAY_CLIENT_ID` (App ID) and `EBAY_CLIENT_SECRET` (Cert ID).
2. **Settings → Pages → Source: GitHub Actions**.
3. **Actions → Check eBay and publish → Run workflow**. The site appears at `https://<your-username>.github.io/salvage-web/`.

Show/deal prices are set on the site (saved in your browser). `config.json` sets the most each search fetches (`ceiling`) and which searches run (`enabled`).
`rules.js` is generated from the Android app's fault rules so both tag listings the same way.
