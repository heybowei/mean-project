import { Post } from './post.model';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { map } from'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
@Injectable({providedIn: 'root'})
export class PostsService{
    private posts: Post[] = [];
    private postsUpdate = new Subject<Post[]>();
    constructor(private http: HttpClient){}

    getPosts(){
        this.http.get<{message: string, posts: any}>("http://localhost:3000/api/posts")
         .pipe(map((postData) =>{
            return postData.posts.map((post: { title: string; content: string; _id: string; }) =>{
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id
                };
            });
         }))
         .subscribe((inipost)=>{
            this.posts = inipost;
            this.postsUpdate.next([...this.posts]);
        });
    }

    getPost(postId: string){
        return {...this.posts.find(p => p.id === postId)};
    }


    getPostUpdateListener(){
        return this.postsUpdate.asObservable();
    }

    addPosts(title: string, content: string){
        const post: Post = { id: '', title: title, content: content};
        this.http.post<{message: string, createdId: string}>("http://localhost:3000/api/posts", post)
         .subscribe((response) =>{
            console.log(response);
            const id = response.createdId;
            post.id = id;
            this.posts.push(post);
            this.postsUpdate.next([...this.posts]);
         })
    }

    updatePost(Id:string, title: string, content: string){
        const post: Post = {
            id: Id,
            title: title,
            content: content
        };
        console.log(post);
        this.http.put("http://localhost:3000/api/posts/" + Id, post)
         .subscribe((message) =>{
            console.log(message);
         });
    }

    deletePost(postId: string){
        console.log(postId);
        this.http.delete("http://localhost:3000/api/posts/" + postId)
         .subscribe(() => {
            console.log("Deleted!");
            const updatedPosts = this.posts.filter(post => post.id !== postId );
            this.posts = updatedPosts;
            this.postsUpdate.next([...this.posts]);
         })
    }
}