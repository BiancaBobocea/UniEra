import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { addCircleOutline } from 'ionicons/icons';
import { RouterModule } from '@angular/router';
import { UserDataService } from '../services/user-data/user-data.service';
import { StateManagerService } from '../services/state-manager.service';

@Component({
  selector: 'app-welcome-admin',
  templateUrl: './welcome-admin.page.html',
  styleUrls: ['./welcome-admin.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class WelcomeAdminPage implements OnInit {

  userDetails$ = this.stateManagerService.userDetails$;
  leftSideMenuItems = [
    {
      label: 'Adaugă Student',
      routerLink: '/add-student',
    },
    {
      label: 'Adaugă Profesor',
      routerLink: '/add-teacher',
    },
    {
    label: 'Adaugă Cursuri',
      routerLink: '/add-classes',
    },
  ];
  
  rightSideMenuItems = [
    {
      label: 'Adaugă/Modifică Orar',
      routerLink: '/add-timetable',
    },
    {
      label: 'Modifică Date Utilizatori',
      routerLink: '/change-student-data',
    },
  ];

  constructor(private readonly stateManagerService: StateManagerService) { }

  ngOnInit() {
    addIcons({ addCircleOutline });
  }
}
