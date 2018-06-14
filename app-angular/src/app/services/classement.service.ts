import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Championnat } from '../model/Championnat';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassementService {

	constructor(
		private http: HttpClient
	) { }

	/**
	 * Récupère le classement d'un championnat
	 * @param champId
	 */
	public get(champId: number): Observable<Championnat> {
		return this.http.get<Championnat>("/api/classement/" + champId);
	}
}
