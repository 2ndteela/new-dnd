# Style Guide

How Dee n' Dee should look and how its styles should be written. Values here come from the tokens in `src/index.css` (`:root`). If something you need isn't covered, add a token or a shared class rather than a one-off value.

## Look and feel

- **Dark only.** Near-black page, darker-to-lighter grey surfaces, soft white text. There is no light theme.
- **One blue family.** Navy for the header and nav, brighter steps of the same blue for buttons, selection, focus and accent text. Surfaces are greys tinted slightly toward that blue.
- **Depth comes from lightness, not shadows.** A surface that sits "on top" of another is one step lighter (five even steps). Shadows are only used for things that float: stacked cards, drawers, popovers, dialogs.
- **Fantasy headings, plain body.** Headings use Amaranth; everything else uses Open Sans.
- **Mobile first.** Most screens are designed for a phone, then spread out on desktop.

## Color

Never write a raw hex value. Use a token. The palette is "Slate": greys tinted slightly toward the brand blue, plus one blue ramp.

### Surfaces (darkest → lightest)

Five even steps. **Anything placed on a surface uses the next step up**, and hover goes one step up from whatever the element is.

| Token | Value | Use |
|---|---|---|
| `--color-bg` | `#0e1116` | Page background, fixed bottom bars |
| `--color-surface-1` | `#151a21` | Panels on the page: desktop panes, drawer sheet, side sheets, expandable cards |
| `--color-surface-2` | `#1c232c` | Cards, dialogs, list items, tracker squares, side nav |
| `--color-surface-3` | `#252e3a` | Inputs, slots and flat buttons (on a card or the page), menus, hover on `surface-2` |
| `--color-surface-4` | `#2f3a48` | Card headers, stat labels, controls inside a `surface-3` menu, hover on `surface-3` |

### Borders

| Token | Use |
|---|---|
| `--color-border` (`#3a4656`) | Card and dialog outlines, tracker squares |
| `--color-border-hover` (`#4d5b6e`) | Card outline on hover |
| `--color-surface-2` as a border | Quiet dividers on the page background (section underlines, column splits, the turn bar) |

### Text

A blue-white (`230, 237, 245`) at fixed opacities, so text picks up a hint of the palette too.

| Token | Value | Use |
|---|---|---|
| `--color-white` | `#fff` | Text on the blue header, nav, tabs and coloured buttons |
| `--color-text-strong` | 88% | Headings, labels, important values (HP, names) |
| `--color-text` | 62% | Default body text and icons |
| `--color-text-muted` | 42% | Hints, empty states, placeholders, secondary details |
| `--color-text-disabled` | 24% | Disabled text buttons |
| `--color-text-dim` | `grey` | Legacy: some older dividers and steppers. Prefer `--color-text-muted`. |

### Blues

One hue, five steps. Components use the **role** tokens, not the ramp directly.

| Ramp | Value | Role token | Use |
|---|---|---|---|
| `--blue-700` | `#1e3b56` | `--color-brand` | Header, bottom nav, tabs, panel headers, the editing banner |
| `--blue-600` | `#24527e` | `--color-primary` | Primary buttons |
| `--blue-500` | `#2d68a3` | `--color-primary-hover`, `--color-brand-secondary` | Primary hover/press; the second panel's header on the character sheet |
| `--blue-400` | `#4a8ad1` | `--color-accent` | Focus ring, current turn (triangle, square border), selected tab, active preset, checkboxes, count badges |
| `--blue-300` | `#8fb8e6` | `--color-accent-text` | Accent text: the round counter, section titles |
| | `rgba(74, 138, 209, .16)` | `--color-accent-tint` | Hover on text buttons, the ring around the current-turn square |

Use blue for **state and identity**: what's selected, what's current, what has focus, what the main action is. Keep large areas of content grey.

### Overlays

| Token | Use |
|---|---|
| `--color-overlay-light` | Hover/press on ghost and icon buttons (works on any surface, including slots and the header) |
| `--color-overlay-dark` | Darkening hover on legacy elements (side nav) |
| `--color-scrim` | Backdrop behind dialogs and the side nav |

### Status

| Token | Use |
|---|---|
| `--color-health-good` / `-warn` / `-bad` | Health fills (`#3fb970` / `#d9a53f` / `#e5534b`): above 50%, above 25%, otherwise. Fills are drawn at low opacity (0.24 in slots, 0.3 in tracker squares). |
| `--color-danger` / `--color-danger-hover` | Destructive confirm buttons (Delete, Remove, End) |
| `--color-danger-text` | Error messages, hover on remove icons |
| `--color-danger-surface` | Error banners |
| `--color-warning-surface` | Notice banners (guest mode) |
| `--color-success-text` | Positive status (signed-in icon) |

## Typography

| Role | Font | Size | Colour |
|---|---|---|---|
| Page title (header `h1`) | Amaranth | browser default (2em) | `--color-white` |
| Section / card heading (`h2`, `h3`) | Amaranth | browser default | `--color-text-strong` |
| Small heading (`h4`, `h5`) | Amaranth | 16px for `h5` | `--color-text-strong` |
| Body | Open Sans | 16px | `--color-text` |
| Secondary text, button text in tight spots | Open Sans | 14px | `--color-text` |
| Labels, hints, badges | Open Sans | 12px | `--color-text-strong` for labels, `--color-text-muted` for hints |
| Tiny captions (tracker square names) | Open Sans | 10px | `--color-text` |

- Bold (`font-weight: bold`) for buttons, input labels and badges. No other weights.
- Use heading elements for headings so they pick up Amaranth. Don't set `font-family` yourself.
- Long single-line text (names in cards, list items, squares) truncates with an ellipsis. It doesn't wrap.
- Free text the user wrote (descriptions) keeps its line breaks.

## Spacing

Use the spacing tokens. Most spacing is 8px or 16px.

| Token | Value | Typical use |
|---|---|---|
| `--space-1` | 4px | Icon padding, gap between an icon and its text |
| `--space-2` | 8px | Inside cards, between list rows, between buttons |
| `--space-3` | 12px | Comfortable padding on list items |
| `--space-4` | 16px | Page padding, dialog padding, between sections |
| `--space-6` | 24px | Large gaps, e.g. above the guest mode option |
| `--space-8` | 32px | Empty-state padding |

- Pages get 16px padding (`.page-content`).
- Stacked form fields have 8px between them (built into `.styled-input`).
- Side-by-side fields have 8px between them.

## Shape and elevation

| Token | Value | Use |
|---|---|---|
| `--radius-sm` | 4px | Buttons, small badges, inline edit fields |
| `--radius` | 8px | Cards, inputs, dialogs, menus, tracker squares |
| Pill | `10px`–`16px` | Count badges and round icon buttons only |
| `--shadow-1` | | Resting floating elements (stacked cards, desktop panes) |
| `--shadow-2` | | Lifted elements (popover menus, a card being moved) |
| `--shadow-2-soft` | | Hover on a resting card |

## Layering

Use the z-index tokens for app-level layers, in this order:

`--z-header` (10) < `--z-drawer` (20) < `--z-footer` (21) < `--z-popover` (60) < `--z-dialog` (100)

Small local values (1, 5) are fine for ordering things inside one component.

## Layout

- **Header:** 58px, blue, page title centred. A back-to-Resources ghost button sits on the left. The sign-in state sits on the right: a "Sign in" outline button for guests, a cloud icon when signed in.
- **Bottom bars:** on mobile, the character sheet's `BottomNav` (64px) is the last item in a flex column that fills the window, so it sits at the bottom without fixed positioning. The monsters page tabs (48px) are still fixed. Fixed action bars, like the turn controls, sit directly above them. On desktop the character sheet uses `SideNav` instead; `MultiPanelViewer` picks one with `useIsDesktop()`.
- **Banners:** full-width strips above the header (guest mode). They're dismissible.
- **Breakpoints:** use only these three:
  - `max-width: 480px`: small phones (tighter grids)
  - `min-width: 1024px` / `max-width: 1023px`: desktop vs. mobile/tablet (side-by-side panes, no tabs or drawers on desktop)
  - `min-width: 1200px`: wide (page width capped at 1200px)

  One exception: `StatBox` keeps a `max-width: 350px` rule that shrinks its big numbers on very small phones only.

  In JS, never hard-code a width. Use `src/assets/breakpoints.js`: `DESKTOP_MIN`, `isDesktopWidth()` for a one-time check, or `useIsDesktop()` / `useMediaQuery()` to re-render when the window crosses a breakpoint.
- **Desktop panes:** `--color-surface-1`, `--radius`, `--shadow-1`, full window height, each scrolling on its own.
- **Base layout rule:** every element inside `.App` is a centred flex column by default (`:where(.App *)` in `index.css`). It has zero specificity, so any class can set `flex-direction: row`, `align-items` or `display: block` without `!important`.

## Components

### Buttons

Use the `Button` component (`src/components/Button/Button.js`) for every new button. It renders a `<button type="button">`, passes through any other props (`onClick`, `disabled`, `aria-label`, `title`…) and forwards `ref`.

| Prop | Values | Notes |
|---|---|---|
| `variant` | `primary` (default) | Solid blue. The main action in a group (Start Initiative, Add Monster). |
| | `flat` | Solid `surface-3`, one step lighter on hover/press. Secondary actions (Randomize, Edit, End Initiative, turn arrows, Remove). |
| | `outline` | Transparent with a light outline, fills on hover/press. Low emphasis, works on coloured backgrounds (header Sign in). |
| | `text` | No background, left-aligned. Tertiary actions (Cancel) and list rows (monster search results, tabs). |
| | `ghost` | No background or border, 4px padding, translucent white on hover/press. Used for the +/- steppers; for icon-only buttons use `IconButton`. |
| | `danger` | Solid red. The destructive confirm in a dialog (Delete, Remove, End). |
| `tone` | `danger` | Ghost only: icon turns red on hover/press (remove icons). |
| | `on-color` | Ghost only: white icon, for the header or a banner. |
| `size` | `sm` | Compact padding (6px 12px) for tight rows (tracker top bar, header). |
| `fullWidth` | `true` | Stretches to the container's width. |
| `className` | | Your own class for size and position. |

```jsx
<Button variant='flat' size='sm' onClick={onEdit}>Edit</Button>
<Button variant='danger' onClick={confirm}>Delete</Button>
```

- **Spacing:** `Button` has no margin. The parent sets the space between buttons with `gap` (8px is standard).
- **Content:** buttons lay out their content in a row with a 4px gap (icon + label, label + badge). For stacked content (tabs, health presets, tracker squares) set `flex-direction: column` in your class.
- **Overriding:** use `button.your-class` or `.btn.your-class`. A single class alone ties with the variant styles and depends on load order.
- **Hover vs touch:** hover styles only apply on devices that can hover (`@media (hover: hover)`), so a tap on a phone doesn't leave a button stuck in its hover colour. Variants also have an `:active` style, which gives press feedback on touch and doesn't stick.
- **Disabled:** fades to 50% and ignores hover and clicks. `text` buttons fade their text instead.
- **Order in a row:** least important on the left, main action on the right. Destructive actions go last, and always behind a confirmation.
- **Icons:** `react-icons`. Material (`md`) for UI icons, Game Icons (`gi`) for D&D-flavoured ones.

**Raw `<button>`s.** None are left except `ExpandableCard` (the whole card is the button) and `Button` itself. The old classes (`.flat-button`, `.text-button`, `.outline-button`, `.full-button`, `.icon-button`, `.no-margin-button`) have been removed. Use the props above instead.

### Icon buttons

Any icon that does something when tapped goes in an `IconButton` (`src/components/IconButton/IconButton.js`). Never put `onClick` on a bare icon or a `div`: it gets no press feedback, no keyboard focus and no accessible name.

| Prop | Values | Notes |
|---|---|---|
| `label` | text, **required** | The accessible name and the hover tooltip ("Remove Goblin 2", "Back to encounters"). |
| `size` | `sm` | 28px button, 16px icon. Gets an invisible padding so the tap target is still 44px. For inline icons next to text (edit pencil, banner close). |
| | `md` (default) | 36px, 20px icon. Rows and headers (back arrows, remove in a list). |
| | `lg` | 44px, 24px icon. Standalone controls (header back, ⋮ menus). |
| `variant` | `ghost` (default) | No background; translucent white (`--color-overlay-light`) on hover/press. |
| | `filled` | Round `surface-3` background; `surface-4` on hover/press. Small "+" add buttons. |
| `tone` | `danger`, `on-color` | Same as `Button`. Remove icons use `danger`; icons on the header or a banner use `on-color`. |

```jsx
<IconButton label='Back to encounters' onClick={onBack}><MdArrowBack /></IconButton>
<IconButton label={`Remove ${name}`} tone='danger' onClick={remove}><MdClose /></IconButton>
<IconButton label='Add ability' size='sm' variant='filled' onClick={add}><MdAdd /></IconButton>
```

- It's built on `Button`, so it gets the same hover-only-on-hover-devices behaviour, `:active` press feedback, disabled style and `ref` forwarding.
- The button is round (`border-radius: 50%`). To change its size or shape, override with `.btn.icon-btn.your-class` (see the header back button).

### Inputs

- Use the `Input` component (`.styled-input`): a `surface-3` box with the label floating in the top-left at 12px bold. Use the `add` variant for numbers with +/- steppers, and `textarea` for long text.
- `Slot` is the bar input for "current / max" values (HP, spell slots). Its fill colour follows the health thresholds.
- To edit a name or description where it's displayed, use `EditableText`: a pencil ghost button that turns the text into an input.
- Checkboxes use the `CheckBox` component.

### Cards and surfaces

- `.surface-card` is the standard card: `surface-2`, `--color-border` outline, `--radius`.
- Card header: `surface-4`, with rounded top corners only.
- Card actions go at the bottom. A single action is full width.

### Dialogs

- Use `Dialog` (or `ConfirmDialog` for yes/no). A scrim covers the page; the panel is a `.surface-card`, 360px wide (560px with `wide`).
- Title top-left, actions bottom-right. Esc and clicking the scrim close it.
- Anything destructive (remove, end, delete) asks first.

### Dice roller

One dice roller serves the whole app. `DiceRollerProvider` wraps the app in `App.js` and renders the dialog; components use the hook:

```jsx
const { rollDice, openDiceRoller } = useDiceRoller()
rollDice(`d20 + ${modifier}`, { label: 'Stealth' })   // opens it with 1d20 + modifier and rolls straight away
openDiceRoller()                                     // opens it with whatever was set up last
```

- `rollDice` accepts `NdS + M` formulas and treats a missing or blank modifier as +0, so you can pass stored values straight in. Always give a `label` (the skill, save or attack); it becomes the dialog title.
- The dice set up are kept between opens. Changing them after a roll turns the result into "Last roll" and drops the label.
- Dice tumble in their real shapes and land on the result; a single d20 showing 20 or 1 is marked as a natural 20 or 1. With reduced motion turned on, results appear immediately.
- Dice helpers (`rollDie`, `parseFormula`, `formatFormula`, `formatModifier`, `KEYPAD_DICE`) live in `src/assets/dice.js`. Use `rollDie` rather than `Math.random()` so no roll can come out as 0.

### Feedback text

- `.empty-state`: centred muted text with generous padding, for an empty list or area.
- `.hint-text`: 12px muted text next to or under a control.
- Errors: `--color-danger-text` for inline errors; a `--color-danger-surface` banner for page-level errors.

### Badges and markers

- Count badge: a pill using `--color-accent` with white 12px text (e.g. the Add To Initiative count).
- Current item: a small accent-blue triangle above it and an accent border with a soft ring (initiative order).
- Selected item: a `--color-text-strong` border.
- Keyboard focus: a 2px `--color-accent` outline (global `:focus-visible` rule). Don't remove it.
- Inactive item (defeated monster): greyscale at 40% opacity, but still clickable.

## Motion

- Hover colour changes: 0.2s–0.3s (`.2s` is most common).
- Drawers and panels sliding: 0.3s.
- Larger movements (side nav, panel swaps): 0.5s.
- Health fills animate their size at 0.2s.

Animate specific properties (`transition: background-color .2s`) rather than `all` when possible.

## Writing styles

- **Tokens only.** No raw colours, radii, shadows or app-level z-index values.
- **One CSS file per component**, next to it, named after it. Class names are kebab-case and prefixed with the component (`tracker-card-header`, `setup-row`).
- **Classes, not IDs.** Older code styles by `#id`; don't add more.
- **No inline `style={{}}`** except for values computed at runtime (widths, percentages, CSS variables). Inline styles can't do hover, media queries or `!important`.
- **Reuse what exists** before writing new styles: the `Button` component, and the shared classes `.surface-card`, `.empty-state`, `.hint-text`.
- **Hover:** put every `:hover` rule inside `@media (hover: hover) { … }`, and add an `:active` style if a tap needs feedback.
- **No `!important`.** The global defaults (`:where(.App *)` and the base `button` rule) have zero specificity, so any class overrides them. If you think you need `!important`, the selector is probably too weak. Use `button.your-class` or add a class.

## Known inconsistencies

Tracked for future clean-up:

- 28 `!important` remain. Most are in older helpers (`.button-box`, `.push-start`/`.push-end`, `#no-bottom-pad`, `.with-bottom-nav`, Pack's `.multi-input`, Slot's health colours) or are deliberate show/hide toggles in media queries on the monsters page.
- Inline styles are down to runtime values only (health fill heights, Slot bar widths, ExpandableCard width).
- Some clickable rows and cards are still `div`s or `span`s rather than buttons: weapon/skill/spell rows, stat boxes, the class picker, the expansion panel header and the "New Blank Spell" box. They work, but have no keyboard focus.
- `--color-text-dim` (`grey`) and `--color-neutral-light` (`lightgray`) only exist for older components. New work shouldn't use them.
- Section headings are inconsistent: some are left-aligned with an underline (tracker setup), others are centred by the flex default.
