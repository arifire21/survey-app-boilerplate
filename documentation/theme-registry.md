The `theme-registry.jsx` file is used to handle custom colors and style adjustments in the UI.

# Colors
By default, MUI-Joy uses 5 set of color tokens: `primary` (dark blue), `secondary` (gray), `danger` (red), `success` (green), and `warning` (yellow). The specific color values can be found [here](https://mui.com/joy-ui/customization/theme-colors/). The page also details how to add custom colors.

The `primary` color has been overridden to match the team's branding color. Feel free to replace this as you wish! To find premade sets of color values, look at the "2014 Material Design color palettes" section [here](https://m2.material.io/design/color/the-color-system.html#tools-for-picking-colors). This also has a tool that lets you specify a color hex and it generates a corresponding hex values.

This Theme also has a color token called `blueAllianceColor`. It repurposes the default blues of the `primary` token and is used in the Match Survey Results page. **For stylistic purposes, please do not change any `blueAllianceColor` values. They were specifically set up to work with the Accordion and ToggleButtonGroup components.**

# Component Style Overrides
This section of the Theme definition allows for customization of the pre-built components. More information on how this structure works can be found [here](https://mui.com/joy-ui/customization/themed-components/). Essentially, it targets the className assigned to the component and overrides the default styles for wharever is nested here.

These edits have been made to accomodate some particular form functionality. Comments have been edited to explain the reasons for the changes. The most notable overrides is `JoyModalDialog`, which is a pop-up element used to display pit survey images, and the field position guide. `JoyFormLabel` is edited to prevent text wrapping. *For stylistic purposes, unless needing advanced styling, recommended to not change these values.* 