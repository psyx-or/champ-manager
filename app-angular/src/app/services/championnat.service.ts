import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Championnat } from '../model/Championnat';

@Injectable({
  providedIn: 'root'
})
export class ChampionnatService {

    constructor(
        private http: HttpClient
    ) { }

    public getChampionnats(): Observable<Championnat[]> {
        return this.http.get<Championnat[]>("/api/championnat");
    }
}
