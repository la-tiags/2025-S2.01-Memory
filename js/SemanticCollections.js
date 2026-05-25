/**
 * Collection unique pour le mode Memory Sémantique.
 * 8 paires = 16 images au total.
 *
 * Structure d'une paire :
 *   pairId  → identifiant commun aux deux cartes (détermine le match)
 *   a / b   → les deux côtés : id unique, url, name (affiché sous la carte)
 */

export const semanticCollections = {

  semantic: [
    { pairId: 1, a: { id: 'sem_1a', url: './assets/images/semantic/clé.png',  name: 'Clé'  },
                 b: { id: 'sem_1b', url: './assets/images/semantic/serrure.png',  name: 'Serrure'  } },
    { pairId: 2, a: { id: 'sem_2a', url: './assets/images/semantic/bebe.png',  name: 'Bébé'  },
                 b: { id: 'sem_2b', url: './assets/images/semantic/vieux.png',  name: 'Vieux'  } },
    { pairId: 3, a: { id: 'sem_3a', url: './assets/images/semantic/eau.png',  name: 'Eau'  },
                 b: { id: 'sem_3b', url: './assets/images/semantic/feu.png',  name: 'Feu'  } },
    { pairId: 4, a: { id: 'sem_4a', url: './assets/images/semantic/maison.png',  name: 'Maison'  },
                 b: { id: 'sem_4b', url: './assets/images/semantic/brique.png',  name: 'Brique'  } },
    { pairId: 5, a: { id: 'sem_5a', url: './assets/images/semantic/astronaute.png',  name: 'Astronaute'  },
                 b: { id: 'sem_5b', url: './assets/images/semantic/fusée.png', name: 'Fusée' } },
    { pairId: 6, a: { id: 'sem_6a', url: './assets/images/semantic/carte.png', name: 'Carte' },
                 b: { id: 'sem_6b', url: './assets/images/semantic/boussole.png', name: 'Boussole' } },
    { pairId: 7, a: { id: 'sem_7a', url: './assets/images/semantic/graine.png', name: 'Graine' },
                 b: { id: 'sem_7b', url: './assets/images/semantic/arbre.png', name: 'Arbre' } },
    { pairId: 8, a: { id: 'sem_8a', url: './assets/images/semantic/clavier.png', name: 'Clavier' },
                 b: { id: 'sem_8b', url: './assets/images/semantic/souris.png', name: 'Souris' } },
  ],

};
