# Vault Runners

A mobile-first, Borderlands-style loot shooter built with Phaser 3 + TypeScript. Pick one of 6 characters, each with a unique action skill and skill tree, fight through waves of enemies, and gear up with procedurally generated guns, shields, grenades, class mods, and artifacts.

## Requirements

- [Node.js](https://nodejs.org/) 18+ and npm

## Running the game

```bash
npm install
npm run dev
```

This starts a Vite dev server (default: http://localhost:5173). Open that URL in a browser — a mobile browser or your desktop browser's device-emulation mode works best, since controls are touch-first (virtual joystick + on-screen buttons).

## Other commands

```bash
npm run build      # type-check (tsc --noEmit) and build for production
npm run preview    # preview the production build locally
npm run test       # run the unit test suite once
npm run test:watch # run the unit test suite in watch mode
```

## How to play

1. Pick a character from the character-select grid.
2. Use the left-side virtual joystick to move.
3. Hold the **FIRE** button to auto-aim and shoot the nearest enemy.
4. Use **MELEE**, **NADE** (grenade), and **SKILL** (action skill, has a cooldown) for combat options.
5. Walk over loot drops to add them to your backpack.
6. Tap **BAG** (top right) to open your Inventory and equip/unequip gear, or **TREE** to open your Skill Tree and spend skill points earned from leveling up.
