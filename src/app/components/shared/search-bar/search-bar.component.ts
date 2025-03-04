import { Component, EventEmitter, Input, Output } from '@angular/core';

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
