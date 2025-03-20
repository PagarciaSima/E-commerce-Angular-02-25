import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * Search bar component for capturing user input and emitting search events.
 * 
 * This component allows users to input search queries and emits the search term
 * when the search action is triggered.
 */
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css']
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Search...';  // Permite personalizar el placeholder
  @Output() search = new EventEmitter<string>(); // Evento que emite el valor de búsqueda

  searchKey: string = '';

  onSearch(): void {
    this.search.emit(this.searchKey); 
  }
}
