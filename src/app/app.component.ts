import { Component } from '@angular/core';

interface Post {
  title: string;
  content: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mean_course';
  sharedPosts: Post[] = [];
  onPostAdded(post: Post){
    this.sharedPosts.push(post);
  }
}
