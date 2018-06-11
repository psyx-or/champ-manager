import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Sport } from '../model/Sport';
import { sort } from '../utils';

@Injectable({
  providedIn: 'root'
})
export class SportService {

    constructor(
        private http: HttpClient
    ) { }

    public getSports(): Observable<Sport[]> {
        return this.http.get<Sport[]>("/api/sport").pipe(
			map(sports => sort(sports, 'nom'))
		);
    }
}
