import {Component, OnDestroy, OnInit} from "@angular/core";
import { AuthService } from "../auth/auth.service";
import { Subscription } from "rxjs";


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy{
    userIsAuthed = false;
    private authListenerSubs: Subscription = new Subscription;
    email = "";

    constructor(private authService: AuthService) {}

    ngOnInit(): void {
        this.email = this.authService.email;
        console.log("email");
        console.log(this.email);
        this.userIsAuthed = this.authService.getIsAuth();
        this.authListenerSubs = this.authService.getAuthStatus().subscribe( isAuth =>{
            this.userIsAuthed = isAuth;
            this.email = this.authService.email;
        });
    }

    logout(){
        //console.log("log out");
        this.authService.logout();
        this.email = "";
    }

    ngOnDestroy(): void {
        this.authListenerSubs.unsubscribe();
    }
}