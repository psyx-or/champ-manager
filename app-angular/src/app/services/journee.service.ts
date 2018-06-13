import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { sort } from '../utils';
import { Championnat } from '../model/Championnat';

@Injectable({
  providedIn: 'root'
})
export class JourneeService {

	constructor(
		private http: HttpClient
	) { }

	/**
	 * Renvoie un championnat avec toutes ses journées
	 * @param champId 
	 */
	public getJournees(champId: number): Observable<Championnat> {
		return this.http.get<Championnat>("/api/journee/" + champId);
	}
}
