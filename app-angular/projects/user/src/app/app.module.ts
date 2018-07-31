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
    EquipeComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
	FormsModule,
	CommunModule
  ],
  providers: [
	ClassementEquipeResolver
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
