# CLAUDE.md - My Timer Project

## Build Commands
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run generate # Generate static site
npm run preview  # Preview production build
```

## Code Style Guidelines
- **Components**: Use Vue SFCs with `<script setup>` composition API
- **Naming**: PascalCase for components/types, camelCase for functions/variables
- **Imports**: Use `~/` alias for project root, `import type` for type imports
- **Types**: Define types in `/types` directory with .types.ts suffix
- **Composables**: Prefix with "use", place in `/composables` directory
- **Error Handling**: Throw Supabase errors, use null checks defensively
- **State Management**: Use composables for state (useTimeEntries, useGoals)
- **Functions**: Use parameter destructuring, return promises for async ops
- **Styling**: Tailwind CSS with DaisyUI, theme utilities in ThemeController