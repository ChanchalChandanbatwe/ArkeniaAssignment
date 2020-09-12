import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpHeaders } from "@angular/common/http";

import {  throwError, Observable, BehaviorSubject } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Recipe, RecipeResponse } from '../model/recipe';


@Injectable({
  providedIn: 'root'
})
export class RecipesService {

  private apiServer = "http://localhost:3000/api";
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  recipeList: BehaviorSubject<any> = new BehaviorSubject<any>([]);

  constructor(private httpClient: HttpClient) { }


  create(recipe): Observable<Recipe> {
    return this.httpClient.post<Recipe>(this.apiServer + '/recipes/', JSON.stringify(recipe), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }
  getById(id): Observable<Recipe> {
    return this.httpClient.get<Recipe>(this.apiServer + '/recipes/' + id)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  getAll() {
    this.httpClient.get<RecipeResponse[]>(this.apiServer + '/recipes/')
    .subscribe((data)=>{
      console.log(data);
      if(data['message']==='success')
        this.recipeList.next(data['recipes']);
    })

  }

  update(recipe): Observable<Recipe> {
    return this.httpClient.put<Recipe>(this.apiServer + '/recipes/', JSON.stringify(recipe), this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }

  delete(recipe){
    return this.httpClient.delete<Recipe>(this.apiServer + '/recipes/' + recipe['_id'] + '/' + recipe['imageName'], this.httpOptions)
    .pipe(
      catchError(this.errorHandler)
    )
  }


  uploadImage(body): Observable<any> {
    let httpOptions: any;
    const headers = new HttpHeaders();
    headers.append('Accept', 'application/json');
    headers.append('enctype', 'multipart/form-data');
    httpOptions = {
      headers: headers,
    };
    //  this.headers.append('Content-Type','application/x-www-form-urlencoded');
    return this.httpClient.post<any>(this.apiServer + '/recipes/imageUpload/', body, httpOptions);
  }

  errorHandler(error) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     console.log(errorMessage);
     return throwError(errorMessage);
  }


  checkRecipeNameNotTaken(name: string, recipeId: string) {
    return this.httpClient.post(this.apiServer + '/recipes/checkRecipeNameNotTaken', {
      name,
      recipeId
    });
  }

}
