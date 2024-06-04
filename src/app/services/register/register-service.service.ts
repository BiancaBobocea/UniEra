import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { UserDataService } from '../user-data/user-data.service';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  
  constructor(private userDataService: UserDataService) { }

  createNewUser(userDetails: any) {
    const auth = getAuth();
    createUserWithEmailAndPassword(auth, userDetails.email, userDetails.cnp)
      .then((userCredential) => {
        // Signed up 
        const user = userCredential.user;
        this.userDataService.saveUserData(userDetails, user);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
