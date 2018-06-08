import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChampionnatsComponent } from './components/championnats/championnats.component';
import { ChampCreationComponent } from './components/champ-creation/champ-creation.component';

const routes: Routes = [
    { path: 'championnats', component: ChampionnatsComponent },
    { path: 'champ-creation', component: ChampCreationComponent }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
