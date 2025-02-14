import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { UserAuthService } from "../services/user-auth.service";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root', 
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private userAuthService: UserAuthService,
        private router: Router,
        private toasrService: ToastrService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        // No añadir token si la cabecera No-Auth está presente
        if (req.headers.get("No-Auth") === 'True') {
            return next.handle(req);
        }

        // Obtener el token
        const token = this.userAuthService.getToken();

        // Clonar la solicitud y agregar el token
        const clonedRequest = this.addToken(req, token);

        // Continuar con la solicitud clonada
        return next.handle(clonedRequest).pipe(
            catchError((err: HttpErrorResponse) => {
                console.log(err.status);
                console.error("HTTP Error:", err);
                if (err.status === 401) {
                    this.toasrService.error("Tu sesión ha expirado. Inicia sesión nuevamente.", "Sesión Expirada");
                    this.router.navigate(['/login']);
                }              
                
                else if (err.status === 403) {
                    this.router.navigate(['/forbidden']);
                }
                return throwError(() => new Error("Something went wrong"));
            })
        );
    }

    private addToken(request: HttpRequest<any>, token: string) {
        return request.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
}
