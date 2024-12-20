import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { map, tap } from 'rxjs/operators';
import { getSaisonCourante } from '../utils/utils';
import { SportService } from './sport.service';
import { Championnat, ChampModele } from '../model/Championnat';
import { Equipe } from '../model/Equipe';
import { Classement } from '../model/Classement';
import { CalendrierDTO } from '../model/CalendrierDTO';
import { Sport } from '../model/Sport';

@Injectable({
  providedIn: 'root'
})
export class ChampionnatService {

	private cache: Championnat[];
	private cacheModele: ChampModele[];

    constructor(
		private http: HttpClient,
		private sportService: SportService
    ) { }

	/**
	 * @returns La liste des championnats
	 */
    public getChampionnatsCourants(): Observable<Championnat[]> {
		if (this.cache) 
			return of(this.cache);

        return this.http.get<Championnat[]>("/api/championnat", { params: { saison: getSaisonCourante() }}).pipe(
			tap(champs => this.cache = champs)
		);
	}

	/**
	 * @returns La liste des championnats
	 */
    public getChampionnats(saison: string): Observable<Championnat[]> {
		if (this.cache && saison == getSaisonCourante()) 
			return of(this.cache);

		return this.http.get<Championnat[]>("/api/championnat", { params: { saison: saison }});
	}

	/**
	 * Liste les championnats similaires à un autre
	 * @param championnat 
	 */
	public listeSimilaires(championnat: Championnat): Observable<Championnat[]> {
		return this.http.get<Championnat[]>("/api/championnat", { params: {
			"sport": championnat.sport.nom,
			"saison": championnat.saison
		}}).pipe(
			map(champs => champs.filter(champ => champ.id != championnat.id))
		);
	}
	
	/**
	 * Crée un nouveau championnat
	 * @param championnat 
	 */
	public cree(championnat: Championnat, equipes: Equipe[]): Observable<Championnat> {
		this.cache = null;
		this.sportService.verifieCache(championnat.sport);
		return this.http.post<Championnat>("/api/championnat", {championnat: championnat, equipes: equipes});
	}

	/**
	 * Supprime un championnat
	 * @param championnat 
	 */
	public supprime(championnat: Championnat): Observable<any> {
		this.cache = null;
		return this.http.delete("/api/championnat/" + championnat.id);
	}

	/**
	 * Remplace une équipe dans un championnat
	 */
	public remplace(championnat: Championnat, oldEquipe: Equipe, newEquipe: Equipe): Observable<Classement[]> {
		if (oldEquipe.id)
			return this.http.patch<Classement[]>("/api/championnat/" + championnat.id + "/remplace/" + oldEquipe.id + "/" + newEquipe.id, null);
		else
			return this.http.patch<Classement[]>("/api/championnat/" + championnat.id + "/ajoute/" + newEquipe.id, null);
	}

	/**
	 * Retire une équipe dans un championnat
	 */
	public retire(championnat: Championnat, oldEquipe: Equipe): Observable<Classement[]> {
		return this.http.patch<Classement[]>("/api/championnat/" + championnat.id + "/retire/" + oldEquipe.id, null);
	}

	/**
	 * Forfait général pour une équipe dans un championnat
	 */
	public forfaitGeneral(championnat: Championnat, equipe: Equipe, score: number): Observable<Classement[]> {
		return this.http.patch<Classement[]>("/api/championnat/" + championnat.id + "/forfait/" + equipe.id, null, { params: { score: score.toString() } });
	}

	/**
	 * Renomme un championnat
	 */
	public renomme(championnat: Championnat, nom: string): Observable<any> {
		return this.http.patch("/api/championnat/" + championnat.id + "/renomme", nom);
	}

	/**
	 * Rénitialise le mot de passe du championnat
	 */
	public initMdp(championnat: Championnat, mails: string[]): Observable<any> {
		return this.http.patch("/api/championnat/" + championnat.id + "/mdp", mails);
	}

	/**
	 * Importe les résultats existants de championnats dans un nouveau championnat
	 * @param champDest 
	 * @param champSources 
	 */
	public importe(champDest: Championnat, champSources: Championnat[]): Observable<number> {
		return this.http.post<number>("/api/championnat/" + champDest.id + "/importe", champSources);
	}

	/**
	 * Renvoie les infos de calendrier pour les championnats de la saison courante
	 * @param sport 
	 */
	public getCalendrierCourant(sport: Sport): Observable<CalendrierDTO[]> {
		return this.http.get<CalendrierDTO[]>("/api/championnat/" + sport.nom + "/calendrier", { params: { saison: getSaisonCourante() }});
	}

	/**
	 * Génère le lien pour générer le fichier du calendrier
	 * @param sport 
	 * @param champs 
	 */
	public lienCalendrier(sport: Sport, champs: Championnat[]): string {
		return "/api/championnat/" + sport.nom + "/calendrier/genere?champs=" + champs.map(c => c.id).join();
	}

	/**
	 * Récupère les modèles de championnat
	 */
	public getModeles(): Observable<ChampModele[]> {
		if (this.cacheModele)
			return of(this.cacheModele);

		return this.http.get<ChampModele[]>("/api/championnat/modele").pipe(
			tap(modeles => this.cacheModele = modeles)
		);
	}

	/**
	 * Met à jour un modèle de championnat
	 * @param modele 
	 */
	public majModele(modele: ChampModele): Observable<any> {
		this.cacheModele = null;
		this.sportService.verifieCache(modele.sport);
		return this.http.post("/api/championnat/modele", modele);
	}

	/**
	 * Supprime un modèle de championnat
	 * @param modele
	 */
	public supprimeModele(modele: ChampModele): Observable<any> {
		this.cacheModele = null;
		return this.http.delete("/api/championnat/modele/" + modele.id);
	}
}
