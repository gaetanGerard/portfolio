<p align="center"><a href="https://portfolio.gge2705.synology.me" target="_blank"><img src="/public/images/logo.svg" width="128" alt="Laravel Logo"></a></p>



## Portfolio V2

Mis à jour de mon portfolio, l'objectif était de recréer mon portfolio actuel et de l'améliorer en stockant les informations dans la DB pour gérer plus facilement la mise à jour du frontend, le projet à donc été principalement réaliser à l'aide de React(InertiaJS) pour le front-end et Laravel pour le Back-End.

## Technologies

- Backend:
  - Laravel (v11.9 avec php 8.2)
  - Inertia pour le rendu avec React
  - SQLite
- FrontEnd:
  - Material-UI pour les composants front-end de l'administration
  - Tailwind pour la création de style responsive
  - TypeJS pour l'animation du Header
  - framer-motion pour l'animation des composant au travers de la page
  - React pour les composants
  - InertiaJS pour l'interaction front-end/back-end
  - Axios pour les apelle au Back-End

## Installation

## Prérequis
Si vous n'avez pas PHP il faudra l'installer au minimum la version 8.2 ainsi que composer.
Il faudra également installer NodeJS (projet développer avec un NodeJS 21) et npm (version 10)

Une fois le projet télécharger :

1) `npm install` à la racine du projet
2) `composer install` à la racine du projet
3) `php artisan migrate` pour générer les tables dans la DB (sauf si vous avez eu le projet déjà avec une DB SQLite)
4) a cet étape tout devrait être installer vous pouvez ouvrir deux terminals dans le premier vous pour faire `npm run dev` et dans l'autre `php artisan serve`
