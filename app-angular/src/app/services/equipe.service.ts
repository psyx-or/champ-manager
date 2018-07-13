import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipe } from '../model/Equipe';
import { getSaisonCourante } from '../utils/utils';
import { Sport } from '../model/Sport';
import { map } from 'rxjs/operators';
import { Creneau } from '../model/Creneau';
import { Responsable } from '../model/Responsable';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

	constructor(
		private http: HttpClient
	) { }

	/**
	 * Recherche des équipes
	 * @param q 
	 */
	public recherche(q: string): Observable<Equipe[]> {
		return this.http.get<Equipe[]>("/api/equipe/recherche", {params: {q: q}});
	}

	/**
	 * Récupère une équipe et ses coordonnées
	 * @param id 
	 */
	public get(id: number): Observable<Equipe> {
		return this.http.get<Equipe>(`/api/equipe/${id}`).pipe(
			map(this.fromServer)
		);
	}

	/**
	 * Renvoie le nom des équipes d'un sport
	 * @param sport 
	 */
	public getEquipes(sport: Sport): Observable<Equipe[]> {
		return this.http.get<Equipe[]>("/api/equipe/" + sport.nom);
	}

	/**
	 * Renvoie le détail des équipes d'un sport pour la saison courante
	 */
	public getEquipesCourantes(sport: Sport): Observable<Equipe[]> {
		return this.http.get<Equipe[]>(`/api/equipe/${sport.nom}/detail`, { params: { saison: getSaisonCourante() } }).pipe(
			map(equipes => equipes.map(this.fromServer))
		);
	}

	/**
	 * Met à jour des équipes
	 * @param equipes 
	 */
	public majEquipes(equipes: Equipe[]): Observable<number> {
		return this.http.post<number>("/api/equipe/", equipes.map(this.toServer));
	}

	/**
	 * Renvoi le lien vers l'annuaire
	 * @param sport
	 */
	public lienAnnuaire(sport: Sport): string {
		return sport == null ? null : `/api/equipe/${sport.nom}/annuaire?saison=${getSaisonCourante()}`;
	}

	/**
	 * Change le mot de passe d'une équipe et fournit le mail associé
	 * @param equipe 
	 */
	public changeMdp(equipe: Equipe): Observable<{ destinataires: string, objet: string, corps: string}> {
		return this.http.patch<{ destinataires: string, objet: string, corps: string }>(`/api/equipe/${equipe.id}`, null);
	}

	/**
	 * Transforme les contats d'une équipe pour faciliter l'affichage
	 * @param equipe 
	 */
	private fromServer(equipe: Equipe): Equipe {
		// On s'assure de pouvoir saisir 2 responsables
		for (let i = equipe.responsables.length; i < 2; i++)
			equipe.responsables.push(new Responsable());
		// Et au moins un créneau
		if (equipe.creneaux.length == 0)
			equipe.creneaux.push(new Creneau());
		else
			equipe.creneaux.forEach(e => e.heureDisp = moment(e.heure).format("HH:mm"));

		return equipe;
	}

	/**
	 * Transforme les contats d'une équipe vers le format attendu par le serveur
	 * @param equipe 
	 */
	private toServer(equipe: Equipe): Equipe {
		// On filtre
		equipe.creneaux.forEach(c => c.heure = moment("1970-01-01 " + c.heureDisp, "YYYY-MM-DD HH:mm").add(1, 'hour').toDate())
		equipe.creneaux = equipe.creneaux.filter(c => c.heure != null && c.jour != null);

		return equipe;
	}
}
