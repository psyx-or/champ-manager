import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipe } from '../model/Equipe';
import { getSaisonCourante } from '../utils/utils';
import { Sport } from '../model/Sport';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

	constructor(
		private http: HttpClient
	) { }

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
		return this.http.get<Equipe[]>("/api/equipe/" + sport.nom + "/detail", { params: { saison: getSaisonCourante() } });
	}
}
