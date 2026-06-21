- [x] add mac command, option, control, AND fn ui to keys
- [x] add function row + touch id as DISPLAY_ONLY but they are not allowed to be edited
- [x] refine MacBook Pro Touch ID geometry so all rows share the keyboard body width
- [x] replace QMK/VIA special-key legends with Mac-style labels
- [x] show shifted physical legends on number and symbol keys
- [x] preview shifted legends while holding either Shift key
- [x] proper layer setup for default mac os

---

- [ ] removal not-needed
- [x] all themes but default dark and default light
- [x] via+discord+github link items from header
- [x] design tab
- [x] slider mode
- [x] any of the rgb stuff or keyboard stuff that will not be relevant on mac os
  - [x] remove Lighting pane, lighting submenus, lighting Redux slice, V2 lighting data loading, and visible QMK/WT lighting keycode menu data
  - [x] audit and remove remaining lower-level RGB/backlight byte maps, keyboard API helpers, per-key color painter hooks, and legacy custom-keyboard controls
- [x] remove debug route, debug mode picker entry, diagnostics menu, renderer debug scaffolding, and unused debug helpers

---

- [x] remove ALL themes and fallback to just 1 custom theme (1 dark mode and 1 light mode) we will create that follows apple design guide and is dark mode. (edit the entire page via design system and be sure we do not break anything afterwards ui wise for not being able to see stuff...literally every single color and css token needs to be evaluated and maped to proper apple, for example the pink highlight for key press should be blue, etc.)
- [x] centralize readable control, select, input, action-editor, and tooltip colors behind shared tokens
- [x] remove blue stage wash and neutralize default MacBook keycap accent keys
- [x] reduce top navigation selected state from filled blue to subtle Apple-style selection chrome
- [x] centralize canvas/WebGL renderer accent colors and keycap shadows
- [x] map warning and generic detail text to Apple theme tokens
- [x] in light mode the keyboard should be white, in dark mode it is already correctly black
- [x] replace the subtle blue accent/focus border on selects with the stronger Apple blue used by toggles; current alternate blue border looks off
- [x] tokenize loader artwork chrome and encoder texture highlight/shadow colors
- [x] keep Configure bottom section centered and move its section switcher into a horizontal top bar inside the bottom section
- [x] centralize bottom-section chrome and remove route-level sidebars from Configure, Settings, Key Tester, and Errors
- [x] remove settings route, move all into header top right hamburger menu, when the hamburger menu opens, everything is a standard toggle...it should be hamburger top right, then next to it on the left should be the local/language option right next to it

---

- [x] move to pnpm, with workspace rul for minimum release age to be 14 days
- [x] major upgrades for packages
- [x] remove dendencies that are no longer relevant to this fork - hard audit
  - [x] remove legacy 3D/WebGL renderer and React Three dependency stack now that the Mac planner is 2D only
  - [x] remove React-18-only VIA macro script editor autocomplete dependency
  - [x] audit and remove remaining VIA USB/HID connection paths, keyboard API byte transport, and QMK key-byte conversion once the Karabiner workspace model fully owns key editing
- [x] remove package.json commands that are not relevant to this fork
- [x] replace readme with information that this is a WIP fork of via frontend so that we can map apple keyboards to karabiner...it will support editing all mac os keys except the function row, touch id, and the globe key.
