# Voice Agent Frontend

## Environment Configuration

This project uses Vite's environment variable system to distinguish between local development and production environments.

### Environment Files

-   `.env`: Default environment variables (included in git)
-   `.env.local`: Local overrides (not tracked in git)
-   `.env.production`: Production environment variables (included in git)

### Available Environment Variables

-   `VITE_ENV`: Can be 'local' or 'prod'

### Using Environment Variables in Code

```typescript
import { getEnvironment, isLocalEnvironment, isProductionEnvironment } from "@/lib/env";

// Get the current environment
const env = getEnvironment(); // Returns 'local' or 'prod'

// Check if we're in local development
if (isLocalEnvironment()) {
    // Do something only in local development
}

// Check if we're in production
if (isProductionEnvironment()) {
    // Do something only in production
}
```

### Running with Different Environments

```bash
# Run with local environment (default)
npm run dev

# Explicitly use local environment
npm run dev:local

# Use production environment for testing
npm run dev:prod

# Build for production
npm run build:prod
```
