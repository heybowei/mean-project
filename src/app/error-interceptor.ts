import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { catchError, throwError } from "rxjs";
import { errorComponent } from "./error/error.component";

@Injectable()
export class errorInterceptor implements HttpInterceptor{

    constructor(public dialog: MatDialog){}
    intercept(req: HttpRequest<any>, next: HttpHandler){
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) =>{
                let errorMessage
                if(error.error.message){
                    errorMessage = error.error.message
                }
                this.dialog.open(errorComponent, {data: {message: errorMessage}});
                return throwError(error);
            })
        );
    }
}