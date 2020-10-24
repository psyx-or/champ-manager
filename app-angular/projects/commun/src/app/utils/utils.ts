import { ModalComponent } from "../components/modal/modal.component";
import { TemplateRef } from "@angular/core";
import { NgbModal, NgbModalOptions, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { Match } from "../model/Match";
import { Equipe } from "../model/Equipe";


/* Constantes */
export const STYLE_MEME_EQUIPE = "font-weight-bold";

/** Jours de la semaine */
export var jours = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

/**
 * Renvoie la saison en cours
 */
export function getSaisonCourante(): string {
	let date = new Date();
	return getSaison(date);
}

/**
 * Renvoie la saison correspondant à une date
 * @param date 
 */
export function getSaison(date: Date): string {
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
 * @param taille
 * @param formulaire Vrai si le contenu est un formulaire (dans ce cas, son id doit être "formulaire" et il doit fermer la modale dans son submit)
 */
export function openModal(
		composant: { modalService: NgbModal },
		titre: string,
		contenu: TemplateRef<any>,
		contexte: any,
		cb?: () => void,
		taille?: "sm" | "lg",
		formulaire?: boolean): NgbModalRef {

	let options: NgbModalOptions = { centered: true, backdrop: 'static' };
	if (taille) options.size = taille;

	const modal = composant.modalService.open(ModalComponent, options);
	modal.componentInstance.titre = titre;
	modal.componentInstance.contenu = contenu;
	modal.componentInstance.contexte = { $implicit: contexte };
	modal.componentInstance.valider = (cb != null);
	modal.componentInstance.formulaire = formulaire || false;
	modal.result.then((res) => { if (cb) cb.bind(composant)(res) }, () => {});
	return modal;
}

/**
 * Calcule les propriétés d'un objet Match liées à l'affichage
 * @param m 
 */
export function toDisp(m: Match): Match {
	m.dispEquipe1 = m.equipe1 == null ? "A décider" : m.equipe1.nom;
	m.dispEquipe2 = m.equipe2 == null ? "A décider" : m.equipe2.nom;
	m.dispScore1 = m.forfait1 ? "FO" : m.score1;
	m.dispScore2 = m.forfait2 ? "FO" : m.score2;
	return m;
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


/**
 * Calcule le style associé à une équipe
 * @param match 
 * @param i Index de l'équipe considérée
 * @param equipe Equipe actuellement sélectionnée
 */
export function calculeStyle(match: Match, i: 1|2, equipe: Equipe): string {
	const j = 3 - i;
	let style = "";
	if (equipe != null) {
		if (match[`equipe${i}`] && match[`equipe${i}`].id == equipe.id)
			style = STYLE_MEME_EQUIPE + " ";
		else if (match[`forfait${i}`])
			return "forfait text-dark";
		else
			return "text-dark";
	}

	if (match[`forfait${i}`])
		return style + "forfait text-dark";
	if (match[`forfait${j}`])
		return style + "text-success";

	if (match[`score${i}`] === null || match[`score${j}`] === null)
		return style + "text-dark";

	if (match[`score${i}`] > match[`score${j}`])
		return style + "text-success";
	if (match[`score${i}`] < match[`score${j}`])
		return style + "text-danger";

	return style + "text-dark";
}

/**
 * Convertit un nombre décimal en nombre entier à 2 chiffres
 * @param num 
 */
function pad(num: number): string {
	const norm = Math.floor(Math.abs(num));
	return (norm < 10 ? '0' : '') + norm;
}

/**
 * Convertit une date au format ISO8601 avec fuseau
 * @param date 
 */
export function toIsoStringTz(date: Date): string {
	const tzo = -date.getTimezoneOffset();
    const dif = tzo >= 0 ? '+' : '-';
	
	return date.getFullYear() +
        '-' + pad(date.getMonth() + 1) +
        '-' + pad(date.getDate()) +
        'T' + pad(date.getHours()) +
        ':' + pad(date.getMinutes()) +
        ':' + pad(date.getSeconds()) +
        dif + pad(tzo / 60) +
        ':' + pad(tzo % 60);
}
