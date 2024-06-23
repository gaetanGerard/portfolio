# Utiliser l'image de base officielle PHP avec Apache
FROM php:8.2-apache

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    libsqlite3-dev

# Installer Node.js LTS
RUN curl -fsSL https://deb.nodesource.com/setup_lts.x | bash -
RUN apt-get install -y nodejs

# Installer Yarn
RUN npm install -g yarn

# Installer ViteJS globalement
RUN yarn global add vite

# Installer esbuild et ses dépendances
RUN yarn add --dev esbuild

# Configurer l'extension GD
RUN docker-php-ext-configure gd --with-freetype --with-jpeg

# Installer les extensions PHP nécessaires
RUN docker-php-ext-install -j$(nproc) gd pdo pdo_mysql pdo_sqlite

# Installer Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Configurer le répertoire de l'application
WORKDIR /var/www/html

# Copier les fichiers de l'application
COPY . .

# Installer les dépendances PHP
RUN composer install --no-dev --optimize-autoloader

# Installer les dépendances npm ou yarn
RUN yarn install

# Ajuster les permissions avant de construire
RUN chown -R www-data:www-data /var/www/html/public/build

# Trouver le chemin exact de Yarn global bin
RUN export PATH="$(yarn global bin):$PATH"

# Construire les assets frontend avec ViteJS (en utilisant le chemin complet)
RUN /usr/local/bin/vite build --mode production

# Configurer Apache
RUN a2enmod rewrite
COPY ./docker/apache/vhost.conf /etc/apache2/sites-available/000-default.conf

# Configurer les permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Exposer le port
EXPOSE 80

# Lancer Apache
CMD ["apache2-foreground"]
