import { Post } from './post.model';
import { Injectable } from "@angular/core";
import { Subject } from 'rxjs';
import { map } from'rxjs';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";

@Injectable({providedIn: 'root'})
export class PostsService{
    private posts: Post[] = [];
    private postsUpdate = new Subject<Post[]>();
    constructor(private http: HttpClient, private router: Router){}

    getPosts(){
        this.http.get<{message: string, posts: any}>("http://localhost:3000/api/posts")
         .pipe(map((postData) =>{
            return postData.posts.map((post: any) =>{
                return {
                    title: post.title,
                    content: post.content,
                    id: post._id,
                    filePath: post.filePath
                };
            });
         })).subscribe((inipost)=>{
            this.posts = inipost;
            this.postsUpdate.next([...this.posts]);
        });
    }

    getPost(postId: string){
        return this.http.get<{title: string, content: string, filePath: string}>("http://localhost:3000/api/posts/" + postId);
        //return {...this.posts.find(p => p.id === postId)};
    }


    getPostUpdateListener(){
        return this.postsUpdate.asObservable();
    }

    addPosts(title: string, content: string, image: File){
        //const post: Post = { id: '', title: title, content: content, filePath: ''};
        const postData = new FormData();
        postData.append("title", title);
        postData.append("content", content);
        postData.append("image", image, title);
        this.http.post<{message: string, post: Post}>("http://localhost:3000/api/posts", postData)
         .subscribe((response) =>{
            const receivedPost: Post = {
                id: response.post.id,
                title: response.post.title,
                content: response.post.content,
                filePath: response.post.filePath
            };
            //= response.post;
            this.posts.push(receivedPost);
            this.postsUpdate.next([...this.posts]);
            this.router.navigate(["/"]);
         })
    }

    updatePost(Id:string, title: string, content: string, file: any){
        let postData;
        if(typeof(file) === 'object'){
            postData = new FormData();
            postData.append("title", title);
            postData.append("content", content);
            postData.append("id", Id);
            postData.append("image", file, title);
        } else {
            postData = {
                id: Id,
                title: title,
                content: content,
                filePath: file
            }; 
        }
        this.http.put("http://localhost:3000/api/posts/" + Id, postData)
         .subscribe((response) =>{
            const updatedPosts = [...this.posts];
            const updatedIndex = updatedPosts.findIndex(p => p.id === Id);
            const post: Post = {
                id: Id,
                title: title,
                content: content,
                filePath: '' // response.post.filePath
            };
            updatedPosts[updatedIndex] = post;
            this.posts = updatedPosts;
            this.postsUpdate.next([...this.posts]);
            this.router.navigate(["/"]);
         });
    }

    deletePost(postId: string){
        this.http.delete("http://localhost:3000/api/posts/" + postId)
         .subscribe(() => {
            const updatedPosts = this.posts.filter(post => post.id !== postId );
            this.posts = updatedPosts;
            this.postsUpdate.next([...this.posts]);
         })
    }
}