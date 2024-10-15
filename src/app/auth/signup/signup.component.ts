import { Component } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService } from "../auth.service";


@Component({
    templateUrl: "./signup.component.html",
    styleUrls : ["./signup.component.css"]
})
export class SignupComponent{
    isLoading = false;
    
    constructor(private authService: AuthService){}
    
    onSignup(signupForm: NgForm){
        if(signupForm.invalid)
            return;
        const email = signupForm.value.email;
        const password = signupForm.value.password;
        this.authService.addUser(email, password);
    }
}