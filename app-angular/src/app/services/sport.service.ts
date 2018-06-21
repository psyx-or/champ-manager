import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { Sport } from '../model/Sport';
import { sort } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class SportService {

	private sports: Sport[]; // TODO: vider cache quand création championnat 

    constructor(
        private http: HttpClient
    ) { }

    public getSports(): Observable<Sport[]> {
		if (this.sports != null)
			return of(this.sports);
		else
			return this.http.get<Sport[]>("/api/sport").pipe(
				map(sports => sort(sports, 'nom')),
				tap(sports => this.sports = sports)
			);
    }
}
