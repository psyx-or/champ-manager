import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';

/**
 * Service permettant d'afficher la barre de chargement
 */
@Injectable({
  providedIn: 'root'
})
export class RequeteService {

	constructor() { }

	/** Compte le nombre de requêtes en cours */
	private nbChargements: number = 0;

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
			this.updateChargement(1);
		});
		
		req.subscribe(
			res => { this.updateChargement(-1); cb(res) },
			err => { this.updateChargement(-1); alert("Erreur lors de l'opération"); }
		);
	}

	/**
	 * Fonction utilisée par les resolvers pour afficher la barre de progression
	 * @param req 
	 */
	public recupere<T>(req: Observable<T>): Observable<T> {
		setTimeout(() => {
			this.updateChargement(1);
		});

		return req.pipe(
			tap(_ => this.updateChargement(-1)),
			catchError((err, caught) => { 
				this.updateChargement(-1);
				alert("Erreur lors de l'opération");
				return of(null);
			})
		);
	}

	/**
	 * Met à jour le nombre de requêtes en cours
	 * @param n 
	 */
	private updateChargement(n: 1|-1) {
		this.nbChargements += n;
		this.chargement = this.nbChargements > 0;
	}
}
