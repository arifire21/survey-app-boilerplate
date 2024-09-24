# 2024
# Pre-Release
## v0.1.0
- porting over code from defunct PWA
- Next-ifying it, with statefuls

# SFL
## v1.0.0
- integrated with Vercel postgres
- cleaned up GET rendering

# Post-SFL
## v1.1.0
- added custom styling to drivetrain buttons again
- corrected icons

## v1.1.1
- fix onInputChange by using `onChange`
- fix Autocomplete value not clearing on submit by using `value`
- fix rendering ternary in db-view

## v2.0.0
- match survey form
- api points made
- basic match result render with colored backdrop
- fix autocomplete and match number not using numeric keyboard (#4)

## v2.0.1 (MVP State)
- fix [#7](https://github.com/arifire21/744-survey/issues/7)

## v2.1.1
- fix [#5](https://github.com/arifire21/744-survey/issues/5)
- added extra conditionals/questions to forms for clarity
- changed `numeric` inputMode to `tel` to use more optimized number keyboard
- split pit and match views into two pages
- fix [#10](https://github.com/arifire21/744-survey/issues/10)
- added SERIAL PRIMARY KEY `id` field to both tables
- uninstall sqlite packages - unused

# Orlando
## v3.0.0
- team list updated to orlando roster
- change `tel` to `decimal` - fix #4 again?
- added `practice` match type
- changed drivetrain radio button colors for clarity
- added placeholder text to Autocompletes for clarity
- Pit Survey filtering
    - all: sorted in ascending order
    - by team number: avail options grabbed from posted array
    - by [x] trait: via select dropdown

## v3.0.1
- getting team numbers from posted array now works correctly (via useState)
- hotfix: match number cannot be 0, added error message

## v3.0.2
- hotfix: increment matchNumber + 1 to avoid error (new issue, onchange does not fire after form submit [#16](https://github.com/arifire21/744-survey/issues/16))
- added dev tables, dev mode in development
- indented section details and adjusted margins for cleaner/more compact look
- while better match result rendering is developed, added sorting to improve readability
    - sorts by match number, then alliance color, to map/render them in sequence of red then blue
    - MUI Accordion (collapsible) per mapped item, to help with visual busyness
- [Saturday Hotfix] Pit and Match Surveys: change feedback max length to 500 chars

# Post-Orlando
## v4.0.0
- dev and postseason modes added, toggled via ENVs
    - for serving as a portfolio example
    - for archiving results
- organizing some files

## v4.1.0
- [#11](https://github.com/arifire21/744-survey/issues/11) Adding image upload capability to form
    - frontend buttons
    - image preview
    - image size state variable (Vercel has limit of 4.5MB)
    - server upload / api

## v4.1.1
- added modal to pit results view, for better viewing on mobile devices
- fixed image preview breaking when re-uploading (used `parentNode.remove(element)` instead of `element.remove`)
- moved `match.module.css`

## v4.2.1
- [Match Survey] Production Bug fixed [#26](https://github.com/arifire21/744-survey/issues/26)
    - was not explicitly returning `return res.json()` in `getData()`. This lead to it being consumed without being passed to `pitDataHelper()` (which is what helps sets the state variables)
- App mode clarification:
    - changed "postseason" to "offseason" to stay in consistent with verbiage
    - "offseason mode" will now be set up to link to the past years' databases
    - "hiatus mode" will now now do what "postseason mode" did - not allow users to submit new records, only view ones from past matches/competitions
- [Pit Survey] added correct `submitHelper()` method to file
- [Pit Survey] changed `handleImages()` to `handleImageAssignmentPreview()` for clearer naming
- if no images are uploaded (~~`[ref].current.files` has a length of 0~~ if `img.hasOwnProperty('files')`, because it becomes a `File` Object, and loses the `files` array property), `uploadImage()` will return `null` prematurely (`frontImgBlobURL` or `sideImgBlobURL` set to `null`) and not attempt to run its API call
    - caught hidden oversight of not resetting refs after submitting (images could be resubmitted accidentally even without uploading any new ones, the ref would still exist)
- [Pit Results] added check for duplicate team numbers avoid any possible "duplicate key" warnings
- [Pit Results] caught overlooked bug of RadioGroup suddenly having an `<empty string>` value. Switched `onClick` event to `onChange` as per MUI docs, and it is now a proper "controlled component."
- API: updated returned error object to display proper error text
- FIXME: fixing image size state render is on hold, is QOL fix and not pressing bug
- FIXME: found occasional API error where a value goes over SQL field 20 char limit?