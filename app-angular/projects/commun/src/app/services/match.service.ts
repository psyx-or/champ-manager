import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getSaisonCourante } from '../utils/utils';
import { Championnat } from '../model/Championnat';
import { Journee } from '../model/Journee';
import { Match } from '../model/Match';
import { Sport } from '../model/Sport';
import { DoublonDTO } from '../model/DoublonDTO';

@Injectable({
  providedIn: 'root'
})
export class MatchService {

	constructor(
		private http: HttpClient
	) { }

	/**
	 * Renvoie la liste des matches d'un championnat
	 * @param champId 
	 */
	public liste(champId: number): Observable<Championnat> {
		return this.http.get<Championnat>("/api/match/" + champId);
	}

	/**
	 * Renvoie la liste des matches d'une équipe pour la saison courante
	 * @param equipeId 
	 */
	public listeEquipe(equipeId: number): Observable<Championnat[]> {
		return this.http.get<Championnat[]>("/api/match/equipe/" + equipeId, { params: { saison: getSaisonCourante() } });
	}

	/**
	 * Renvoie une hiérarchie de matches
	 * @param champId 
	 */
	public getHierarchie(champId: number): Observable<Journee> {
		return this.http.get<Journee>("/api/match/hierarchie/" + champId);
	}

	/**
	 * Renvoie les hiérarchies de matches associées à une équipe
	 * @param equipeId 
	 */
	public getHierarchies(equipeId: number): Observable<Journee[]> {
		return this.http.get<Journee[]>("/api/match/hierarchie/equipe/" + equipeId, { params: { saison: getSaisonCourante() }});
	}

	/**
	 * Valide un match
	 * @param match 
	 */
	public valide(match: Match): Observable<Match> {
		return this.http.patch<Match>("/api/match/" + match.id, null);
	}

	/**
	 * Met à jour les matches d'une journée (ADMIN)
	 * @param journee 
	 */
	public maj(journee: Journee): Observable<Match[]> {
		return this.http.put<Match[]>("/api/match/", journee.matches);
	}

	/**
	 * Met à jour un match
	 * @param journee 
	 */
	public majMatch(match: Match, feuille?: File): Observable<any> {
		let body: FormData = new FormData();
		body.append("id", match.id.toString());
		if (match.score1 != null)
			body.append("score1", match.score1 + "");
		if (match.score2 != null)
			body.append("score2", match.score2 + "");
		body.append("forfait1", match.forfait1 + "");
		body.append("forfait2", match.forfait2 + "");
		if (feuille)
			body.append("feuille", feuille, feuille.name);

		return this.http.post<any>("/api/match/", body);
	}

	/**
	 * Renvoie la liste des matches à valider
	 * @param sport
	 */
	public avalider(sport: Sport): Observable<Championnat[]> {
		return this.http.get<Championnat[]>("/api/match/avalider/" + sport.nom);
	}

	/**
	 * Récupère la liste des matches sur le même terrain
	 * @param sport 
	 */
	public getDoublons(sport: Sport): Observable<DoublonDTO[]> {
		return this.http.get<DoublonDTO[]>(`/api/match/${sport.nom}/doublons`, { params: { saison: getSaisonCourante() } })
	}

	/**
	 * Inverse un match
	 * @param match 
	 */
	public inverse(match: Match): Observable<any> {
		return this.http.patch(`/api/match/${match.id}/inverse`, null);
	}
}
