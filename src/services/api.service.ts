import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, tap, map } from 'rxjs/operators';
import { Usuario } from 'src/model/usuario';
import { Categoria } from 'src/model/categoria';

const apiUrl = 'https://localhost:5001/api/categorias';
const apiLoginUrl = 'https://localhost:5001/api/autoriza/login';
var token = localStorage.getItem("jwt");
var httpOptions = { headers: new HttpHeaders({ "Contect-Type": "application/json" })};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) { }

  montaHeaderToken(){
    // token = localStorage.getItem("jwt");
    console.log('jwt header token ' + token);
    httpOptions = {headers: new HttpHeaders({"Authorization": "Bearer " + token, "Content-Type": "application/json"})};
  }

  Login (Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(apiLoginUrl, Usuario).pipe(
      tap((Usuario: Usuario) => console.log(`Login usuário com email =${Usuario.email}`)),
      catchError(this.handleError<Usuario>('Login'))
    );
  }
  
  getCategorias (): Observable<Categoria[]>{
    this.montaHeaderToken();
    console.log(httpOptions.headers);
    return this.http.get<Categoria[]>(apiUrl, httpOptions).pipe(
      tap(Categorias => console.log('leu as Categorias')),
      catchError(this.handleError('getCategorias', []))
    );
  }

  getCategoria(id:number): Observable<Categoria> {
    const url = `${apiUrl}/${id}`;
    return this.http.get<Categoria>(url, httpOptions).pipe(
      tap(_ => console.log(`leu a Categoria id=${id}`)),
      catchError(this.handleError<Categoria>(`getCategoria id=${id}`))
    );
  }

  addCategoria (Categoria): Observable<Categoria> {
    this.montaHeaderToken();
    return this.http.post<Categoria>(apiUrl, Categoria, httpOptions).pipe(
      tap((Categoria: Categoria) => console.log(`adicionou a Categoria com w/ id=${Categoria}`)),
      catchError(this.handleError<Categoria>('addCategoria'))
    );
  }

  updateCategoria(id, Categoria): Observable<any> {
    const url = `${apiUrl}/${id}`;
    return this.http.put(url, Categoria, httpOptions).pipe(
      tap(_ => console.log(`atualiza o produto com id=${id}`)),
      catchError(this.handleError<any>('updateCategoria'))
    );
  }

  deleteCategoria (id): Observable<Categoria> {
    const url = `${apiUrl}/${id}`;
    return this.http.delete<Categoria>(url, httpOptions).pipe(
      tap(_ => console.log(`remove a Categoria com id=${id}`)),
      catchError(this.handleError<Categoria>('deleteCategoria'))
    );
  }

  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error);
      return of(result as T);
    }
  }
}
