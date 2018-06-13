
/**
 * Trie un tableau d'objets selon un attribut
 * @param tab Tableau
 * @param attr Clef pour le tri
 */
export function sort<T>(tab: T[], attr: string): T[] {

    return tab.sort((a,b) => {
		let attrA = a[attr];
		let attrB = b[attr];

		if (typeof(attrA)=="string") attrA = attrA.toUpperCase();
		if (typeof(attrB)=="string") attrB = attrB.toUpperCase();

		return (attrA < attrB ? -1 : (attrA > attrB ? 1 : 0))
	});
}
