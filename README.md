# IUT Project - API de Gestion de Films

Une API REST complète pour gérer des utilisateurs, des films et des favoris, avec authentification JWT, notifications par email et export de données.

## Prérequis

- Node.js v18+
- npm v9+
- MySQL 8.0+
- Git

## Installation

1. git clone
2. npm install
3. Créer MySQL avec Docker ou localement

## Configuration

Créer .env :
- DB_HOST, DB_USER, DB_PASSWORD, DB_DATABASE
- MAIL_HOST, MAIL_USER, MAIL_PASS (Ethereal)

## Lancement

npm start
Puis accéder à : http://localhost:3000/documentation

## Routes API

### Authentification (sans token)
- POST /user - Créer compte
- POST /user/login - Login

### Compte admin pour tester toutes les commandes
- POST /user/login - a@b.com  password123

### Utilisateurs (token requis)
- GET /users
- GET /user/{id}
- PATCH /user/{id} (admin)
- DELETE /user/{id} (admin)

### Films (token requis)
- POST /movie (admin)
- GET /movies
- GET /movie/{id}
- PATCH /movie/{id} (admin)
- DELETE /movie/{id} (admin)

### Favoris (token requis)
- POST /user/favorite
- GET /user/favorites
- DELETE /user/favorite/{movieId}

### Export (token requis)
- POST /movies/export (admin)

## Fonctionnalités

- JWT Authentication (4 heures)
- Scopes admin/user
- Notifications email
- Export CSV
- Migrations auto

Dernière mise à jour : 21 Janvier 2026
"@ | Set-Content README.md