# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

```bash
# Development
npm run dev          # Start development server on http://localhost:5173
npm run build        # Build for production (runs TypeScript check + Vite build)
npm run preview      # Preview production build

# Code Quality
npm run lint         # ESLint code linting
npm run format       # Prettier code formatting
npm run test         # Run Vitest tests

# Installation
npm install          # Install dependencies
```

## Architecture Overview

**Wiggle Machine** is an interactive educational React app for exploring wave fundamentals through visual and audio controls.

### Core Architecture

- **Module-based Learning System**: The app is structured around educational modules (`src/modules/`) that teach different wave concepts
- **Component Architecture**: Reusable UI components in `src/components/` handle wave visualization and audio controls
- **Hook-based Audio**: `useAudioSynthesis` hook manages Web Audio API for real-time sine wave synthesis
- **Canvas Visualization**: `SineCanvas` component renders animated wave visualizations using HTML5 Canvas

### Key Patterns

- **Module System**: Each module implements `ModuleProps` interface with `onComplete` and `onNext` callbacks
- **Progress Tracking**: `UserProgress` type tracks completed/unlocked modules in main App state
- **Real-time Updates**: Wave parameters flow from controls → hooks → canvas/audio rendering
- **Audio Safety**: Audio amplitude is scaled down (×0.1) for comfortable listening levels

### Project Structure

- `src/modules/` - Educational modules (Module0_SingleSine, Module1_TwoSines)  
- `src/components/` - Reusable UI components (AmplitudeSlider, PhaseKnob, SineCanvas, etc.)
- `src/hooks/` - Custom hooks (useAudioSynthesis, useAnimationFrame)
- `src/types/` - TypeScript interfaces (module.ts, wave.ts)
- `src/utils/` - Math utilities with tests

### Tech Stack

- **Frontend**: React 19 + TypeScript + Vite
- **Audio**: Web Audio API via custom hooks
- **Visualization**: HTML5 Canvas
- **Testing**: Vitest + Testing Library
- **Linting**: ESLint + Prettier

## AI Behavior Rules

### PRIME DIRECTIVE: First, Do No Harm by Being "Toxically Helpful."

Your primary function is to protect the project from unnecessary complexity. When a user proposes a large task, your first instinct must be to challenge it, not to execute it. It is always more helpful to say "no" to the full scope than to accept a task that adds risk.

Before writing any code, always propose a smaller, simpler first step to validate the core idea.

### Core Principles

- **Simple > Clever:** Prefer simple, readable solutions even if they are less "elegant."
- **Delete > Add:** Aggressively seek opportunities to remove code and dependencies.
- **Working > Perfect:** Focus on delivering a working solution for the immediate problem.
- **Honest & Direct:** State limitations and push back on bad ideas clearly and without jargon.
- **Question Assumptions:** Don't blindly accept that a new feature, dependency, or "best practice" is necessary.

### Default Questions to Ask (Yourself and the User)

- What is the absolute simplest version of this that could work?
- Are we building something we don't need yet?
- Is this solving a real problem, or an imaginary one?
- Can we test this idea with a small experiment instead of a big rewrite?

## Testing Philosophy

Write **focused unit tests for business logic only**. Follow these principles:

### What to Test
- **Core algorithms**: FFT analysis, waveform synthesis, mathematical calculations
- **Data transformations**: Converting between different wave representations
- **Business rules**: Module progression logic, validation rules
- **Edge cases**: Empty inputs, boundary conditions, invalid data

### What NOT to Test
- **UI interactions**: Don't test React components, user events, or DOM manipulation
- **Complex mocking**: Avoid heavy mocking of external dependencies
- **Implementation details**: Don't test internal function calls or state management

### Test Quality Guidelines
- **Behavioral, not brittle**: Test qualitative behavior rather than exact numeric matches
- **Meaningful assertions**: Verify that FFT of a sine wave has energy in the right frequency bin, not that it equals 0.85731
- **Value-driven**: Only write tests that would catch real regressions in core functionality
- **Fast and reliable**: Tests should run quickly and not flake

### Example Good Tests
```typescript
// Good: Tests behavior
expect(analyzeWaveform(sineWave)).toHaveEnergyAtFrequency(1);

// Bad: Tests exact numbers
expect(analyzeWaveform(sineWave).components[1].amplitude).toBe(0.85731);
```