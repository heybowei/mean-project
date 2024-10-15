import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";


@Component({
    templateUrl: "./login.component.html",
    styleUrls : ["./login.component.css"]
})
export class LoginComponent{
    isLoading = false;

    constructor(private authService: AuthService) {}
    onLogin(loginForm: NgForm){
        if(loginForm.invalid)
            return;
        this.authService.login(loginForm.value.email, loginForm.value.password);
    }
}