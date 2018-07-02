import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FPForm } from '../model/FPForm';
import { tap } from 'rxjs/operators';
import { Match } from '../model/Match';
import { FPFeuilleAfficheDTO, FPFeuille } from '../model/FPFeuille';

@Injectable({
  providedIn: 'root'
})
export class FairplayService {

	private cache: FPForm[];

	constructor(
		private http: HttpClient
	) { }

	/**
	 * Liste les feuilles de fair-play
	 */
	public liste(complet: boolean): Observable<FPForm[]> {
		if (!complet && this.cache)
			return of(this.cache);

		return this.http.get<FPForm[]>("/api/fairplay", { params: { complet: complet + "" } }).pipe(
			tap(forms => { if (!complet) this.cache = forms } )
		);
	}

	/**
	 * Ajoute ou modifie une feuille de fair-play
	 * @param form
	 */
	public maj(form: FPForm): Observable<string> {
		this.cache = null;
		return this.http.post<string>("/api/fairplay", form);
	}

	/**
	 * Supprime une feuille de fair-play
	 * @param form
	 */
	public supprime(form: FPForm): Observable<string> {
		this.cache = null;
		return this.http.delete<string>("/api/fairplay/" + form.id);
	}

	/**
	 * Récupère une feuille de fair-play (éventuellement vide)
	 * @param match 
	 * @param equipe 
	 */
	public getFeuille(match: Match, equipe: 1 | 2): Observable<FPFeuilleAfficheDTO> {
		return this.http.get<FPFeuilleAfficheDTO>("/api/fairplay/feuille/" + match.id + "/" + equipe);
	}

	/**
	 * Met à jour une feuille de fair-play
	 * @param match 
	 * @param dto 
	 */
	public majFeuille(match: Match, dto: FPFeuilleAfficheDTO): Observable<FPFeuille> {
		return this.http.post<FPFeuille>("/api/fairplay/feuille/" + match.id, { fpFeuille: dto.fpFeuille, reponses: dto.reponses });
	}
}
