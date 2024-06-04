import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { Observable, map } from 'rxjs';
import { StateManagerService } from '../services/state-manager.service';

@Injectable({
    providedIn: 'root'
})
export class AdminGuard implements CanActivate {

    constructor(private router: Router, private stateManagerService: StateManagerService) {}

    canActivate(): Observable<boolean> {
        
        // Get the user from the state manager
        const userDetails$ = this.stateManagerService.userDetails$;

        // Check if the user is an admin
        return userDetails$.pipe(
            map((userDetails) => {
                if (userDetails && userDetails['role'] === 'admin') {
                    this.router.navigate(['/welcome-admin']);
                    return true;
                } else {
                    return true;
                }
            })
        );
    }
}