import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommunModule } from '@commun/src/app/commun.module';
import { AppRoutingModule } from './app-routing.module';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ChampionnatsComponent } from './components/championnats/championnats.component';
import { ClassementComponent } from './components/classement/classement.component';
import { MatchesComponent } from './components/matches/matches.component';
import { MatchesChampionnatComponent } from './components/matches-championnat/matches-championnat.component';
import { ClassementChampionnatComponent } from './components/classement-championnat/classement-championnat.component';
import { ClassementEquipeComponent } from './components/classement-equipe/classement-equipe.component';
import { ClassementEquipeResolver } from './components/classement-equipe/classement-equipe.resolver';
import { EquipeComponent } from './components/equipe/equipe.component';
import { MatchesEquipeComponent } from './components/matches-equipe/matches-equipe.component';
import { MatchesEquipeResolver } from './utils/matches-equipe.resolver';
import { HistoriqueEquipeComponent } from './components/historique-equipe/historique-equipe.component';
import { HistoriqueEquipeResolver } from './components/historique-equipe/historique-equipe.resolver';
import { EquipeEditionComponent } from './components/equipe-edition/equipe-edition.component';
import { MatchesSaisieComponent } from './components/matches-saisie/matches-saisie.component';
import { ResultatSaisieComponent } from './components/resultat-saisie/resultat-saisie.component';
import { CarteClubsComponent } from './components/carte-clubs/carte-clubs.component';
import { DureeSaisieParamResolver } from './components/matches-saisie/dureesaisieparam.resolver';
import { CoupesEquipeComponent } from './components/coupes-equipe/coupes-equipe.component';
import { HierarchiesEquipeResolver } from './components/coupes-equipe/hierarchies-equipe.resolver';
import { CoupeUserComponent } from './components/coupe-user/coupe-user.component';
import { SanctionEquipeComponent } from './components/sanction-equipe/sanction-equipe.component';
import { SanctionsComponent } from './components/sanctions/sanctions.component';
import { SanctionBaremeComponent } from './components/sanction-bareme/sanction-bareme.component';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ChampionnatsComponent,
    ClassementComponent,
    MatchesComponent,
    MatchesChampionnatComponent,
    ClassementChampionnatComponent,
    ClassementEquipeComponent,
    EquipeComponent,
    MatchesEquipeComponent,
    HistoriqueEquipeComponent,
    EquipeEditionComponent,
    MatchesSaisieComponent,
    ResultatSaisieComponent,
    CarteClubsComponent,
    CoupesEquipeComponent,
    CoupeUserComponent,
    SanctionEquipeComponent,
    SanctionsComponent,
    SanctionBaremeComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
	FormsModule,
	CommunModule
  ],
  providers: [
	ClassementEquipeResolver,
	MatchesEquipeResolver,
	HistoriqueEquipeResolver,
	DureeSaisieParamResolver,
	HierarchiesEquipeResolver,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
	  ResultatSaisieComponent,
  ]
})
export class AppModule { }
