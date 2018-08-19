import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Equipe } from '@commun/src/app/model/Equipe';
import { Observable, of, BehaviorSubject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthentService {

	private equipe$: BehaviorSubject<Equipe> = new BehaviorSubject<Equipe>(null);

	constructor(
		private http: HttpClient
	) {
		this.authentifie(null).subscribe();
	}

	/**
	 * Récupère l'équipe de l'utilisateur s'il s'est déjà authentifié
	 */
	public getEquipe(): Observable<Equipe> {
		return this.equipe$.asObservable();
	}

	/**
	 * Essaie de se connecter si creds est fourni.
	 * Vérifie si l'utilisateur est connecté sinon.
	 * @param creds 
	 */
	public authentifie(creds?): Observable<boolean> {
		let body: FormData = new FormData();
		if (creds != null) {
			body.set('login', creds.login);
			body.set('password', creds.password);
			body.set('_remember_me', "on");
		}

		return this.http.post<Equipe>("/api/me", body).pipe(
			map(equipe => { 
				if (equipe.id) {
					this.equipe$.next(equipe);
					return true;
				}
				else {
					return false;
				}
			}),
			catchError(() => of(false))
		);
	}

	/**
	 * Déconnecte l'utilisateur
	 */
	public deconnecte(): Observable<any> {
		return this.http.get("/api/logout").pipe(
			tap(() => this.equipe$.next(null))
		);
	}
}
