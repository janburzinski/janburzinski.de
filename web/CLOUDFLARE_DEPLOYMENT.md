# Deployment zu Cloudflare Workers

Diese Website läuft jetzt auf **Cloudflare Workers** statt Vercel.

## Schnellstart

```bash
# Build erstellen
pnpm build

# Lokal testen mit Wrangler
pnpm dev:remote

# Auf Cloudflare deployen
pnpm deploy
```

## Erste Einrichtung

1. **Cloudflare Account erstellen** (falls nicht vorhanden)
   - Gehe zu https://dash.cloudflare.com/sign-up

2. **Mit Wrangler authentifizieren**
   ```bash
   npx wrangler login
   ```

3. **Erstes Deployment**
   ```bash
   pnpm build
   pnpm deploy
   ```

4. **Eigene Domain hinzufügen**
   - Gehe im Cloudflare Dashboard zu Workers & Pages
   - Wähle dein Projekt
   - Gehe zu Settings → Domains & Routes
   - Klicke auf "Add Custom Domain"

## Vorteile von Cloudflare Workers

- **Globale Edge-Performance** - Code läuft auf 300+ Standorten weltweit
- **Generous Free Tier** - 100.000 Requests/Tag kostenlos
- **Keine Cold Starts** - Workers starten instant
- **Integriert mit Cloudflare Ökosystem** - KV, D1, R2, etc.

## Migration abgeschlossen

Die folgenden Dateien wurden angepasst:
- `svelte.config.js` - Adapter zu Cloudflare gewechselt
- `package.json` - Cloudflare Scripts hinzugefügt
- `wrangler.jsonc` - Cloudflare Workers Konfiguration
- `.node-version` - Node.js Version für Build festgelegt

## Troubleshooting

### Build Fehler
Falls es Build-Probleme gibt:
```bash
rm -rf .svelte-kit node_modules
pnpm install
pnpm build
```

### Deploy Fehler
Stelle sicher, dass du eingeloggt bist:
```bash
npx wrangler whoami
```

Falls nicht, erneut einloggen:
```bash
npx wrangler login
```

## Ressourcen

- [SvelteKit Cloudflare Adapter](https://kit.svelte.dev/docs/adapter-cloudflare)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Wrangler CLI](https://developers.cloudflare.com/workers/wrangler/)
