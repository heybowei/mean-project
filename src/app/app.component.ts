import { Component, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';

interface Post {
  title: string;
  content: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})

export class AppComponent implements OnInit {
  constructor(private authService : AuthService){}

  ngOnInit(): void {
    this.authService.autoAuth();
  }
  
}
