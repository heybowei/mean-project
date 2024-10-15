import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { AuthService } from "./auth.service";
import { Observable } from "rxjs";


@Injectable()
export class AuthInterceptor implements HttpInterceptor{
    constructor(private authServive: AuthService) {}

    intercept(req: HttpRequest<any>, next: HttpHandler){
        const authToken = this.authServive.getToken();
        const authRequest = req.clone({
            headers: req.headers.set("auth", "token " + authToken)
        });
        return next.handle(authRequest);
    }
}