# Import Guide

This project uses path aliases to simplify imports and avoid long relative paths.

## Available Path Aliases

- `@` → `src/`
- `@components` → `src/components/`
- `@ui` → `src/components/ui/`
- `@pages` → `src/pages/`
- `@layouts` → `src/layouts/`
- `@styles` → `src/styles/`
- `@hooks` → `src/hooks/`
- `@utils` → `src/utils/`
- `@data` → `src/data/`
- `@context` → `src/context/`

## Usage Examples

### Before (Relative Paths)
```jsx
import Button from '../../../components/ui/Button/Button';
import { useProduct } from '../../hooks/useProduct';
import Layout from '../../layouts/Layout/Layout';
```

### After (Path Aliases)
```jsx
import { Button } from '@ui';
import { useProduct } from '@hooks/useProduct';
import Layout from '@layouts/Layout/Layout';
```

## Barrel Exports

For commonly used components, we use barrel exports (index.js files) for even cleaner imports:

```jsx
// Instead of:
import Button from '@ui/Button/Button';

// Use:
import { Button } from '@ui';
```

## SCSS Imports

For SCSS files, you can also use aliases:

```scss
@use '@styles/variables' as *;
@use '@styles/mixins' as *;
```

## IDE Support

The `jsconfig.json` file provides autocomplete and IntelliSense support for these aliases in VS Code and other IDEs.

