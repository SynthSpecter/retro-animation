# Synthverse | Retro Animation

Une anthologie animée synthwave qui rassemble l'identité visuelle des projets de
[SynthSpecter](https://github.com/SynthSpecter) dans un film interactif de 69 secondes.

A synthwave animated anthology that brings the visual identity of
[SynthSpecter](https://github.com/SynthSpecter)'s projects together in a 69-second
interactive film.

---

## Français

### Le projet

<code>retro-animation</code> n'est plus un éditeur d'images-clés. Il s'agit
désormais d'une animation complète, prête à regarder, qui transforme les autres
projets du dépôt en treize chapitres visuels :

1. <code>retro-animation</code> : ouverture du signal
2. <code>bank-wave</code> : ville financière et courbe de données
3. <code>synth-run</code> : course nocturne en perspective
4. <code>synth-shoot</code> : défense orbitale
5. <code>synth-minesweeper</code> : matrice tactique
6. <code>synth-weather-app</code> : cycle météo
7. <code>agretator</code> : flux d'actualités
8. <code>angry-tanks</code> : duel balistique
9. <code>browser-classing</code> : tunnel de dossiers
10. <code>diet</code> : circuit vital
11. <code>calculator-synthwave</code>, <code>pw-generator</code> et
    <code>qr-generator</code> : machines logiques
12. <code>force-four</code> et <code>le synth-pendu</code> : duel analogique
13. Synthverse : convergence finale

Tout le dessin est généré en temps réel avec l'API Canvas. La bande-son est
synthétisée localement avec Web Audio après activation volontaire du son. Aucun
fichier distant, compte, clé d'API ou paquet tiers n'est nécessaire.

### Fonctions

- lecture, pause, redémarrage et navigation entre les chapitres ;
- chronologie interactive avec repères de scènes ;
- thèmes sombre et clair mémorisés localement ;
- interface française et anglaise mémorisée localement ;
- bande-son procédurale activable ;
- plein écran et capture PNG de l'image courante ;
- adaptation aux écrans mobiles et à la haute densité de pixels ;
- prise en charge de <code>prefers-reduced-motion</code> ;
- libellés accessibles et annonces pour les lecteurs d'écran.

### Commandes clavier

| Touche | Action |
| --- | --- |
| <code>Espace</code> | Lecture ou pause |
| <code>Flèche gauche</code> | Chapitre précédent |
| <code>Flèche droite</code> | Chapitre suivant |
| <code>R</code> | Recommencer |
| <code>M</code> | Activer ou couper le son |
| <code>F</code> | Entrer ou sortir du plein écran |

Les raccourcis sont ignorés lorsqu'un bouton ou la chronologie possède le focus,
afin de préserver leur comportement natif.

### Lancer le projet

Le projet fonctionne de deux façons :

1. ouvrir directement <code>index.html</code> dans un navigateur moderne ;
2. lancer le serveur local recommandé :

~~~bash
npm start
~~~

Puis ouvrir [http://127.0.0.1:4173](http://127.0.0.1:4173).

Aucune commande <code>npm install</code> n'est requise, car le projet ne possède
aucune dépendance externe.

### Vérifier le code

~~~bash
npm run check
~~~

Ce contrôle vérifie :

- la syntaxe de tous les fichiers JavaScript ;
- l'existence des ressources locales déclarées dans <code>index.html</code> ;
- l'absence de module navigateur incompatible avec l'ouverture directe ;
- la parité des clés entre les traductions françaises et anglaises.

### Organisation

~~~text
retro-animation/
|-- index.html              Structure accessible du lecteur
|-- server.js               Serveur statique local
|-- package.json            Commandes du projet
|-- scripts/
|   |-- app.js              Coordination de l'interface
|   |-- animation.js        Chronologie et chapitres
|   |-- audio.js            Bande-son Web Audio
|   |-- canvas.js           Rendu des treize scènes
|   |-- effects.js          Outils mathématiques et effets
|   |-- exporter.js         Capture PNG
|   |-- sprites.js          Formes procédurales
|   |-- theme.js            Thèmes clair et sombre
|   |-- translations.js     Textes français et anglais
|   \-- check.js            Contrôle statique
\-- styles/
    |-- main.css            Fondations et thèmes
    |-- animation.css       Scène et commandes
    \-- effects.css         Superpositions rétro
~~~

### Pour comprendre le code

Le navigateur charge les scripts dans l'ordre indiqué à la fin de
<code>index.html</code>.

1. <code>translations.js</code> et <code>theme.js</code> préparent les préférences.
2. <code>effects.js</code> et <code>sprites.js</code> fournissent les outils de dessin.
3. <code>canvas.js</code> dessine chaque chapitre dans un repère de 1600 par 900 pixels.
4. <code>animation.js</code> calcule la scène et son temps local à chaque image.
5. <code>audio.js</code> suit la même chronologie pour produire le rythme.
6. <code>app.js</code> relie boutons, chronologie, raccourcis et moteur.

Les commentaires de code sont écrits en français et en anglais près des blocs où
ils apportent du contexte. Les instructions évidentes restent lisibles par leur
nom plutôt que d'être surchargées de commentaires.

---

## English

### The project

<code>retro-animation</code> is no longer a keyframe editor. It is now a complete,
ready-to-watch animation that turns the other repository projects into thirteen
visual chapters:

1. <code>retro-animation</code>: signal opening
2. <code>bank-wave</code>: financial city and data curve
3. <code>synth-run</code>: perspective night race
4. <code>synth-shoot</code>: orbital defense
5. <code>synth-minesweeper</code>: tactical matrix
6. <code>synth-weather-app</code>: weather cycle
7. <code>agretator</code>: news feed
8. <code>angry-tanks</code>: ballistic duel
9. <code>browser-classing</code>: folder tunnel
10. <code>diet</code>: vital circuit
11. <code>calculator-synthwave</code>, <code>pw-generator</code>, and
    <code>qr-generator</code>: logic machines
12. <code>force-four</code> and <code>le synth-pendu</code>: analog duel
13. Synthverse: final convergence

Every visual is generated in real time with the Canvas API. The soundtrack is
synthesized locally with Web Audio after the user intentionally enables sound.
No remote file, account, API key, or third-party package is required.

### Features

- play, pause, restart, and chapter navigation;
- interactive timeline with scene markers;
- locally persisted dark and light themes;
- locally persisted French and English interface;
- optional procedural soundtrack;
- fullscreen mode and PNG capture of the current frame;
- responsive layout and high-density display support;
- <code>prefers-reduced-motion</code> support;
- accessible labels and screen-reader announcements.

### Keyboard controls

| Key | Action |
| --- | --- |
| <code>Space</code> | Play or pause |
| <code>Left Arrow</code> | Previous chapter |
| <code>Right Arrow</code> | Next chapter |
| <code>R</code> | Restart |
| <code>M</code> | Turn sound on or off |
| <code>F</code> | Enter or exit fullscreen |

Shortcuts are ignored while a button or the timeline has focus so their native
behavior remains available.

### Run the project

The project works in two ways:

1. open <code>index.html</code> directly in a modern browser;
2. start the recommended local server:

~~~bash
npm start
~~~

Then open [http://127.0.0.1:4173](http://127.0.0.1:4173).

There is no need to run <code>npm install</code> because the project has no
external dependencies.

### Validate the code

~~~bash
npm run check
~~~

The validation checks:

- JavaScript syntax for every script;
- the presence of local resources declared in <code>index.html</code>;
- the absence of browser modules that would break direct file opening;
- matching keys between French and English translations.

### Structure

~~~text
retro-animation/
|-- index.html              Accessible player structure
|-- server.js               Local static server
|-- package.json            Project commands
|-- scripts/
|   |-- app.js              Interface coordination
|   |-- animation.js        Timeline and chapters
|   |-- audio.js            Web Audio soundtrack
|   |-- canvas.js           Rendering for all thirteen scenes
|   |-- effects.js          Math helpers and effects
|   |-- exporter.js         PNG capture
|   |-- sprites.js          Procedural shapes
|   |-- theme.js            Light and dark themes
|   |-- translations.js     French and English copy
|   \-- check.js            Static validation
\-- styles/
    |-- main.css            Foundations and themes
    |-- animation.css       Stage and controls
    \-- effects.css         Retro overlays
~~~

### Understanding the code

The browser loads scripts in the order listed at the end of
<code>index.html</code>.

1. <code>translations.js</code> and <code>theme.js</code> prepare preferences.
2. <code>effects.js</code> and <code>sprites.js</code> provide drawing helpers.
3. <code>canvas.js</code> draws each chapter in a 1600 by 900 coordinate system.
4. <code>animation.js</code> computes the scene and local time for each frame.
5. <code>audio.js</code> follows the same timeline to generate the rhythm.
6. <code>app.js</code> connects buttons, timeline, shortcuts, and engine.

Code comments appear in French and English near blocks where they add useful
context. Self-explanatory statements stay readable through their names rather
than being buried under unnecessary comments.
