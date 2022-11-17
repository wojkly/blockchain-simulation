import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  BLOCKCHAIN_PATH,
  INITIAL_CONFIGURATION_PATH,
  MINERS_PATH,
  NETWORK_PATH, PARAMETERS_PATH,
  SIMULATION_PATH
} from "./app-routing-paths";
import {InitialConfigurationComponent} from "./initial-configuration/initial-configuration.component";
import {SimulationComponent} from "./simulation/simulation.component";
import {NetworkComponent} from "./simulation/network/network.component";
import {MinersComponent} from "./simulation/miners/miners.component";
import {ParametersComponent} from "./simulation/parameters/parameters.component";
import { BlockchainComponent } from './simulation/blockchain/blockchain.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: INITIAL_CONFIGURATION_PATH,
    pathMatch: 'full',
  },
  {
    path: INITIAL_CONFIGURATION_PATH,
    component: InitialConfigurationComponent
  },
  {
    path: SIMULATION_PATH,
    component: SimulationComponent,
    children: [
      {
        path: '',
        redirectTo: NETWORK_PATH,
        pathMatch: 'full'
      },
      {
        path: NETWORK_PATH,
        component: NetworkComponent
      },
      {
        path: MINERS_PATH,
        component: MinersComponent
      },
      {
        path: PARAMETERS_PATH,
        component: ParametersComponent
      },
      {
        path: BLOCKCHAIN_PATH,
        component: BlockchainComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
