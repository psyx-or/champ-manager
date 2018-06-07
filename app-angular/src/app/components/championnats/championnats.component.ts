import { Component, OnInit } from '@angular/core';
import { ChampionnatService } from '../../services/championnat.service';
import { Championnat } from '../../model/Championnat';

@Component({
  selector: 'app-championnats',
  templateUrl: './championnats.component.html',
  styleUrls: ['./championnats.component.css']
})
export class ChampionnatsComponent implements OnInit {

    championnats: Championnat[];

    constructor(
        private championnat: ChampionnatService
    ) { }

    ngOnInit() {
        this.championnat.getChampionnats().subscribe(championnats => this.championnats = championnats);
    }

}
