import { Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { first, map } from 'rxjs/operators';

import { AuthenticationsService } from '../../services/authentications.service';
import { Authentication } from 'src/app/contracts/authentication';

@Injectable({
    providedIn: "root"
})
export class RouteAccessGuard implements CanActivate {
    constructor(private router: Router, private authenticationsService: AuthenticationsService) { }

    canActivate(
        route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.authenticationsService.authentications$.pipe(
            first(),
            map((authentication: Authentication) => {
                if(authentication.credentials[route.routeConfig.data.credentials][route.routeConfig.data.function]) {
                    return true;
                }
                this.router.navigate(['/login']);
                return false;
            }));
    }

}
