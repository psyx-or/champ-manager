import { Journee } from "./model/Journee";

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

/**
 * Calcule le libellé associé à une journée
 * @param j 
 */
export function strJournee(j: Journee): string {
	if (j.numero > 0) return "Journée " + j.numero;
	if (j.numero == -1) return "Finale";
	return "1/" + 2 ** (-j.numero - 1) + " Finale"
}
