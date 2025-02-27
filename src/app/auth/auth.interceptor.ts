import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { UserAuthService } from "../services/user-auth.service";
import { Router } from "@angular/router";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";
import {jwtDecode} from "jwt-decode";

@Injectable({
    providedIn: 'root', 
})
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private userAuthService: UserAuthService,
        private router: Router,
        private toastrService: ToastrService
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        // No añadir token si la cabecera No-Auth está presente
        if (req.headers.get("No-Auth") === 'True') {
            return next.handle(req);
        }

        // Obtener el token
        const token = this.userAuthService.getToken();

        // Comprobar si el token está expirado
        if (token && this.isTokenExpired(token)) {
            this.toastrService.error("Session expired, log in again", "Session expired");
            this.userAuthService.clear();
            this.router.navigate(['/login']);
        }

        // Clonar la solicitud y agregar el token
        const clonedRequest = this.addToken(req, token);

        return next.handle(clonedRequest).pipe(
            catchError((err: HttpErrorResponse) => {
                if (err.status === 401) {
                    this.toastrService.error("Tu sesión ha expirado. Inicia sesión nuevamente.", "Sesión Expirada");
                    this.router.navigate(['/login']);
                }              
                
                else if (err.status === 403) {
                    if (!this.isTokenExpired) {
                        this.router.navigate(['/forbidden']);
                    } else {
                        this.router.navigate(['/login']);
                    }
                }
                    
                else if (err.status === 400) {
                    return throwError(() => err); 
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

    // Función para comprobar si el token ha expirado
    private isTokenExpired(token: string): boolean {
        try {
            const decoded: any = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000); // Tiempo actual en segundos
            return decoded.exp < currentTime;
        } catch (error) {
            return true; // Si hay error al decodificar, asumimos que está expirado
        }
    }
}
