# Restaurant App — Frontend React

Frontend React (Vite + Tailwind CSS) pour l'application restaurant **Le Jardin Gourmand**.

## Prérequis

- Node.js 18+
- Backend API démarré sur `http://localhost:5044`

## Installation

```bash
npm install
```

## Lancer en développement

```bash
npm run dev
```

L'application tourne sur **http://localhost:3000** (port requis pour le CORS du backend).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Accueil — hero, histoire, plats phares |
| `/menu` | Carte filtrée par catégories |
| `/reservation` | Formulaire de réservation (API) |
| `/contact` | Coordonnées, formulaire local, carte Maps |

## API (async/await + Axios)

- `GET /api/MenuItems`
- `GET /api/Categories`
- `GET /api/Tables`
- `POST /api/Customers`
- `POST /api/Reservations`

Variable d'environnement : `VITE_API_URL` (défaut : `http://localhost:5044`)
