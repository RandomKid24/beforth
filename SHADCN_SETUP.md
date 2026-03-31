# Shadcn UI Setup Instructions

Your project currently has a Shadcn-compatible structure (`src/components/ui`), but the Shadcn CLI has not been initialized. If you want to add official Shadcn components in the future, follow these steps:

## 1. Initialize Shadcn CLI

Run the following command in your terminal:

```bash
npx shadcn-ui@latest init
```

### Recommended Responses during Init:
- **Style**: Default
- **Base color**: Slate
- **TypeScript**: Yes
- **Global CSS**: `src/index.css`
- **CSS Variables**: Yes
- **Tailwind Config**: Leave default (Tailwind 4 detection might vary, so ensure it points to your `@theme` or config if prompted)
- **Components Alias**: `@/components`
- **Utils Alias**: `@/lib/utils`
- **React Server Components**: No (since this is a Vite client-side app)

## 2. Why `/components/ui`?

Shadcn uses the `/components/ui` directory to store base primitive components (like Buttons, Inputs, Dialogs). Keeping this structure is important because:
- **Portability**: It makes it easy to copy-paste components from the Shadcn registry.
- **Convention**: Developers and AI assistants expect base UI primitives to be in this specific folder.
- **Separation of Concerns**: Keeps your complex business logic components (`/components`) separate from your UI building blocks (`/components/ui`).

## 3. Adding Components

Once initialized, you can add any Shadcn component using:

```bash
npx shadcn-ui@latest add [component-name]
```

Example:
```bash
npx shadcn-ui@latest add button
```
