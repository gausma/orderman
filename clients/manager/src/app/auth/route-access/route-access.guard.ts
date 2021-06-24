import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { first, map } from 'rxjs/operators';

import { LoginService } from '../../service/login.service';

@Injectable({
    providedIn: "root"
})
export class RouteAccessGuard implements CanActivate {
    constructor(private router: Router, private loginService: LoginService) { }

    canActivate(
        route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.loginService.credentials$.pipe(
            first(),
            map((credentials) => {
                if(credentials[route.routeConfig.data.credentials][route.routeConfig.data.function]) {
                    return true;
                }
                this.router.navigate(['/login']);
                return false;
            }));
    }

}
