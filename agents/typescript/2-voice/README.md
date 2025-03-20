# Blaxel Agent - voice-agent

## Overview

This project contains a voice agent application.

## Project Structure

- `app/` - Frontend application
- `src/` - Backend services and utilities

## Frontend

### Environment Configuration

The project supports both local and production environments.

#### Environment Files

- `.env`: Default environment variables
- `.env.local`: Local overrides (not tracked in git)
- `.env.production`: Production environment variables

#### Available Variables

- `VITE_ENV`: Can be 'local' or 'prod'

### Running the Application

```bash
# Navigate to the app directory
cd app

# Install dependencies
npm install

# Run with local environment (default)
npm run dev

# Run with production environment
npm run dev:prod

# Build for production
npm run build:prod
```

The application will be available at [http://127.0.0.1:5173](http://127.0.0.1:5173)
