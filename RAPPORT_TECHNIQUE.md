# Rapport Technique - API de Gestion de Films

**Auteur :** Cathy DESCOUTURES
**Date :** 16 février 2026  
**Projet :** API REST complète pour la gestion de films et d'utilisateurs

## Table des matières
1. [Introduction](#introduction)
2. [Objectifs du projet](#objectifs-du-projet)
3. [Architecture générale](#architecture-générale)
4. [Choix technologiques](#choix-technologiques)
5. [Fonctionnalités implémentées](#fonctionnalités-implémentées)
6. [Modèle de données](#modèle-de-données)
7. [Authentification et autorisation](#authentification-et-autorisation)
8. [Services et logique métier](#services-et-logique-métier)
9. [Configuration et déploiement](#configuration-et-déploiement)
10. [Challenges et solutions](#challenges-et-solutions)
11. [Améliorations futures](#améliorations-futures)

## Introduction

Cette API REST a été développée dans le cadre d'un projet scolaire pour démontrer les compétences en développement backend avec Node.js. Le projet offre une solution complète pour gérer une base de données de films avec authentification utilisateur, gestion des favoris et export de données.

La particularité de ce projet réside dans l'utilisation d'une architecture moderne en couches avec séparation des responsabilités, permettant une maintenabilité et une scalabilité optimales.

## Objectifs du projet

### Objectifs fonctionnels
-  Permettre aux utilisateurs de créer des comptes et se connecter
-  Implémenter un système de gestion de films (CRUD complet)
-  Permettre aux utilisateurs d'ajouter des films en favoris
-  Fournir une fonctionnalité d'export de données en CSV
-  Envoyer des notifications par email
-  Implémenter un système d'authentification sécurisé

### Objectifs non-fonctionnels
-  Utiliser une API REST suivant les bonnes pratiques
-  Implémenter un système d'autorisation par rôles (RBAC)
-  Fournir une documentation API interactive
-  Assurer la sécurité des données (JWT, validation)
-  Permettre les migrations de base de données réversibles

## Architecture générale

### Modèle architectural : MVC + Services

L'architecture suit un pattern classique avec une séparation nette entre les couches :

```
┌─────────────────────────────────────────────────┐
│  Client HTTP (Postman, navigateur, etc.)        │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│  Routes & Handlers (lib/routes/*.js)            │  ← Couche présentation
│  - Validation des paramètres                     │
│  - Extraction des données                        │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│  Services (lib/services/*.js)                    │  ← Logique métier
│  - Logique applicative                           │
│  - Orchestration des opérations                  │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│  Models (lib/models/*.js)                        │  ← Accès aux données
│  - Requêtes Knex.js                             │
│  - Interactions avec la BD                       │
└─────────────────┬───────────────────────────────┘
                  │
┌─────────────────▼───────────────────────────────┐
│  Base de données MySQL                           │  ← Persistance
└─────────────────────────────────────────────────┘
```

### Organisation des fichiers

```
lib/
├── index.js              # Plugin principal - enregistre toutes les routes
├── auth/                 # Configuration JWT
│   ├── default.js        # Stratégies d'authentification
│   └── strategies/jwt.js # Validateur JWT
├── routes/               # Endpoints HTTP
│   ├── user-*.js        # Gestion utilisateurs
│   ├── movie-*.js       # Gestion films
│   ├── favorite-*.js    # Gestion favoris
│   └── movies-export.js # Export CSV
├── services/            # Logique métier
│   ├── user.js         # Services utilisateurs
│   ├── movie.js        # Services films
│   ├── favorite.js     # Services favoris
│   ├── export.js       # Services export
│   └── mail.js         # Services email
└── models/             # Accès aux données
    ├── user.js         # Requêtes utilisateurs
    ├── movie.js        # Requêtes films
    └── user-favorite.js # Requêtes favoris
```

## Choix technologiques

### 1. Framework Web : Hapi.js

**Pourquoi Hapi.js ?**

- **Architecture modulaire** : Permet une séparation claire des responsabilités
- **Validation intégrée** : Support natif de Joi pour la validation
- **Plugins robustes** : Écosystème riche (@hapi/jwt, @hapi/inert, etc.)
- **Documentation complète** : Excellente courbe d'apprentissage
- **Production-ready** : Utilisé par de grandes entreprises (Walmart, PayPal)

**Alternative considérée :** Express.js
- Express est plus minimaliste mais moins structuré
- Hapi force une architecture meilleure dès le départ

### 2. Base de données : MySQL avec Knex.js

**Pourquoi MySQL ?**

- **Fiabilité** : SGBD très stable et mature
- **Compatibilité** : Disponible partout (hosting partagé à cloud)
- **Performance** : Suffisant pour les cas d'usage CRUD

**Pourquoi Knex.js (et pas de ORM direct) ?**

- **Migrations versionnées** : Historique complet des changements DB
- **Query builder sûr** : Prévention des injections SQL
- **Flexibilité** : Plus de contrôle qu'un ORM complet (Sequelize)
- **Apprentissage** : Force à comprendre les requêtes SQL

```javascript
// Exemple : Knex permet des requêtes sécurisées
const user = await knex('users').where({ id: userId }).first();
// Automatiquement échappé ET lisible
```

### 3. Authentification : JWT (JSON Web Tokens)

**Pourquoi JWT et pas les sessions classiques ?**

**JWT :**
-  Stateless (pas besoin de session en mémoire/cache)
-  Scalable (parfait pour les microservices)
-  Sécurisé (signé avec un secret)
-  Expiration native

**Sessions :**
-  Nécessite un stockage centralisé
-  Moins scalable
-  Complexe à gérer en distribué

**Token décision : 4 heures d'expiration**
-  Pas trop court (pas besoin de se reconnecter constamment)
-  Pas trop long (sécurité)
-  Bon équilibre pour une app web

### 4. Email : Nodemailer avec Ethereal

**Pourquoi Nodemailer ?**

- Support SMTP universel
- Configuration simple
- Pas de dépendance commerciale

**Pourquoi Ethereal en développement ?**

- Service gratuit de test d'emails
- Pas d'email réel envoyé (sûr pendant le dev)
- Les emails peuvent être consultés sur ethereal.email
- Parfait pour tester sans configuration complexe

**Pour la production :**
Simplement remplacer les credentials par Gmail, SendGrid, Mailgun, etc.

### 5. Validation : Joi

**Pourquoi Joi et pas des validations manuelles ?**

```javascript
// Avec Joi
const schema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required()
});

// Au lieu de
if (!email || !email.includes('@')) throw new Error('Invalid email');
if (!password || password.length < 8) throw new Error('Invalid password');
```

- Déclaratif et lisible
- Réutilisable
- Messages d'erreur automatiques
- Intégration native avec Hapi

### 6. Export CSV : json2csv

- Bibliothèque légère et spécialisée
- Gère automatiquement les délimiteurs et échappement
- Parfait pour une fonctionnalité simple


## Fonctionnalités implémentées

### 1. Authentification utilisateur

**Routes :**
- `POST /user` - Inscription
- `POST /user/login` - Connexion

**Flux :**
1. Utilisateur envoie email + mot de passe
2. Vérification du compte
3. Hachage du mot de passe avec bcrypt
4. Génération du JWT
5. Token retourné à l'utilisateur

**Sécurité :**
- Mots de passe hashés (jamais en clair)
- Tokens signés cryptographiquement
- Expiration automatique

### 2. Gestion des utilisateurs

**Routes :**
- `GET /users` - Liste (admin)
- `GET /user/{id}` - Détail
- `PATCH /user/{id}` - Modification (admin)
- `DELETE /user/{id}` - Suppression (admin)

**Contrôle d'accès :**
- Admin peut modifier/supprimer n'importe quel utilisateur
- Un utilisateur peut voir son propre profil

### 3. Gestion des films

**Routes :**
- `POST /movie` - Créer (admin)
- `GET /movies` - Liste
- `GET /movie/{id}` - Détail
- `PATCH /movie/{id}` - Modifier (admin)
- `DELETE /movie/{id}` - Supprimer (admin)

**Fonctionnalités :**
- Validation des données (titre, description, date)
- Seuls les admins peuvent créer/modifier
- Tous les utilisateurs peuvent consulter

### 4. Système de favoris

**Routes :**
- `POST /user/favorite` - Ajouter un film aux favoris
- `GET /user/favorites` - Récupérer les favoris de l'utilisateur
- `DELETE /user/favorite/{movieId}` - Retirer un film des favoris

**Implémentation :**
```
user_favorites
├── userId (FK → users.id)
├── movieId (FK → movies.id)
└── PRIMARY KEY (userId, movieId)
```

**Logique :**
- Chaque utilisateur peut ajouter ses propres favoris
- Impossible d'ajouter deux fois le même film
- Suppression simple et idempotente

### 5. Export des films en CSV

**Route :**
- `POST /movies/export` - Exporte en CSV (admin)

**Implémentation :**
```javascript
// Récupe tous les films
const movies = await knex('movies');

// Convertit en CSV
const csv = await Json2csvParser.parse(movies);

// Retourne avec headers appropriés
reply.response(csv)
  .header('Content-Type', 'text/csv')
  .header('Content-Disposition', 'attachment; filename=films.csv');
```

### 6. Notifications par email

**Utilisation :**
- Email de bienvenue lors de l'inscription
- Email de confirmation des favoris ajoutés
- Gestion des erreurs (pas de crash si email échoue)

**Exemple :**
```javascript
await mailService.sendWelcomeEmail({
  to: user.email,
  name: user.username
});
```

## Modèle de données

### Table `users`

```sql
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('user', 'admin') DEFAULT 'user',
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Choix :**
- `role` as ENUM : Force les valeurs valides au niveau DB
- `createdAt/updatedAt` : Suivi des modifications
- Indexes implicites sur `id`, `email` pour les performances

### Table `movies`

```sql
CREATE TABLE movies (
  id INT PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  releaseDate DATE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Table `user_favorites`

```sql
CREATE TABLE user_favorites (
  userId INT NOT NULL,
  movieId INT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (userId, movieId),
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE
);
```

**Choix de design :**
- Clé primaire composite (userId, movieId)
- Contraintes de foreign key pour intégrité référentielle
- ON DELETE CASCADE : Suppression automatique des favoris

**Avantages de cette structure :**
- Requête rapide pour récupérer les favoris d'un user
- Garantit une relation 1-N user vers movies
- Empêche les doubloursnat les favoris

## Authentification et autorisation

### JWT Token

**Contenu du token :**
```json
{
  "userId": 1,
  "email": "user@example.com",
  "role": "admin",
  "iat": 1708080000,
  "exp": 1708094400
}
```

**Où le token est stocké :**
- Client : Header `Authorization: Bearer <token>`
- Jamais en cookie (pour éviter les CSRF simplement)

**Stratégie d'authentification :**
```javascript
// Chaque route peut être protégée avec
{
  auth: 'jwt'  // Nécessite un token valide
}

// Ou avec scope
{
  auth: {
    strategy: 'jwt',
    scope: ['admin']  // Nécessite le rôle admin
  }
}
```

### Contrôle d'accès

**3 niveaux :**

1. **Public** - Aucun token
   - POST /user (inscription)
   - POST /user/login (connexion)

2. **Authentifié** - Token valide
   - GET /movies
   - GET /user/{id}
   - POST /user/favorite

3. **Admin** - Token avec scope 'admin'
   - POST /movie
   - PATCH /movie/{id}
   - DELETE /user/{id}
   - POST /movies/export

**Validation au niveau route :**
```javascript
{
  path: '/movies/export',
  method: 'POST',
  options: {
    auth: {
      strategy: 'jwt',
      scope: ['admin']  // Vérification automatique
    }
  }
}
```

## Services et logique métier

### Séparation routes ↔ services

**Routes :** Gèrent le HTTP uniquement
```javascript
// Extraction, validation, réponse
handler: async (request, h) => {
  const { email, password } = request.payload;
  // Appelle le service
  const result = await userService.login(email, password);
  return h.response(result);
}
```

**Services :** Contiennent la logique métier
```javascript
// userService.js
async login(email, password) {
  const user = await userModel.findByEmail(email);
  if (!user) throw new Error('User not found');
  
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw new Error('Invalid password');
  
  return jwtService.generateToken(user);
}
```

**Models :** Accès aux données uniquement
```javascript
// userModel.js
findByEmail(email) {
  return knex('users').where({ email }).first();
}
```

### Avantages de cette séparation

| Aspect | Route | Service | Model |
|--------|-------|---------|-------|
| Testabilité |  Difficile |  Facile |  Facile |
| Réutilisabilité |  Non |  Oui |  Oui |
| Maintenabilité |  Accouplée |  Découplée |  Découplée |
| Responsabilité | HTTP | Logique | DB |


## Configuration et déploiement

### Variables d'environnement

```env
# Server
PORT=8000
NODE_ENV=development

# Database
DB_HOST=127.0.0.1
DB_PORT=33060
DB_USER=root
DB_PASSWORD=root
DB_DATABASE=iut_project

# Email
MAIL_HOST=smtp.ethereal.email
MAIL_PORT=587
MAIL_USER=...
MAIL_PASS=...
```

**Raison du `.env` dans `server/` :**
Hapi charge les variables depuis le répertoire du manifest (server/manifest.js), donc le `.env` doit être au même endroit.

### Migrations de données

Les migrations Knex versionnent chaque changement :

```
migrations/
├── 0-user.js       # Crée table users
├── 1-movie.js      # Crée table movies
└── 2-user-favorite.js  # Crée table user_favorites
```

**Exécution automatique :**
```javascript
// Dans manifest.js
migrateOnStart: true  // En développement
migrateOnStart: false // En production
```

**Bénéfices :**
- Historique complet des changements
- Rollback possible
- Reproducible sur d'autres machines
- Suivi en Git

### Déploiement

Pour la production :

1. **Ajouter au `.gitignore` :**
   ```
   node_modules
   .env
   server/.env
   ```

2. **Configurer les variables en production**
   - Variables d'environnement du serveur
   - Secrets securisés (jamais en Git)

3. **Lancer les migrations :**
   ```bash
   npx knex migrate:latest --env production
   ```

4. **Démarrer l'app :**
   ```bash
   npm start
   ```


## Challenges et solutions

### Challenge 1 : Port 3000 bloqué par Docker

**Problème :**
- Port 3000 et 3306 (MySQL) étaient bloqués par des permissions Windows
- Docker n'arrivait pas à créer les bindings de port

**Solution :**
- Utiliser des ports alternatifs (8000 pour Hapi, 33060 pour MySQL)
- Documenter clairement dans le README
- Rendre les ports configurables via `.env`

**Code :**
```javascript
port: Number(process.env.DB_PORT) || 3306
PORT: process.env.PORT || 8000
```

### Challenge 2 : JWT avec IPv6 sur Windows

**Problème :**
- Hapi tentait de bind sur `::1` (IPv6) qui n'avait pas les permissions

**Solution :**
- Forcer IPv4 dans le manifest
```javascript
host: '127.0.0.1'  // Au lieu de 'localhost'
```

### Challenge 3 : Localisation du `.env`

**Problème :**
- Dotenv chargeait `.env` depuis la racine
- Mais la requête venait du répertoire `server/`

**Solution :**
- Créer `.env` dans `server/` directement
- Documenté clairement dans README

### Challenge 4 : Gestion des emails en développement

**Problème :**
- Pas de serveur SMTP local
- Ne pas envoyer d'emails réels pendant le dev

**Solution :**
- Service Ethereal Email (gratuit et simple)
- Tous les emails peuvent être consultés sans configuration
- Facile de basculer en production



## Améliorations futures

### Court terme
1. **Tests unitaires et d'intégration**
   - Jest pour les tests
   - Coverage > 80%
   - Tests sur les services et modèles

2. **Validation plus stricte**
   - Regex sur les formats d'email
   - Constraints de longueur de chaînes
   - Dates valides

3. **Pagination**
   - `GET /users?page=1&limit=10`
   - `GET /movies?page=1&limit=20`

4. **Recherche et filtrage**
   - `GET /movies?title=Avatar`
   - `GET /movies?releaseDate=2023`

### Moyen terme
5. **Refresh tokens**
   - Tokens courts (15min) + refresh token (7 jours)
   - Meilleure sécurité

6. **Rate limiting**
   - Limite les requêtes par IP
   - Protection contre les attaques brute-force

7. **Logging**
   - Logger toutes les actions
   - Pino.js pour la performance

8. **Audit trail**
   - Historique des modifications
   - Qui a modifié quoi et quand

### Long terme
9. **Cache**
   - Redis pour les requêtes fréquentes
   - Films populaires, favoris

10. **Notifications en temps réel**
    - WebSocket pour les mises à jour
    - SignalR ou Socket.io

11. **Système de recommandation**
    - IA pour suggérer des films aux utilisateurs

12. **Deployment automatisé**
    - Docker + Kubernetes
    - CI/CD avec GitHub Actions



## Conclusion

Ce projet démontre une compréhension solide des principes de développement backend :

-  **Architecture propre** : Séparation des responsabilités
-  **Sécurité** : JWT, hashage, validation
-  **Scalabilité** : Design stateless, migrations versionnées
-  **Maintenabilité** : Code organisé et testable
-  **Documentation** : README complet et exemples

Le projet est production-ready pour un MVP et facilement extensible pour les futures fonctionnalités.