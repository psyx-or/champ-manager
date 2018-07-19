import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { FPForm } from '../model/FPForm';
import { tap } from 'rxjs/operators';
import { Match } from '../model/Match';
import { FPFeuilleAfficheDTO, FPFeuille } from '../model/FPFeuille';
import { Sport } from '../model/Sport';
import { FPClassement } from '../model/FPClassement';
import { getSaisonCourante } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class FairplayService {

	private cache: FPForm[];
	private lastClassement: { sport: Sport, class: FPClassement[] };

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
	 * Récupère une feuille de fair-play complète
	 * @param feuille
	 */
	public getFeuilleById(feuille: FPFeuille): Observable<FPFeuilleAfficheDTO> {
		return this.http.get<FPFeuilleAfficheDTO>(`/api/fairplay/feuille/${feuille.id}`);
	}

	/**
	 * Met à jour une feuille de fair-play
	 * @param match 
	 * @param dto 
	 */
	public majFeuille(dto: FPFeuilleAfficheDTO): Observable<FPFeuille> {
		return this.http.post<FPFeuille>("/api/fairplay/feuille/" + dto.matchId, { fpFeuille: dto.fpFeuille, reponses: dto.reponses });
	}

	/**
	 * Récupère le classement du fair-play
	 * @param sport 
	 */
	public getClassement(sport: Sport): Observable<FPClassement[]> {
		return this.http.get<FPClassement[]>(`/api/fairplay/classement/${sport.nom}`, { params: { saison: getSaisonCourante() }}).pipe(
			tap(classements => this.lastClassement = {sport: sport, class: classements})
		)
	}

	/**
	 * Récupère le dernier classement du fair-play récupéré
	 */
	public getLastClassement(): null | {sport: Sport, class: FPClassement[] } {
		return this.lastClassement;
	}

	/**
	 * Récupère les feuilles de fair-play concernant une équipe pour la saison courante
	 * @param equipeId 
	 * @param type "evaluation" | "redaction"
	 */
	public getFeuilles(equipeId: number, type: string): Observable<FPFeuille[]> {
		return this.http.get<FPFeuille[]>(`/api/fairplay/${equipeId}/${type}`, { params: { saison: getSaisonCourante() }});
	}
}
