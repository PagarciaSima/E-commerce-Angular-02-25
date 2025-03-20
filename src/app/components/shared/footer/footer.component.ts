import { Component } from '@angular/core';

/**
 * 
 * This component is responsible for rendering the footer section of the application. 
 * It dynamically updates the displayed year to always reflect the current year.
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent {
  currentYear: number = new Date().getFullYear();

}
