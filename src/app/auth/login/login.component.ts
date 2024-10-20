import { Component, OnDestroy, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";
import { Subscription } from "rxjs";


@Component({
    templateUrl: "./login.component.html",
    styleUrls : ["./login.component.css"]
})
export class LoginComponent implements OnInit, OnDestroy{
    isLoading = false;
    authStatusSub = new Subscription();
    constructor(private authService: AuthService) {}


    ngOnInit(): void {
        this.authStatusSub = this.authService.authStatusListener.subscribe();
    }
    onLogin(loginForm: NgForm){
        if(loginForm.invalid)
            return;
        this.authService.login(loginForm.value.email, loginForm.value.password);
    }

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }
}