Recommended to change these placeholder values!

# page.js
- game logo (in public > images)

# Layout.js
- metadata.title (will be the tite of the "app" when saved to Home Screens)
- metadata.description (team number, FRC or FTC designation if desired)

# package.json
- name
- version (app version to match changelog. Is used displaying the version on the homepage)

# match-survey.js
- image used for Driver Station layout (public -> images) Used in modal at the bottom of the file, triggered by the "View Guide" button.

# match-results.js
- `color: row.team_number==='XXX' ? '#04269b'` is used to highlight your team in the Accordion

# data folder
- lists of teams attending, used for the Autocomplete fields