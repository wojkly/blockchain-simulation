import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {INITIAL_CONFIGURIATION_PATH, SIMULATION_PATH} from "./app-routing-paths";
import {InitialConfigurationComponent} from "./initial-configuration/initial-configuration.component";
import {SimulationComponent} from "./simulation/simulation.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: INITIAL_CONFIGURIATION_PATH,
    pathMatch: 'full',
  },
  {
    path: INITIAL_CONFIGURIATION_PATH,
    component: InitialConfigurationComponent
  },
  {
    path: SIMULATION_PATH + "/:nodesCount",
    component: SimulationComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
