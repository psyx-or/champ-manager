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

	/**
	 * Fonction utilisée par les resolvers pour afficher la barre de progression
	 * @param req 
	 */
	public recupere<T>(req: Observable<T>): Observable<T> {
		setTimeout(() => {
			this.chargement = true;
		});

		return req.pipe(
			tap(_ => this.chargement = false),
			catchError((err, caught) => { 
				this.chargement = false;
				alert("Erreur lors de l'opération");
				return of(null);
			})
		);
	}
}
