Environment variables change the behavior of an application, passed in through a `.env.local` file on your computer, or via the Vercel settings.

- `NEXT_PUBLIC_DEV_MODE`: runs the application in Dev Mode, which pushes survey submissions to a separate table setup
- `NEXT_PUBLIC_OFFSEASON`: (not implemented yet) would use previous year's tables if available
- `NEXT_PUBLIC_SEASON_HIATUS`: essentially "read-only mode," previous records are available, but new records cannot be added.

The active mode, if any, will be displayed at the top of the screen.

In practice, these will be seen as:

  ```js
  const isDevMode = process.env.NEXT_PUBLIC_DEV_MODE;
  const isOffseason = process.env.NEXT_PUBLIC_OFFSEASON;
  const isHiatus = process.env.NEXT_PUBLIC_SEASON_HIATUS;
  ```
These variables control which API endpoint is used when submitting a form or viewing results.

(Note: the variables have `NEXT_PUBLIC` in the strings to be made visible to the browser. More info: [Bundling Environment Variables for the Browser](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables#bundling-environment-variables-for-the-browser))

The version number displayed on the homepage is read from `package.json`.