import { ModalComponent } from "../components/modal/modal.component";
import { TemplateRef } from "@angular/core";
import { NgbModal } from "@ng-bootstrap/ng-bootstrap";

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
