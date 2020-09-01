import { Injectable } from "@angular/core";
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from "@angular/router";
import { Observable } from "rxjs";
import { Storage } from "@ionic/storage";

@Injectable({
  providedIn: "root",
})
export class AuthGuard implements CanActivate {
  constructor(private storage: Storage, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return new Promise((resolve, reject) => {
      this.storage.ready().then(() => {
        this.storage.get("user").then((user) => {
          console.log(user);
          if (user) {
            resolve(true);
          } else {
            this.router.navigate(["/login"]);
            resolve(false);
          }
        });
      });
    });
  }
}
