import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InitialConfigurationComponent } from './initial-configuration/initial-configuration.component';
import { SimulationComponent } from './simulation/simulation.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatTabsModule} from "@angular/material/tabs";
import {FlexLayoutModule, FlexModule} from "@angular/flex-layout";
import {MatTableModule} from "@angular/material/table";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {MatButtonToggleModule} from "@angular/material/button-toggle";
import {MatInputModule} from "@angular/material/input";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatSliderModule} from "@angular/material/slider";
import {MatCardModule} from "@angular/material/card";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSortModule} from '@angular/material/sort';
import {MatDialogModule} from '@angular/material/dialog';
import { NetworkComponent } from './simulation/network/network.component';
import { ButtonsComponent } from './simulation/buttons/buttons.component';
import { MinersComponent } from './simulation/miners/miners.component';
import { ParametersComponent } from './simulation/parameters/parameters.component';
import { BlockchainComponent } from './simulation/blockchain/blockchain.component';
import { InitConfigDialogComponent } from './initial-configuration/init-config-dialog/init-config-dialog.component';
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";
import { EditMinerComponent } from './simulation/miners/edit-miner/edit-miner.component';
import { AddMinerComponent } from './simulation/miners/add-miner/add-miner.component';
import { SimulationTimerComponent } from './simulation/simulation-timer/simulation-timer.component';
import { SimulationTimerPipe } from './utils/pipes/simulation-timer.pipe';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    InitialConfigurationComponent,
    SimulationComponent,
    NetworkComponent,
    ButtonsComponent,
    MinersComponent,
    ParametersComponent,
    BlockchainComponent,
    InitConfigDialogComponent,
    EditMinerComponent,
    AddMinerComponent,
    SimulationTimerComponent,
    SimulationTimerPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    FlexModule,
    FlexLayoutModule,
    MatTableModule,
    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatSliderModule,
    MatCardModule,
    MatSnackBarModule,
    MatButtonToggleModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatSelectModule,
    MatTooltipModule,
    CommonModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
