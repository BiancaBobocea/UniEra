import { Injectable } from '@angular/core';
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { UserDataService } from '../user-data/user-data.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  
  constructor(private userDataService: UserDataService) { }

  createNewUser(userDetails: any) {
    const auth = getAuth();
    const originalUser = auth.currentUser;
    createUserWithEmailAndPassword(auth, userDetails.email, userDetails.cnp)
      .then(async (userCredential) => {
        // Signed up 
        const user = userCredential.user;
        await this.userDataService.saveUserData(userDetails, user);
        await auth.updateCurrentUser(originalUser);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
