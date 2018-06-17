import { ModalComponent } from "../components/modal/modal.component";
import { TemplateRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { Match } from "../model/Match";

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
 * Ouverture d'une fenêtre modale de confirmation
 * @param composant Composant ouvrant la pop-up (this)
 * @param titre Titre de la fenêtre
 * @param contenu Contenu de la fenêtre
 * @param contexte Variable associée au contenu
 * @param cb Callback en cas de validation
 */
export function openModal(composant: { modalService: NgbModal }, titre: string, contenu: TemplateRef<any>, contexte: any, cb: ()=>void) {
	const modal = composant.modalService.open(ModalComponent, { centered: true, backdrop: 'static' });
	modal.componentInstance.titre = titre;
	modal.componentInstance.contenu = contenu;
	modal.componentInstance.contexte = { $implicit: contexte };
	modal.result.then((res) => cb.bind(composant)(res), () => {});
}

/**
 * Calcule les propriétés d'un objet Match liées à l'affichage
 * @param m 
 */
export function toDisp(m: Match) {
	m.dispEquipe1 = m.equipe1 == null ? "A décider" : m.equipe1.nom;
	m.dispEquipe2 = m.equipe2 == null ? "A décider" : m.equipe2.nom;
	m.dispScore1 = m.forfait1 ? "FO" : m.score1;
	m.dispScore2 = m.forfait2 ? "FO" : m.score2;
}

/**
 * Traduit les scores renseignés par l'utilisateur
 * @param m 
 */
export function fromDisp(m: Match) {
	if (m.dispScore1 == "FO") {
		m.forfait1 = true;
		m.score1 = null;
	}
	else {
		m.forfait1 = false;
		m.score1 = +m.dispScore1;
	}
	if (m.dispScore2 == "FO") {
		m.forfait2 = true;
		m.score2 = null;
	}
	else {
		m.forfait2 = false;
		m.score2 = +m.dispScore2;
	}
}
