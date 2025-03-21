import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class I18nService {

  constructor(private translate: TranslateService) {
    const savedLang = localStorage.getItem('language') || 'es';
    translate.setDefaultLang(savedLang); // Idioma por defecto
   }

  changeLanguage(lang: string) {
    this.translate.use(lang);
    localStorage.setItem('language', lang);
  }
}
