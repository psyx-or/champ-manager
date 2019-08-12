import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { getSaisonCourante } from '../utils/utils';
import { FPForm } from '../model/FPForm';
import { FPResultat } from '../model/FPClassement';
import { Match } from '../model/Match';
import { FPFeuilleAfficheDTO, FPFeuille } from '../model/FPFeuille';
import { Championnat } from '../model/Championnat';

@Injectable({
  providedIn: 'root'
})
export class FairplayService {

	private cache: FPForm[];
	private cacheFPResultat: FPResultat;

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
	 * @param champId
	 */
	public getClassement(champId: number): Observable<FPResultat> {
		if (this.cacheFPResultat && this.cacheFPResultat.champ.id == champId) {
			return of(this.cacheFPResultat);
		}
		else {
			return this.http.get<FPResultat>(`/api/fairplay/classement/${champId}`).pipe(
				tap(res => this.cacheFPResultat = res)
			);
		}
	}

	/**
	 * Récupère les feuilles de fair-play concernant une équipe pour la saison courante
	 * @param equipeId 
	 * @param type "evaluation" | "redaction"
	 */
	public getFeuilles(equipeId: number, type: string): Observable<Championnat[]> {
		return this.http.get<Championnat[]>(`/api/fairplay/${equipeId}/${type}`, { params: { saison: getSaisonCourante() }});
	}
}
