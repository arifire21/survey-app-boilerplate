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