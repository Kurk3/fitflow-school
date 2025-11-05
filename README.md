# FitFlow

Modern React aplikácia vytvorená s Vite podľa best practices.

## Technológie

- **React 18** - JavaScript knižnica pre budovanie UI
- **Vite** - Next generation frontend tooling (rýchlejší build než Webpack)
- **ESLint** - Code linting a quality checking

## Začíname

### Inštalácia

Dependencies sú už nainštalované. Ak potrebuješ preinštalovať:

```bash
npm install
```

### Development

Spustenie development serveru s Hot Module Replacement:

```bash
npm run dev
```

Aplikácia bude dostupná na `http://localhost:5173`

### Build

Vytvorenie production buildu:

```bash
npm run build
```

### Preview

Náhľad production buildu lokálne:

```bash
npm run preview
```

### Linting

Kontrola kódu pomocou ESLint:

```bash
npm run lint
```

## Štruktúra projektu

```
fitflow/
├── public/              # Statické súbory
├── src/
│   ├── assets/         # Obrázky, fonty a iné assets
│   ├── components/     # Znovupoužiteľné React komponenty
│   ├── pages/          # Page komponenty (views)
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Helper funkcie a utilities
│   ├── services/       # API calls a external services
│   ├── styles/         # Globálne štýly
│   ├── constants/      # Konštanty a konfigurácia
│   ├── App.jsx         # Main App component
│   ├── main.jsx        # Entry point
│   └── index.css       # Globálne štýly
├── index.html          # HTML template
├── vite.config.js      # Vite konfigurácia
├── eslint.config.js    # ESLint konfigurácia
└── package.json        # NPM dependencies a skripty
```

## Best Practices

### Komponenty

- Každý komponent v samostatnom priečinku
- Používaj funkcionálne komponenty a hooks
- Prop validation pomocou PropTypes alebo TypeScript

### Štýlovanie

- CSS Modules pre component-specific štýly
- Globálne štýly v `src/styles/`
- CSS premenné pre konzistentnú tému

### State Management

- React Context API pre globálny state
- Pre väčšie aplikácie zvážiť Redux Toolkit alebo Zustand

### Code Quality

- ESLint pre code quality
- Prettier pre code formatting (môžeš pridať)
- Git hooks pre pre-commit checks (môžeš pridať Husky)

## Ďalšie kroky

### Odporúčané rozšírenia:

1. **React Router** - Routing
   ```bash
   npm install react-router-dom
   ```

2. **Prettier** - Code formatting
   ```bash
   npm install --save-dev prettier eslint-config-prettier
   ```

3. **TailwindCSS** - Utility-first CSS framework
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Axios** - HTTP client
   ```bash
   npm install axios
   ```

5. **React Query** - Data fetching a caching
   ```bash
   npm install @tanstack/react-query
   ```

## Dokumentácia

- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [ESLint Documentation](https://eslint.org/)

## Licencia

MIT
