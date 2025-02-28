import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { Image } from 'src/app/interfaces/image';

import { ImageServiceService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-add-new-product',
  templateUrl: './save-product.component.html',
})
  
export class SaveProductComponent implements OnInit {

  @ViewChild('imagePreviewSection') imagePreviewSection!: ElementRef;

  selectedFiles: File[] = [];
  imagePreviews: Image [] = []; // Inicialización correcta como array de objetos
  isEditMode: boolean = false;

  product: Product = {
    productName: '',
    productDescription: '',
    productDiscountedPrice: 0,
    productActualPrice: 0,
  };

  constructor(
    private productService: ProductService,
    private imageService: ImageServiceService,
    private toastrService: ToastrService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const productId = Number(this.route.snapshot.paramMap.get('productId'));
    if (productId) {
      this.isEditMode = true;
      this.getProduct(productId);
    }
  }

  getProduct(productId: number): void {
    this.productService.getProductById(productId).subscribe({
      next: (productData) => {
        this.product = productData; // Cargar los datos del producto
  
        // Cargar imágenes existentes
        if (productData.productImages && productData.productImages.length > 0) {
          this.imagePreviews = productData.productImages.map(img => ({
            id: img.id,
            name: img.name,
            shortName: img.shortName,
            type: 'image/png', 
            picByte: img.picByte, 
          }));
        }
      },
      error: (error) => {
        this.toastrService.error('Error retrieving product data', 'Error');
        console.error('Error loading product:', error);
      }
    });
  }

  addProduct(productForm: NgForm) {
    if (this.product.productActualPrice < this.product.productDiscountedPrice) {
      this.toastrService.warning('Discounted price cannot be greater than actual price.', 'Warning');
      return;
    }
    const formData = this.loadFormData();

    if (this.isEditMode) {
      this.editProduct(formData);
    }
    else {
      this.createProduct(formData, productForm);
    }
  }

  private editProduct(formData: FormData) {
    this.productService.updateProduct(this.product.productId!, formData).subscribe({
      next: () => {
        this.toastrService.success('Product updated successfully', 'Success');
        this.router.navigate(['/showProductDetails']);
      },
      error: (err) => {
        console.error('Error al actualizar el producto:', err);
        if (err.error) {
          console.error('Error del backend:', err.error);
        }
        if (err.status) {
          console.error('Código de estado:', err.status);
        }
        this.toastrService.error('Failed to update product', 'Error');
      }
    });
  }

  private createProduct(formData: FormData, productForm: NgForm) {
    this.productService.addProduct(formData).subscribe({
      next: () => {
        this.toastrService.success('Product created successfully', 'Success');
        this.clearForm(productForm);
        this.selectedFiles = [];
        this.imagePreviews = [];
        this.router.navigate(['/showProductDetails']);
      },
      error: (err) => {
        this.toastrService.error('Failed to create product', 'Error');
        console.error(err);
      }
    });
  }

  private loadFormData() {
    const formData = new FormData();
    const productBlob = new Blob([JSON.stringify(this.product)], { type: 'application/json' });
    formData.append('product', productBlob);

    // Agregar imágenes nuevas (si hay)
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => formData.append('imageFile', file, file.name));
    }
    // Agregar imágenes existentes (si hay)
    if (this.imagePreviews.length > 0) {
      const existingImageNames = this.imagePreviews.map(image => image.name); // Obtener solo los nombres
      formData.append('existingImages', new Blob([JSON.stringify(existingImageNames)], { type: 'application/json' }));

    }
    return formData;
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();  // Previene el comportamiento por defecto de la acción de arrastrar
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();  // Previene el comportamiento por defecto (como abrir el archivo)

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.onFileSelected({ target: { files } } as any);
    }
  }

 
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;
  
    const files = Array.from(input.files);
  
    // Verificar que el usuario no suba más de 3 imágenes
    if (this.imagePreviews.length + files.length > 3) {
      this.toastrService.warning('You can only upload up to 3 images.', 'Warning');
      return;
    }
  
    files.forEach(file => {
      // Agregar el archivo al array de selectedFiles
      this.selectedFiles.push(file);
  
      const reader = new FileReader();
      reader.onload = (e: any) => {
        // Crear un objeto de imagen para la previsualización usando base64
        const previewImage: Image = {
          id: 0,  // Id no disponible hasta el momento de guardar
          name: file.name,
          shortName: file.name,  // Puedes ajustar esto si quieres mostrar un nombre corto
          type: file.type,
          picByte: e.target.result.split(',')[1],  // Solo la parte base64, sin la cabecera
        };
  
        // Añadir la imagen a la lista de previsualización
        this.imagePreviews.push(previewImage);
        
      };
      
      reader.readAsDataURL(file);

    });
  }
  
  
  removeFile(index: number) {
    if (this.isEditMode && this.imagePreviews[index].id !== 0) {
      this.imageService.deleteImage(this.imagePreviews[index].id).subscribe({
        next: () => {
          this.toastrService.success('Image removed successfully.', 'Success');
        },
        error: (err) => {
          console.error('Error removing image:', err);
          this.toastrService.error('Failed to remove image.', 'Error');
        }
      });
    }
  
    const removedFileName = this.imagePreviews[index].name;
  
    // Filtrar `selectedFiles` para eliminar solo el archivo correspondiente
    this.selectedFiles = this.selectedFiles.filter(file => file.name !== removedFileName);
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
}
