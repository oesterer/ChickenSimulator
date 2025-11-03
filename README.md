# Chicken Simulator

A browser-based top-down farm playground starring a hungry chicken, a mischievous dog, and a flock of autonomous coop-mates. The project is written in modern JavaScript (ES modules) and renders with the Canvas 2D API.

## Quick Start

1. Install dependencies (none required – the game is pure client-side).
2. Serve the project root with any static web server, for example:
   ```bash
   python3 -m http.server 8000
   ```
3. Visit [`http://localhost:8000`](http://localhost:8000) and the game loads from `index.html`.

> Opening `index.html` directly via the `file://` protocol is blocked because ES module imports require an HTTP(S) origin.

## Gameplay Overview

- **Player**: Collect corn to increase your score. Movement uses keyboard arrows or WASD.
- **Corn**: Randomly scattered stalks re-spawn elsewhere once eaten. NPCs and the player compete for the same supply.
- **Dog**: Hunts for the nearest chicken (player first, NPCs second). After catching someone the dog picks a new target.
- **NPC Chickens**: Wander organically, bob with subtle animation, eat corn when they find it, and sprint away from the dog when it gets close.

## Project Structure

```
assets/
  images/ ... sprites and background art
  audio/  ... sound effects
src/
  core/      game loop, input, camera, bootstrap logic
  entities/  actor classes (player, dog, corn, NPC chickens)
  services/  asset & sound managers
  systems/   shared systems (background renderer, collision)
  util/      utilities such as `Vector`
  world/     map data, world helpers, waypoint logic
index.html   entry page (imports `src/main.js` as an ES module)
favicon.ico  simple placeholder icon
```

Key modules include:
- `src/main.js`: bootstraps the asset loader and starts the game.
- `src/core/game.js`: orchestrates update/render cycles and manages global state.
- `src/world/world.js`: exposes terrain data and helper functions (`randomPoint`, `clampToBounds`).
- `src/entities/*`: define behaviour for each in-game actor.

## Extending the Game

- **Add new assets** by dropping them into `assets/images` or `assets/audio` and referencing them in `src/main.js`.
- **Create new NPC behaviours** by enriching `NpcChicken` or introducing additional entity subclasses and systems.
- **Enhance AI** via the dog’s `findTarget` / `chaseTarget` logic or by adding new steering systems.
- **Add UI or menus** directly in `index.html` or by introducing new canvas overlays inside `src/core/game.js#draw`.

## Development Tips

- Use a module-friendly bundler (Vite, Parcel, etc.) if you outgrow the simple static server.
- Keep logic modular by adding new files under `src/` and importing them explicitly; ES modules allow tree-shaking if you later introduce a build step.
- Consider writing automated tests for non-rendering modules (e.g., vector math, AI helpers) with a browser-friendly test runner.

Enjoy expanding the coop!
