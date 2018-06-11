
/**
 * Trie un tableau d'objets selon un attribut de type string
 * @param tab Tableau
 * @param attr Clef pour le tri
 */
export function sort<T>(tab: T[], attr: string): T[] {
    return tab.sort((a,b) => (a[attr].toUpperCase() < b[attr].toUpperCase() ? -1 : (a[attr].toUpperCase() > b[attr].toUpperCase() ? 1 : 0)));
}
