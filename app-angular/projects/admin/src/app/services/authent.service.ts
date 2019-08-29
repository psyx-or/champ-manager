import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, ReplaySubject } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import { UserDTO } from '@commun/src/app/model/UserDTO';

/**
 * Informations sur l'utilisateur courant
 */
export interface User {
	isAdmin?: boolean;
	champId?: number;
	champNom?: string;
	isError?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthentService {

	private user$: ReplaySubject<User> = new ReplaySubject<User>(1);

	constructor(
		private http: HttpClient,
	) { 
		this.authentifie().subscribe();
	}

	/**
	 * Récupère l'utilisateur s'il s'est déjà authentifié
	 */
	public getUser(): Observable<User> {
		return this.user$.asObservable();
	}

	/**
	 * Essaie de se connecter si creds est fourni.
	 * Vérifie si l'utilisateur est connecté sinon.
	 * @param creds 
	 */
	public authentifie(creds?: {login:string, password:string}): Observable<any> {
		let body: FormData = new FormData();
		if (creds != null) {
			body.append('login', creds.login);
			body.append('password', creds.password);
		}

		return this.http.post<UserDTO>("/api/me", body).pipe(
			map(user => {
				let obj: User = {
					isAdmin: user.roles.indexOf("ROLE_ADMIN") != -1,
					champId: user.champId,
					champNom: user.champNom,
				}

				if (obj.isAdmin || obj.champId != null) {
					this.user$.next(obj);
				}
				else {
					this.user$.next({});
				}
			}),
			catchError(() => {
				this.user$.next({isError: creds != null});
				return of({});
			})
		);
	}

	/**
	 * Déconnecte l'utilisateur
	 */
	public deconnecte(): Observable<any> {
		return this.http.get("/api/logout").pipe(
			tap(() => this.user$.next({}))
		);
	}}
