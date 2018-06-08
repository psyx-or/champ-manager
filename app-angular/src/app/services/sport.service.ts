import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Sport } from '../model/Sport';

@Injectable({
  providedIn: 'root'
})
export class SportService {

    constructor(
        private http: HttpClient
    ) { }

    public getSports(): Observable<Sport[]> {
        return this.http.get<Sport[]>("/api/sport");
    }
}
