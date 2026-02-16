# IUT Project - API de Gestion de Films

Une API REST complète et professionnelle pour gérer des utilisateurs, des films et des favoris, avec authentification JWT, notifications par email et export de données CSV.

## Table des matières

- [À propos](#-à-propos)
- [Fonctionnalités](#-fonctionnalités)
- [Architecture](#-architecture)
- [Prérequis](#-prérequis)
- [Installation](#-installation)
- [Configuration](#-configuration)
- [Lancement](#-lancement)
- [Documentation API](#-documentation-api)
- [Types de comptes](#-types-de-comptes)
- [Migrations de données](#-migrations-de-données)
- [Structure du projet](#-structure-du-projet)

## À propos

Ce projet est une API REST construite avec **Hapi.js** et **MySQL**, développée dans le cadre d'un projet scolaire IUT. L'API offre une gestion complète des utilisateurs, des films et des favoris avec un système d'authentification robuste par JWT et des fonctionnalités avancées comme l'export CSV et les notifications email.

## Fonctionnalités

### Core Features
- **Authentification JWT** avec tokens de 4 heures
- **Système de rôles** (Admin/User) avec contrôle d'accès
- **Gestion complète des utilisateurs** (CRUD)
- **Gestion des films** (CRUD) - admin seulement
- **Système de favoris** - chaque utilisateur peut ajouter/retirer des films en favoris
- **Export de données** en format CSV
- **Notifications par email** (intégration Ethereal/Nodemailer)
- **Migrations de base de données automatiques**
- **Validation des données** avec Joi
- **Documentation API interactive** avec Swagger/Hapi-Swagger

## Architecture

**Stack technologique :**
- **Framework Web** : Hapi.js v20 (framework HTTP robuste)
- **Base de données** : MySQL 8.0
- **ORM/Query Builder** : Knex.js (migrations et requêtes SQL)
- **Authentification** : JWT (via @hapi/jwt)
- **Email** : Nodemailer + Ethereal (tests)
- **Validation** : Joi
- **Export** : json2csv
- **Documentation** : hapi-swagger
- **Environnement** : dotenv pour la configuration

**Architecture en couches :**
```
Routes (HTTP endpoints)
    ↓
Handlers (logique métier)
    ↓
Services (business logic)
    ↓
Models (Knex queries)
    ↓
Database (MySQL)
```

## Prérequis

- **Node.js** v18+ ([télécharger](https://nodejs.org/))
- **npm** v9+
- **MySQL** 8.0+ (local ou Docker)
- **Git**
- **Docker** (optionnel, recommandé pour MySQL)

Vérifiez les versions installées :
```bash
node --version  # v18.x.x minimum
npm --version   # v9.x.x minimum
```

## Installation

### Étape 1 : Cloner le projet
```bash
git clone <votre-repo-github>
cd iut-project
```

### Étape 2 : Installer les dépendances
```bash
npm install
```

### Étape 3 : Configurer la base de données

**Option A : Utiliser Docker (recommandé)**
```bash
docker run --name mysql-iut \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=iut_project \
  -p 33060:3306 \
  -d mysql:8.0
```

**Option B : MySQL local**
Assurez-vous que MySQL est en cours d'exécution sur le port 3306 (ou modifiez `DB_PORT` dans `.env`)

### Étape 4 : Configurer les variables d'environnement

Créez un fichier `.env` à la racine du projet :

```bash
# Server configuration
PORT=8000
NODE_ENV=development

# Database configuration
DB_HOST=127.0.0.1
DB_PORT=33060          # Adapter selon votre configuration (3306 pour MySQL local)
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=iut_project

# Email configuration (Ethereal pour tests)
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=votre_email@ethereal.email     # https://ethereal.email/register
MAIL_PASS=votre_mot_de_passe_ethereal
```

**Créer aussi `server/.env` avec le même contenu** (le serveur charge le `.env` depuis le répertoire `server/`)

### Configuration Email (Développement)

Pour les tests en développement, utilisez **Ethereal Email** (service gratuit) :

1. Allez sur https://ethereal.email/register
2. Créez un compte (gratuit, temporaire)
3. Copiez les identifiants dans `.env`
4. Les emails ne sont pas envoyés réellement, mais vous pouvez les voir sur https://ethereal.email/messages

Pour la production, remplacez par un vrai service (Gmail, SendGrid, etc.)

## Lancement

### Démarrer l'API
```bash
npm start
```

L'API sera disponible à : **http://127.0.0.1:8000**
Documentation Swagger : **http://127.0.0.1:8000/documentation**

### Développement avec rechargement automatique
```bash
npm install -D nodemon
npx nodemon server
```

### Tests
```bash
npm test              # Lancer tous les tests
npm run lint          # Vérifier la qualité du code
```

## Documentation API

### Authentification
L'API utilise **JWT (JSON Web Token)** pour l'authentification. Les tokens sont valides pendant **4 heures**.

**Exemple de flow :**
```
1. POST /user                    → Créer un compte
2. POST /user/login              → Obtenir un JWT token
3. Les requêtes suivantes ajoutent le header : Authorization: Bearer <token>
```

### Routes disponibles

#### Authentification (Sans token)
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/user` | Créer un nouveau compte |
| POST | `/user/login` | Se connecter et obtenir un JWT |

#### Utilisateurs (Token requis)
| Méthode | Route | Description | Rôle |
|---------|-------|-------------|------|
| GET | `/users` | Lister tous les utilisateurs | Admin |
| GET | `/user/{id}` | Récupérer un utilisateur | Tous |
| PATCH | `/user/{id}` | Modifier un utilisateur | Admin |
| DELETE | `/user/{id}` | Supprimer un utilisateur | Admin |

#### Films (Token requis)
| Méthode | Route | Description | Rôle |
|---------|-------|-------------|------|
| POST | `/movie` | Créer un film | Admin |
| GET | `/movies` | Lister tous les films | Tous |
| GET | `/movie/{id}` | Récupérer un film | Tous |
| PATCH | `/movie/{id}` | Modifier un film | Admin |
| DELETE | `/movie/{id}` | Supprimer un film | Admin |

#### Favoris (Token requis)
| Méthode | Route | Description |
|---------|-------|-------------|
| POST | `/user/favorite` | Ajouter un film en favori |
| GET | `/user/favorites` | Lister les favoris de l'utilisateur |
| DELETE | `/user/favorite/{movieId}` | Retirer un film des favoris |

#### Export (Token requis)
| Méthode | Route | Description | Rôle |
|---------|-------|-------------|------|
| POST | `/movies/export` | Exporter les films en CSV | Admin |

### Exemples d'utilisation

**Créer un compte :**
```bash
curl -X POST http://127.0.0.1:8000/user \
  -H "Content-Type: application/json" \
  -d '{"username":"john","email":"john@example.com","password":"SecurePass123"}'
```

**Se connecter :**
```bash
curl -X POST http://127.0.0.1:8000/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"SecurePass123"}'
```

**Récupérer les films avec authentification :**
```bash
curl -X GET http://127.0.0.1:8000/movies \
  -H "Authorization: Bearer eyJhbGc..."
```

## Types de comptes

### Compte Admin (pour tester)
- **Email** : `a@b.com`
- **Mot de passe** : `password123`
- **Permissions** : Gérer les films, exporter des données, supprimer des utilisateurs

### Créer un nouveau compte utilisateur
Accédez à `POST /user` dans la documentation Swagger ou utilisez une requête curl

## Migrations de données

Les migrations Knex sont exécutées **automatiquement** au démarrage du serveur (en développement).

### Tables créées
1. **users** - Stockage des utilisateurs (id, username, email, password, role)
2. **movies** - Stockage des films (id, title, description, releaseDate)
3. **user_favorites** - Relation favoris (userId, movieId)

### Gérer les migrations manuellement
```bash
# Exécuter les migrations
npx knex migrate:latest

# Revenir en arrière
npx knex migrate:rollback

# Créer une nouvelle migration
npx knex migrate:make <nom_migration>
```

## Structure du projet

```
iut-project/
├── lib/                          # Code principal de l'application
│   ├── index.js                  # Point d'entrée du plugin
│   ├── auth/                     # Configuration d'authentification
│   │   ├── default.js            # Stratégies JWT
│   │   └── strategies/
│   │       └── jwt.js            # Validateur JWT
│   ├── migrations/               # Migrations Knex
│   │   ├── 0-user.js
│   │   ├── 1-movie.js
│   │   └── 2-user-favorite.js
│   ├── models/                   # Modèles Knex (requêtes DB)
│   │   ├── user.js
│   │   ├── movie.js
│   │   └── user-favorite.js
│   ├── routes/                   # Endpoints HTTP
│   │   ├── user-*
│   │   ├── movie-*
│   │   ├── favorite-*
│   │   └── movies-export.js
│   ├── services/                 # Logique métier
│   │   ├── user.js
│   │   ├── movie.js
│   │   ├── favorite.js
│   │   ├── export.js
│   │   └── mail.js
│   └── plugins/                  # Configuration des plugins Hapi
├── server/                       # Configuration serveur
│   ├── index.js                  # Initialization
│   ├── manifest.js               # Configuration Hapi (routes, plugins, DB)
│   ├── .env                      # Variables d'environnement
│   └── plugins/
│       └── swagger.js            # Configuration Swagger/Hapi-Swagger
├── public/                       # Fichiers statiques (actuellement vide)
├── package.json                  # Dépendances npm
├── knexfile.js                   # Configuration Knex
└── README.md                     # Cette documentation
```

## Sécurité

- **Mots de passe** : Hashés avec bcrypt
- **Authentification** : JWT avec secret signé
- **Validation** : Toutes les inputs sont validées avec Joi
- **CORS** : Configuré pour les requêtes autorisées
- **Tokens** : Expirent après 4 heures

## Troubleshooting

### Port 3000/8000 déjà utilisé
```bash
# Windows - Trouver le processus
Get-Process | Where-Object { $_.Id -match "node" } | Stop-Process -Force

# Linux/Mac
kill $(lsof -t -i:8000)
```

### Erreur de connexion MySQL
- Vérifiez que MySQL est bien lancé : `docker ps`
- Vérifiez le port dans `.env` (default: 33060 avec Docker, 3306 local)
- Les identifiants correspondent-ils ?

### JWT token invalide
- Les tokens expirent après 4 heures
- Reconnectez-vous pour obtenir un nouveau token
- Vérifiez le format : `Authorization: Bearer <token>`

## Licences et dépendances

- **@hapi/hapi** - Framework web MIT
- **mysql2** - Driver MySQL MIT
- **knex** - Query builder MIT
- **jsonwebtoken** - JWT MIT
- **nodemailer** - Email MIT
- Toutes les dépendances utilisent les licences open-source standards