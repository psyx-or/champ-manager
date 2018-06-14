import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

/**
 * Service permettant d'afficher la barre de chargement
 */
@Injectable({
  providedIn: 'root'
})
export class RequeteService {

	constructor() { }

	/** Indique si un chargement est en cours */
	public chargement: boolean = false;

	/**
	 * Effectue une requête et affiche la barre de chargement.
	 * Affiche un message d'erreur en cas de problème dans la requête.
	 * @param req
	 * @param cb 
	 */
	public requete<T>(req: Observable<T>, cb: (val: T) => void) {
		setTimeout(() => {
			this.chargement = true;
		});
		
		req.subscribe(
			res => { this.chargement = false; cb(res) },
			err => { this.chargement = false; alert("Erreur lors de l'opération"); }
		);
	}
}
