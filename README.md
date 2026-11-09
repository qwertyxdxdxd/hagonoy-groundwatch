# Hagonoy GroundWatch

A Web-Based Environmental Awareness Platform on Land Subsidence in Hagonoy, Bulacan.

## How to open

Double-click `index.html`. It opens in any browser, and no installation is needed.
The Google Map on `map.html` needs an internet connection; everything else works offline.

## Pages

| File | Required section |
|------|------------------|
| `index.html` | Home Page: overview of land subsidence in Hagonoy |
| `about.html` | About Land Subsidence, plus a subsidence calculator |
| `causes.html` | Causes and Effects: groundwater extraction, flooding, infrastructure damage |
| `impact.html` | Community Impact |
| `map.html` | Interactive Map: Google Maps embed and clickable vulnerability zones |
| `solutions.html` | Mitigation and Solutions: community actions, government initiatives, sustainable practices, and a pledge |
| `learn.html` | Interactive Feature: 10-question quiz and FAQ |
| `report.html` | Community Feedback/Reporting Form (working mock-up) |
| `references.html` | References (APA 7th edition) |

Other features: dark mode (toggle in the header; follows the device setting by default), a shuffled quiz with a printable certificate for scores of 70% or higher, a filterable flood-history timeline, and a before/during/after flood guide.

Shared files: `css/style.css` and `js/main.js` (header, footer, calculator), plus `js/map.js`, `js/quiz.js`, `js/report.js`.

## Before submitting

- **Team name / members:** the footer says "Hagonoy GroundWatch Team". Edit `buildFooter()` in `js/main.js` to add your names.
- **Google Form (optional):** `report.html` contains a commented-out section with instructions for embedding a real Google Form.
- **Timeline (`impact.html`):** the flood events are major typhoons widely reported in Bulacan. Double-check the details, and add local events your group knows of (copy one `<li>` block and set `data-kind` to `trend`, `flood`, `research` or `policy`).
- **Emergency numbers (`solutions.html`):** only the national hotlines (911, 143) are built in. Visitors can type in and save local numbers. If your group confirms the official Hagonoy MDRRMO number, add it as another hotline card.
- **Check the facts:** the vulnerability map is a simplified educational diagram, not an official hazard map. Compare it with HazardHunterPH or your MDRRMO and adjust the zone descriptions in `js/map.js` if needed.

## Publishing on GitHub Pages

1. Create a public GitHub repository and upload all files (keep the `css/` and `js/` folders).
2. Go to Settings > Pages, choose the `main` branch and the `/ (root)` folder, then Save.
3. The site will be live at `https://<username>.github.io/<repo-name>/`.
