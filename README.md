# 003 - Gym Rest Timer

A minimal rest timer for strength training.

[Open the live app](https://keigokudo.github.io/gym-rest-timer/)

Gym Rest Timer is designed for one simple job: start a rest period quickly between sets without navigating menus, creating an account, or entering the same duration repeatedly.

## Features

- One-tap 60, 90, 120, and 180 second rest timers
- Custom rest duration
- Pause and resume
- Reset the current timer
- Track completed sets
- Clear visual countdown progress
- Responsive layout for desktop and mobile
- No account or setup required

## Why I Built It

Most timer apps include more features than I need during a workout.

This project focuses on the few interactions that matter between sets: choose a rest time, check the remaining time at a glance, and get back to training.

The interface is intentionally dark, high-contrast, and distraction-free so it can be checked quickly in a gym environment.

## Tech Stack

- React
- TypeScript
- Vite
- CSS

## Getting Started

Install the dependencies:

    npm install

Start the development server:

    npm run dev

Then open the local URL shown by Vite in your browser.

## Production Build

Create a production build:

    npm run build

Preview the production build locally:

    npm run preview

## Design Principles

The UI is built around a few simple principles:

- Fast interaction between sets
- Large, readable timer display
- Minimal visual noise
- High contrast in bright or dark gym environments
- Comfortable use on a phone
