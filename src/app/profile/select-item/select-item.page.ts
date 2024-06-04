import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { LoginService } from 'src/app/services/login/login.service';
import { RouterModule } from '@angular/router';
import { StateManagerService } from 'src/app/services/state-manager.service';

@Component({
  selector: 'app-select-item',
  templateUrl: './select-item.page.html',
  styleUrls: ['./select-item.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule, RouterModule]
})
export class SelectItemPage implements OnInit {
  userDetails$ = this.stateManagerService.userDetails$;
  constructor(private readonly loginService: LoginService, private readonly stateManagerService: StateManagerService) { }

  ngOnInit() {
  }

  logout() {
    this.loginService.signOutUser();
  }
}
