import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Product } from 'src/app/interfaces/product';
import { Image } from 'src/app/interfaces/image';

import { ImageServiceService } from 'src/app/services/image.service';
import { ProductService } from 'src/app/services/product.service';

/**
 * Component for adding and editing products.
 */
@Component({
  selector: 'app-add-new-product',
  templateUrl: './save-product.component.html',
})
  
export class SaveProductComponent implements OnInit {

  /**
   * Reference to the image preview section in the template.
   */
  @ViewChild('imagePreviewSection') imagePreviewSection!: ElementRef;

  /**
   * List of selected files for upload.
   */
  selectedFiles: File[] = [];

  /**
   * List of image previews.
   */
  imagePreviews: Image [] = [];

  /**
   * Indicates whether the component is in edit mode.
   */
  isEditMode: boolean = false;

  /**
   * Product object containing details for creation or update.
   */
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

   /**
   * Retrieves product details by ID.
   * @param productId The ID of the product to fetch.
   */
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

  /**
   * Handles the form submission for adding or updating a product.
   * @param productForm The product form data.
   */
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

  /**
   * Updates an existing product.
   * @param formData The form data containing product details.
   */
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

  /**
   * Creates a new product.
   * @param formData The form data containing product details.
   * @param productForm The product form data.
   */
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

  /**
   * Prepares form data for submission.
   * @returns FormData containing product details and images.
   */
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

  /**
   * Handles the dragover event to allow file drop.
   * 
   * @param event - The DragEvent triggered when a file is dragged over the drop area.
   * 
   * This method prevents the default behavior to allow custom handling of the file drop.
   */
  onDragOver(event: DragEvent): void {
    event.preventDefault();  // Previene el comportamiento por defecto de la acción de arrastrar
  }

  /**
   * Handles the drop event when a file is dropped.
   * 
   * @param event - The DragEvent triggered when a file is dropped.
   * 
   * This method prevents the default behavior (e.g., opening the file in the browser)
   * and processes the dropped file by passing it to the `onFileSelected` method.
   */
  onDrop(event: DragEvent): void {
    event.preventDefault();  // Previene el comportamiento por defecto (como abrir el archivo)

    const files = event.dataTransfer?.files;
    if (files?.length) {
      this.onFileSelected({ target: { files } } as any);
    }
  }

 
  /**
   * Handles file selection and previews images.
   * @param event The file input event.
   */
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
  
  /**
   * Removes an image from the preview list and, if in edit mode, deletes it from the server.
   * 
   * @param index - The index of the image to be removed.
   * 
   * If the application is in edit mode and the image has a valid ID (not 0), 
   * it sends a request to delete the image from the server. 
   * Regardless of edit mode, the image is also removed from `selectedFiles` and `imagePreviews`.
   */
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
  
   /**
   * Clears the product form.
   * @param productForm The product form data.
   */
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
