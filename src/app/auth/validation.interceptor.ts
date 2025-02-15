import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { Injectable } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Injectable({
    providedIn: 'root',
})
export class ValidationInterceptor implements HttpInterceptor {

    constructor(private toastrService: ToastrService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError((err: HttpErrorResponse) => {
                // Solo manejamos errores de validación
                if (err.status === 400 && err.error) {
                    if (err.error["Validation-error"] === "Discount") {
                        // Mostrar mensaje específico de validación de descuento
                        this.toastrService.warning(err.error.product, 'Validation error');
                    } 
                }
                return throwError(() => new Error("Error de validación"));
            })
        );
    }
}
