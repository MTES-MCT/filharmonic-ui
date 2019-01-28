## Développement

### Installation

Prérequis :
- Node 10 (via [nvm](https://github.com/creationix/nvm#installation))
- [Yarn](https://yarnpkg.com/fr/docs/install)
- [Vue CLI](https://cli.vuejs.org/guide/installation.html)
- Optionnel : [direnv](https://github.com/direnv/direnv/#install)

Il faut d'abord installer les dépendances.
```
yarn install
```

Ajouter l'entrée DNS `filharmonic.local.beta.gouv.fr -> 127.0.0.1` au fichier */etc/hosts*, afin de faire marcher la redirection Cerbère. (Attention, le fichier doit comporter une seule ligne avec 127.0.0.1)
```sh
127.0.0.1 localhost filharmonic.local.beta.gouv.fr
```

Puis démarrer le serveur de développement.
```
yarn run serve
```

### Modèle de données

![Modèle de données](http://www.plantuml.com/plantuml/proxy?idx=0&src=https://raw.githubusercontent.com/MTES-MCT/filharmonic-ui/master/doc/data_model.puml&cachebust=5)

Pour le modifier, éditer le fichier [data_model.puml](./doc/data_model.puml) puis modifier le lien ci-dessus en incrémentant la variable `cachebust` pour invalider le cache de GitHub.

### Commandes disponibles

#### Project setup
```
yarn install
```

#### Compiles and hot-reloads for development
```
yarn run serve
```

#### Compiles and minifies for production
```
yarn run build
```

#### Run your tests
```
yarn run test
```

#### Lints and fixes files
```
yarn run lint
```

#### Run your end-to-end tests
```
yarn run test:e2e
```

#### Run your unit tests
```
yarn run test:unit
```

#### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
