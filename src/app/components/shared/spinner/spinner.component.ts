import { Component, Input } from '@angular/core';

/**
 * Represents a loading spinner component that can be used to indicate 
 * a loading state in the application.
 */
@Component({
  selector: 'app-spinner',
  templateUrl: './spinner.component.html',
  styleUrls: ['./spinner.component.css']
})
export class SpinnerComponent {
  
  /**
   * Determines whether the spinner should be displayed.
   * @default false
   */
  @Input() show: boolean = false;

  /**
   * The text message displayed alongside the spinner.
   * @default 'Processing file'
   */
  @Input() text: string = 'Processing file';
}
