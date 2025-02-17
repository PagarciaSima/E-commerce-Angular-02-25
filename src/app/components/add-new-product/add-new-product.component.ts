import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './add-new-product.component.html',
  styleUrls: ['./add-new-product.component.css'],

})
export class AddNewProductComponent {

  @ViewChild('imagePreviewSection') imagePreviewSection!: ElementRef;

  selectedFiles: File[] = [];
  imagePreviews: String[] = [];

  product: Product = {
    productName: '',
    productDescription: '',
    productDiscountedPrice: 0,
    productActualPrice: 0,
  }

  constructor(
    private productService: ProductService,
    private toastrService: ToastrService
  ) {

  }

  addProduct(productForm: NgForm) {
    if (this.product.productActualPrice < this.product.productDiscountedPrice) {
      this.toastrService.warning('Discounted price can not be greater than actual price.', 'Warning');
    } else {
      this.productService.addProduct(this.product, this.selectedFiles).subscribe({
        next: () => {
          this.toastrService.success('Product created successfully', 'Success');
          this.clearForm(productForm);
          this.selectedFiles = [];
          this.imagePreviews =[];
        } 
      });
    }
  }
  
  onDragOver(event: DragEvent): void {
    event.preventDefault();  // Previene el comportamiento por defecto de la acción de arrastrar
  }

  onDrop(event: DragEvent): void {
      event.preventDefault();  // Previene el comportamiento por defecto (como abrir el archivo)
      
      // Obtenemos los archivos desde dataTransfer
      const files = event.dataTransfer?.files;
      if (files?.length) {
          // Hacemos una aserción para que TypeScript sepa que target es el contenedor
          this.onFileSelected({ target: { files } } as any);
      }
  }


  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
  
    const files = Array.from(input.files);
  
    if (this.selectedFiles.length + files.length > 3) {
      this.toastrService.warning('You can only upload up to 3 images.', 'Warning');
      return;
    }
  
    // Añadir archivos seleccionados
    this.selectedFiles.push(...files);
  
    // Crear vistas previas de las imágenes
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreviews.push(e.target.result);
        setTimeout(() => this.scrollToPreview(), 100);
      };
      reader.readAsDataURL(file);
    });
  }
  

  removeFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.imagePreviews.splice(index, 1);
  }

  clearForm(productForm: NgForm) {
    productForm.resetForm();  
    this.product = {          
      productName: '',
      productDescription: '',
      productActualPrice: 0,
      productDiscountedPrice: 0,

    };
  }

  scrollToPreview() {
    if (this.imagePreviewSection) {
      this.imagePreviewSection.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }

}
