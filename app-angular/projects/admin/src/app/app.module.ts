import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './/app-routing.module';
import { MainMenuComponent } from './components/main-menu/main-menu.component';
import { ChampionnatsComponent } from './components/championnats/championnats.component';
import { HttpClientModule } from '@angular/common/http';
import { ChampCreationComponent } from './components/champ-creation/champ-creation.component';
import { FormsModule } from '@angular/forms';
import { JourneesChampComponent } from './components/journees-champ/journees-champ.component';
import { ClassementComponent } from './components/classement/classement.component';
import { MatchesComponent } from './components/matches/matches.component';
import { ChampImportComponent } from './components/champ-import/champ-import.component';
import { JourneesChampResolver } from './components/journees-champ/journees-champ.resolver';
import { MatchAvaliderComponent } from './components/match-avalider/match-avalider.component';
import { MatchJourneeComponent } from './components/match-journee/match-journee.component';
import { EquipesComponent } from './components/equipes/equipes.component';
import { CalendrierComponent } from './components/calendrier/calendrier.component';
import { FairplayEditorComponent } from './components/fairplay-editor/fairplay-editor.component';
import { FpformsResolver } from './components/fairplay-editor/fairplay-forms.resolver';
import { FpformsResumeResolver } from './components/champ-creation/fairplay-forms-resume.resolver';
import { ChampCaracteristiquesComponent } from './components/champ-caracteristiques/champ-caracteristiques.component';
import { ChampModeleComponent } from './components/champ-modele/champ-modele.component';
import { ChampModeleResolver } from './utils/champ-modele.resolver';
import { ParametresComponent } from './components/parametres/parametres.component';
import { ParametresResolver } from './components/parametres/parametres.resolver';
import { EquipeComponent } from './components/equipe/equipe.component';
import { FairplayClassementComponent } from './components/fairplay-classement/fairplay-classement.component';
import { CalendrierDoublonsComponent } from './components/calendrier-doublons/calendrier-doublons.component';
import { FairplayEquipeComponent } from './components/fairplay-equipe/fairplay-equipe.component';
import { FairplayEquipeResolver } from './components/fairplay-equipe/fairplay-equipe.resolver';
import { CommunModule } from 'projects/commun/src/app/commun.module';
import { FpClassementResolver } from './components/fairplay-classement/fairplay-classement.resolver';
import { CoupeAdminComponent } from './components/coupe-admin/coupe-admin.component';
import { SanctionBaremeEditorComponent } from './components/sanction-bareme-editor/sanction-bareme-editor.component';
import { SanctionsComponent } from './components/sanctions/sanctions.component';
import { SanctionCreationComponent } from './components/sanction-creation/sanction-creation.component';
import { SanctionEquipeComponent } from './components/sanction-equipe/sanction-equipe.component';
import { ChampCreationRenommageComponent } from './components/champ-creation-renommage/champ-creation-renommage.component';


@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ChampionnatsComponent,
    ChampCreationComponent,
    JourneesChampComponent,
    ClassementComponent,
    MatchesComponent,
    ChampImportComponent,
    MatchAvaliderComponent,
    MatchJourneeComponent,
    EquipesComponent,
    CalendrierComponent,
    FairplayEditorComponent,
    ChampCaracteristiquesComponent,
    ChampModeleComponent,
    ParametresComponent,
    EquipeComponent,
    FairplayClassementComponent,
    CalendrierDoublonsComponent,
    FairplayEquipeComponent,
    CoupeAdminComponent,
    SanctionBaremeEditorComponent,
    SanctionsComponent,
    SanctionCreationComponent,
    SanctionEquipeComponent,
    ChampCreationRenommageComponent,
  ],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
	FormsModule,
	CommunModule,
  ],
  providers: [
	  JourneesChampResolver,
	  FpformsResolver,
	  FpformsResumeResolver,
	  ChampModeleResolver,
	  ParametresResolver,
	  FairplayEquipeResolver,
	  FpClassementResolver,
  ],
  bootstrap: [AppComponent],
  entryComponents: [
	  ChampImportComponent,
	  SanctionCreationComponent,
	  ChampCreationRenommageComponent,
  ]
})																																																																																																																																																																																														
export class AppModule { }
