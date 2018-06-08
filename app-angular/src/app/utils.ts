
/**
 * Trie un tableau d'objets
 * @param tab Tableau
 * @param attr Clef pour le tri
 */
export function sort<T>(tab: T[], attr: string): T[] {
    return tab.sort((a,b) => (a[attr] < b[attr] ? -1 : (a[attr] > b[attr] ? 1 : 0)));
}
