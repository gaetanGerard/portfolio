# Utiliser l'image de base officielle PHP avec PHP-FPM
FROM php:8.2-fpm

# Définir le répertoire de travail
WORKDIR /var/www

# Installer les dépendances système nécessaires
RUN apt-get update && apt-get install -y \
    libpng-dev \
    libjpeg-dev \
    libfreetype6-dev \
    zip \
    unzip \
    git \
    curl \
    libsqlite3-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install -j$(nproc) gd pdo pdo_mysql pdo_sqlite

# Installer Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Copier les fichiers du projet
COPY . .

# Vérifier que les fichiers ont été copiés correctement
RUN echo "Listing /var/www after copying project files:" && ls -l /var/www

# Copier le fichier de configuration php.ini
COPY ./docker/php/local.ini /usr/local/etc/php/conf.d/

# Installer les dépendances PHP
RUN composer install --optimize-autoloader --no-dev --verbose

# Vérifier les permissions avant d'exécuter chmod
RUN echo "Listing /var/www and /var/www/storage before chown & chmod:" && ls -l /var/www && ls -l /var/www/storage

# Modifier les permissions
RUN chown -R www-data:www-data /var/www
RUN chmod -R 755 /var/www/storage

# Vérifier les permissions après chmod
RUN echo "Listing /var/www/storage after chmod & chown:" && ls -l /var/www/storage

# Exposer le port 9000 pour PHP-FPM
EXPOSE 9000

# Démarrer PHP-FPM
CMD ["php-fpm"]
