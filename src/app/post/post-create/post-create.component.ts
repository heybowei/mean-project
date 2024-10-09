import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators }   from '@angular/forms';
import { PostsService } from "../posts.service";
import { ActivatedRoute, ParamMap, RouterModule } from "@angular/router";
import { Post } from "../post.model";

@Component({
    selector: 'app-post-create',
    templateUrl: './post-create.component.html',
    styleUrl: './post-create.component.css'
})
export class PostCreateComponent implements OnInit{
    constructor(public postsService: PostsService, public routeModule: ActivatedRoute ){}

    post: Post = {id: '', title: '', content: ''};
    isLoading = false;
    form = new FormGroup({
        title: new FormControl('', {validators: [Validators.required, Validators.minLength(3)]}),
        content: new FormControl('', {validators: [Validators.required]}),
        image: new FormControl<File|null>(null)
    });
    imagepreview = '';
    
    private postId = '';
    private mode = 'create';
    private title = '';
    private content = '';
    
    

    ngOnInit(): void {
        //this.test = 'hey';
        this.routeModule.paramMap.subscribe((paramMap: ParamMap)=>{
            if(paramMap.has('postId')){
                this.mode = 'edit';
                this.postId = paramMap.get('postId') ?? '';
                this.postsService.getPost(this.postId)
                 .subscribe(postData => {
                    this.title = postData.title;
                    this.content = postData.content;
                    console.log(this.title);
                    this.post = {
                        id: this.postId, title: this.title, content: this.content
                    }
                    this.form.patchValue({
                        title: this.post.title, content: this.post.content
                    });
                 });
                //this.title = this.postsService.getPost(this.postId).title ?? '';
                //this.content = this.postsService.getPost(this.postId).content ?? '';
                
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
            this.postsService.addPosts((this.form.value.title as string), (this.form.value.content as string));
        } else {
            this.postsService.updatePost(this.postId, (this.form.value.title as string), (this.form.value.content as string));
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
                console.log(pic);
                const reader = new FileReader();
                reader.onload = () => {
                    this.imagepreview = reader.result as string;
                };
                reader.readAsDataURL(pic);
            }
        }
        console.log(this.form);
    }
}