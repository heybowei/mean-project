import { AbstractControl } from "@angular/forms";
import { Observable, Observer } from "rxjs";

export const mimetype = (control : AbstractControl): 
Promise<{[key: string]: any}> | Observable<{[key: string]: any} | null> => {
    const file = control.value as File;
    const fileReader = new FileReader();
    const frObs = new Observable((observer: Observer<{[key: string]: any} | null>) => {
        fileReader.addEventListener("loadend", () =>{
            const arr = new Uint8Array(fileReader.result as ArrayBufferLike).subarray(0, 4);
            let header = '';
            let isValid = false;
            for(let i = 0; i < arr.length; i++){
                header += arr[i].toString(16);
            }
            console.log("filetype:")
            console.log(header)
            switch (header) {
                case "85904e47":
                    isValid = true;
                    break;
                case "ffd8ffe0":
                case "ffd8ffe1":
                case "ffd8ffe2":
                case "ffd8ffe3":
                case "ffd8ffe8":
                    isValid = true;
                    break;
                default:
                    isValid = false;
                    break;   
            }
            if(isValid){
                observer.next(null);
            } else{
                observer.next({ invalideMimeType: true});
            }
            observer.complete();
            
        });
        fileReader.readAsArrayBuffer(file);
        
    });
    return frObs;
};