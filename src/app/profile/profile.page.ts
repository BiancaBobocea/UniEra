import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginService } from '../services/login/login.service';
import { StateManagerService } from '../services/state-manager.service';
import { addIcons } from 'ionicons';
import { camera, arrowForward } from 'ionicons/icons';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule
  ],
})
export class ProfilePage implements OnInit {
  userDetails$ = this.stateManagerService.userDetails$;
  constructor(
    private readonly loginService: LoginService,
    private readonly stateManagerService: StateManagerService
  ) {}

  ngOnInit() {
    addIcons({camera, arrowForward})
  }

  logout() {
    this.loginService.signOutUser();
  }
}
