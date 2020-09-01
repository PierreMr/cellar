import { Component, OnInit } from "@angular/core";
import * as firebase from "firebase";
import { UserService } from "./../services/user.service";
import { Storage } from "@ionic/storage";

@Component({
  selector: "app-login",
  templateUrl: "./login.page.html",
  styleUrls: ["./login.page.scss"],
})
export class LoginPage implements OnInit {
  constructor(private userSrvc: UserService, private storage: Storage) {}

  ngOnInit() {
    firebase.auth().languageCode = "fr";
  }

  signInGoogle() {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        // let token = result.credential.accessToken;
        // let userFB = result.user;

        firebase
          .firestore()
          .collection("users")
          .doc(result.user.uid)
          .get()
          .then((user) => {
            this.storage.set("user", result.user);
            if (user.exists) {
              this.userSrvc.user = user;
              this.userSrvc.userFB = result.user;
            } else {
              firebase
                .firestore()
                .collection("users")
                .doc(result.user.uid)
                .set({
                  name: result.user.displayName,
                  displayName: result.user.displayName,
                  email: result.user.email,
                  createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                });
            }
          });
      })
      .catch(function (error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        // The email of the user's account used.
        var email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        var credential = error.credential;
        // ...
      });
  }
}
