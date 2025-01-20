# Contributing to Twitch Giveaway Bot

Thank you for your interest in contributing to Twitch Giveaway Bot! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How to Contribute

### Reporting Bugs

1. Check if the bug has already been reported in the Issues section
2. If not, create a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable
   - Your environment details

### Suggesting Enhancements

1. Check if the enhancement has been suggested in the Issues section
2. If not, create a new issue with:
   - Clear title and description
   - Use case and benefits
   - Potential implementation approach
   - Mock-ups or examples if applicable

### Pull Requests

1. Fork the repository
2. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-fix-name
   ```

3. Make your changes following our coding standards:
   - Use TypeScript
   - Follow the existing code style
   - Add comments for complex logic
   - Update tests if needed

4. Commit your changes:
   ```bash
   git commit -m 'Description of changes'
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Open a Pull Request with:
   - Clear title and description
   - Reference any related issues
   - Screenshots or GIFs for UI changes

## Development Setup

1. Install dependencies:
   ```bash
   npm install
   # or
   pnpm install
   ```

2. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/         # React components
├── lib/               # Utility libraries
│   └── supabase/     # Supabase client & types
├── types/            # TypeScript type definitions
└── utils/            # Helper functions
```

## Coding Standards

- Use TypeScript for type safety
- Follow [Prettier](https://prettier.io/) formatting
- Use [ESLint](https://eslint.org/) for code quality
- Write meaningful commit messages
- Add JSDoc comments for functions
- Keep components small and focused
- Use Tailwind CSS for styling

## Testing

- Write tests for new features
- Update existing tests when modifying features
- Ensure all tests pass before submitting PR
- Add both unit and integration tests when applicable

## Documentation

- Update README.md if adding new features
- Add JSDoc comments for new functions
- Update type definitions
- Include code examples where helpful

## Questions?

Feel free to open an issue for any questions about contributing.

Thank you for contributing to Twitch Giveaway Bot! 🎮 