# globals.css
- has classes shared with both results pages and survey forms
    - `detail` provides spacing between indiv text items
    - `full-results-container` to handle spacing/wrapping of each set of items
    - `item-container` to contain details within blue borders
    - `item-number` to show team or match number centered in container
- has classes shared globally to all pages, mainly just the `dev-mode-container` and `dev-mode-box`

# theme-registry.jsx
- used with Material-UI Joy to provide custom styling
    - override `primary` color with custom team blue
    - new color variable to mimic blue alliance color, using original `primary` hex codes
    - style overrides of pre-made components