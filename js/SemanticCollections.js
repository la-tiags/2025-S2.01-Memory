/**
 * Collection unique pour le mode Memory Sémantique.
 * 8 paires = 16 images au total.
 *
 * Structure d'une paire :
 *   pairId  → identifiant commun aux deux cartes (détermine le match)
 *   a / b   → les deux côtés : id unique, url, name (affiché sous la carte)
 */

/**
 * @type {SemanticCollections} SemanticCollections
 */

export const semanticCollections = {

  semantic: [
    { pairId: 1, a: { id: 'sem_1a', url: '../assets/images/inverse/compare1.png',  name: 'Clé'  },
                 b: { id: 'sem_1b', url: '../assets/images/inverse/comparant1.png',  name: 'Serrure'  } },
    { pairId: 2, a: { id: 'sem_2a', url: '../assets/images/inverse/compare2.png',  name: 'Bébé'  },
                 b: { id: 'sem_2b', url: '../assets/images/inverse/comparant2.png',  name: 'Vieux'  } },
    { pairId: 3, a: { id: 'sem_3a', url: '../assets/images/inverse/compare3.png',  name: 'Eau'  },
                 b: { id: 'sem_3b', url: '../assets/images/inverse/comparant3.png',  name: 'Feu'  } },
    { pairId: 4, a: { id: 'sem_4a', url: '../assets/images/inverse/compare4.png',  name: 'Maison'  },
                 b: { id: 'sem_4b', url: '../assets/images/inverse/comparant4.png',  name: 'Brique'  } },
    { pairId: 5, a: { id: 'sem_5a', url: '../assets/images/inverse/compare5.png',  name: 'Astronaute'  },
                 b: { id: 'sem_5b', url: '../assets/images/inverse/comparant5.png', name: 'Fusée' } },
    { pairId: 6, a: { id: 'sem_6a', url: '../assets/images/inverse/compare6.png', name: 'Carte' },
                 b: { id: 'sem_6b', url: '../assets/images/inverse/comparant6.png', name: 'Boussole' } },
    { pairId: 7, a: { id: 'sem_7a', url: '../assets/images/inverse/compare7.png', name: 'Graine' },
                 b: { id: 'sem_7b', url: '../assets/images/inverse/comparant7.png', name: 'Arbre' } },
    { pairId: 8, a: { id: 'sem_8a', url: '../assets/images/inverse/compare8.png', name: 'Clavier' },
                 b: { id: 'sem_8b', url: '../assets/images/inverse/comparant8.png', name: 'Souris' } },
  ],

};
