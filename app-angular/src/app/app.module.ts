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
import { LoginComponent } from './components/login/login.component';
import { JourneesChampComponent } from './components/journees-champ/journees-champ.component';
import { ModalComponent } from './components/modal/modal.component';
import { ClassementComponent } from './components/classement/classement.component';
import { CoupeComponent } from './components/coupe/coupe.component';
import { MatchesComponent } from './components/matches/matches.component';
import { ChampMenuComponent } from './components/champ-menu/champ-menu.component';
import { StrJourneePipe } from './utils/str-journee.pipe';
import { SignePipe } from './utils/signe.pipe';
import { ChampImportComponent } from './components/champ-import/champ-import.component';
import { ChampionnatResolver } from './components/championnats/championnats.resolver';
import { ChampCreationResolver } from './components/champ-creation/champ-creation.resolver';
import { JourneesChampResolver } from './components/journees-champ/journees-champ.resolver';
import { ClassementResolver } from './components/classement/classement.resolver';

@NgModule({
  declarations: [
    AppComponent,
    MainMenuComponent,
    ChampionnatsComponent,
    ChampCreationComponent,
    LoginComponent,
    ModalComponent,
    JourneesChampComponent,
    ClassementComponent,
    CoupeComponent,
    MatchesComponent,
    ChampMenuComponent,
    StrJourneePipe,
    SignePipe,
    ChampImportComponent
  ],
  imports: [
    BrowserModule,
    NgbModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
	  ChampionnatResolver, 
	  ChampCreationResolver, 
	  JourneesChampResolver,
	  ClassementResolver
  ],
  bootstrap: [AppComponent],
  entryComponents: [
	  LoginComponent,
	  ModalComponent,
	  ChampImportComponent
  ]
})
export class AppModule { }
