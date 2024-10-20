import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators }   from '@angular/forms';
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap, RouterModule } from "@angular/router";
import { Post } from "../post.model";
import { mimetype } from "./mime-type.validator";
import { Subscription } from "rxjs";
import { AuthService } from "../../auth/auth.service";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrl: './post-create.component.css'
})
export class PostCreateComponent implements OnInit, OnDestroy{
    constructor(public postsService: PostsService, public routeModule: ActivatedRoute , public authService : AuthService){}

    post: Post = {id: '', title: '', content: '', filePath: '', creator: ''};
    isLoading = false;
    form = new FormGroup({
        title: new FormControl('', {validators: [Validators.required, Validators.minLength(3)]}),
        content: new FormControl('', {validators: [Validators.required]}),
        image: new FormControl<string|File|null>(null, {validators: [Validators.required], asyncValidators: [mimetype]})
    });
    imagepreview = '';
    private authStatusSub = new Subscription();
    private postId = '';
    private mode = 'create';
    private title = '';
    private content = '';
    
    

    ngOnInit(): void {
        //this.test = 'hey';
        this.authStatusSub = this.authService.authStatusListener.subscribe(authStatus => {
            this.isLoading = false;
        });
        this.routeModule.paramMap.subscribe((paramMap: ParamMap)=>{
            if(paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId') ?? '';
                this.postsService.getPost(this.postId)
                 .subscribe(postData => {
                    this.title = postData.title;
                    this.content = postData.content;
                    this.post = {
                        id: this.postId, title: this.title, content: this.content, filePath: postData.filePath, creator: postData.creator
                    };
                    this.form.patchValue({
                        title: this.post.title, content: this.post.content, image: this.post.filePath
                    });
                    console.log(this.form.value);
                 });
                
            } else{
                this.mode = 'create';
                this.postId = '';
            }
        });
    }

    onSavePost(){
        this.isLoading = true;
        if(this.form.invalid){
            return;
        }
        if(this.mode === 'create'){
            this.postsService.addPosts((this.form.value.title as string), (this.form.value.content as string), (this.form.value.image as File));
        } else {
            this.postsService.updatePost(this.postId, (this.form.value.title as string), (this.form.value.content as string), this.form.value.image);
        }
        this.form.reset();
    }

    onImagePicked(event: Event){
        const fileslist = (event.target as HTMLInputElement).files;
        if(fileslist && fileslist.length && fileslist.length > 0){
            const pic:File = fileslist[0];
            if(pic){
                this.form.patchValue({image: pic});
                this.form.get('image')?.updateValueAndValidity;
                const reader = new FileReader();
                reader.onload = () => {
                    this.imagepreview = reader.result as string;
                };
                reader.readAsDataURL(pic);
            }
        }
    }

    ngOnDestroy(): void {
        this.authStatusSub.unsubscribe();
    }
}