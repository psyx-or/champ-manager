import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RequeteService } from '../../services/requete.service';
import { EquipeService } from '../../services/equipe.service';
import { Equipe } from '../../model/Equipe';

@Component({
  selector: 'app-equipe',
  templateUrl: './equipe.component.html',
  styleUrls: ['./equipe.component.css']
})
export class EquipeComponent implements OnInit {

	equipe: Equipe;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public requeteService: RequeteService,
		private equipeService: EquipeService,
	) { }

	ngOnInit() {
		this.route.data
			.subscribe((data: { equipe: Equipe }) => this.equipe = data.equipe);
	}

	submit() {
		// On pousse
		this.requeteService.requete(
			this.equipeService.majEquipes([this.equipe]),
			n => { alert("Equipe mise à jour"); this.router.navigate(["/equipe", this.equipe.id]); }
		);
	}
}
