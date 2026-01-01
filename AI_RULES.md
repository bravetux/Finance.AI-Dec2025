# Tech Stack & Development Rules

- **Framework**: React with TypeScript.
- **Routing**: React Router (Routes are maintained in `src/App.tsx`).
- **Styling**: Tailwind CSS.
- **UI Components**: shadcn/ui (Radix UI primitives).
- **Icons**: lucide-react.

## Project Structure
- `src/pages/`: Main page components.
- `src/components/`: Reusable UI components.
- `src/utils/`: Utility functions and logic.
- `src/hooks/`: Custom React hooks.

## Guidelines
- **Privacy First**: All data must be stored in `localStorage`. No external API calls for user data.
- **Responsiveness**: Always build with mobile-first or highly responsive layouts.
- **Maintainability**: Keep components small (aim for < 100 lines) and focused.
- **shadcn/ui**: Use existing components from `@/components/ui/`. Do not modify files inside the `ui` folder directly; instead, create wrappers or new components in `src/components/` if custom logic is needed.
- **State Management**: Use React state or `localStorage` via hooks.