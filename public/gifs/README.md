# Exercise GIFs

This folder contains animated GIFs for exercise demonstrations.

## File Naming Convention

Use kebab-case matching the exercise name:
- "Bench Press" → `bench-press.gif`
- "Romanian Deadlift" → `romanian-deadlift.gif`
- "Pull-ups" → `pull-ups.gif`

## Recommended Specifications

- **Width:** 400-600px
- **Frame rate:** 10-15 fps
- **File size:** Under 2MB per GIF
- **Format:** GIF or WEBP

## Example Files Needed

### Bodybuilding
- bench-press.gif
- incline-bench-press.gif
- decline-bench-press.gif
- dumbbell-bench-press.gif
- chest-flyes.gif
- cable-flyes.gif
- squats.gif
- leg-press.gif
- deadlift.gif
- romanian-deadlift.gif
- barbell-rows.gif
- pull-ups.gif
- lat-pulldown.gif
- shoulder-press.gif
- lateral-raises.gif
- bicep-curls.gif
- tricep-dips.gif

### Calisthenics
- push-ups.gif
- diamond-push-ups.gif
- pike-push-ups.gif
- pull-ups.gif
- chin-ups.gif
- dips.gif
- pistol-squats.gif
- handstand-push-ups.gif
- l-sit.gif
- plank.gif

### Pilates
- hundred.gif
- roll-up.gif
- leg-circles.gif
- rolling-like-a-ball.gif
- single-leg-stretch.gif
- double-leg-stretch.gif
- spine-stretch.gif
- swan.gif
- side-kick.gif
- teaser.gif

## Usage

GIFs are referenced in `src/data/exercises.json`:

```json
{
  "name": "Bench Press",
  "animation": "/gifs/bench-press.gif",
  ...
}
```
