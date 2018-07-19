import { ModalComponent } from "../components/modal/modal.component";
import { TemplateRef } from "@angular/core";
import { NgbModal, NgbModalOptions } from "@ng-bootstrap/ng-bootstrap";
import { Match } from "../model/Match";
import { Equipe } from "../model/Equipe";


/**
 * Renvoie la saison en cours
 */
export function getSaisonCourante(): string {
	let date = new Date();
	return date.getMonth() < 8 ? (date.getFullYear() - 1) + " / " + date.getFullYear() : date.getFullYear() + " / " + (date.getFullYear() + 1);
}

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
export function openModal(composant: { modalService: NgbModal }, titre: string, contenu: TemplateRef<any>, contexte: any, cb?: () => void, taille?: "sm" | "lg") {
	let options: NgbModalOptions = { centered: true, backdrop: 'static' };
	if (taille) options.size = taille;

	const modal = composant.modalService.open(ModalComponent, options);
	modal.componentInstance.titre = titre;
	modal.componentInstance.contenu = contenu;
	modal.componentInstance.contexte = { $implicit: contexte };
	modal.componentInstance.valider = (cb != null);
	modal.result.then((res) => { if (cb) cb.bind(composant)(res) }, () => {});
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
		m.score1 = m.dispScore1 && m.dispScore1 != "" ? +m.dispScore1 : null;
	}
	if (m.dispScore2 == "FO") {
		m.forfait2 = true;
		m.score2 = null;
	}
	else {
		m.forfait2 = false;
		m.score2 = m.dispScore2 && m.dispScore2 != "" ? +m.dispScore2 : null;
	}
}

/**
 * Renvoie l'équipe vainqueur d'un match (s'il y a eu un vainqueur)
 * @param m 
 */
export function getVainqueur(m: Match): Equipe|null {
	// Gestion des forfaits
	if (m.forfait1 && m.forfait2)
		return null;
	if (m.forfait1)
		return m.equipe2;
	if (m.forfait2)
		return m.equipe1;

	// Gestion du score
	if (m.score1 == m.score2)
		return null;
	else
		return (m.score1 > m.score2) ? m.equipe1 : m.equipe2;
}
