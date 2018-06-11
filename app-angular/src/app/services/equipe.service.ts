import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Equipe } from '../model/Equipe';

@Injectable({
  providedIn: 'root'
})
export class EquipeService {

	constructor(
		private http: HttpClient
	) { }

	public getEquipes(sport: string): Observable<Equipe[]> {
		return this.http.get<Equipe[]>("/api/equipe/" + sport);
	}
}
