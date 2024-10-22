import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './dynamic-page.component.html', // Especifica la plantilla HTML que se asociará con este componente.
  styles: `` // Se puede definir estilos específicos para este componente (aquí vacío).
})
export class DynamicPageComponent { // Definición de la clase del componente.

  constructor(private formBuilder: FormBuilder){}
  // El constructor inyecta una instancia de FormBuilder, una utilidad proporcionada por Angular para crear grupos de formularios, controles y arrays de manera sencilla.

  // Definición del formulario 'myForm' como un FormGroup, inicializado con dos campos: 'name' y 'favoriteGames'.
  public myForm: FormGroup = this.formBuilder.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    // Campo 'name' con un valor inicial vacío y dos validadores: 'required' (requerido) y 'minLength(3)' (mínimo 3 caracteres).
    favoriteGames: this.formBuilder.array([
      // 'favoriteGames' es un FormArray que contiene inicialmente tres juegos favoritos, cada uno con el validador 'required'.
      ['Halo Reach', Validators.required],
      ['Resident Evil 5', Validators.required],
      ['Fornite', Validators.required],
    ])
  });

  // Control individual 'newFavorite', usado para añadir un nuevo juego al array de juegos favoritos.
  public newFavorite: FormControl = new FormControl('', [Validators.required, Validators.minLength(3)])
  // Este FormControl empieza vacío, pero tiene validadores 'required' y 'minLength(3)' para asegurar que el valor cumpla ciertas reglas.

  // Método getter que permite obtener el FormArray 'favoriteGames' desde el formulario.
  get favoriteGames() {
    return this.myForm.get('favoriteGames') as FormArray;
    // Se recupera 'favoriteGames' del FormGroup y se asegura que es un FormArray mediante 'as FormArray'.
  }

  // Método para verificar si un campo específico es válido o no.
  isValidField(field: string): boolean | null {
    return this.myForm.controls[field].errors
    // Si el campo tiene errores (es decir, no es válido)...
    && this.myForm.controls[field].touched;
    // ... y si el campo ha sido tocado (es decir, el usuario ha interactuado con él), devuelve 'true', lo que indica que el campo no es válido.
  }

  // Verifica si un campo específico dentro del FormArray 'favoriteGames' es válido.
  isValidFieldInArray(formArray: FormArray, index: number){
    return formArray.controls[index].errors
    // Comprueba si el control en la posición 'index' dentro del FormArray tiene errores...
    && formArray.controls[index].touched;
    // ...y si ha sido tocado, lo que indica si el campo es inválido y ha sido interactuado.
  }

  // Método que devuelve el mensaje de error correspondiente para un campo específico.
  getFieldError(field: string): string | null {
    if (!this.myForm.controls[field]) return null;
    // Si no existe el control especificado, regresa 'null'.

    const errors = this.myForm.controls[field].errors || {};
    // Recupera los errores del control, o un objeto vacío si no hay errores.

    for (const key of Object.keys(errors)) {
      // Itera sobre las claves de los errores (por ejemplo, 'required' o 'minlength').
      switch (key) {
        case 'required':
          return 'Este campo es requerido';
          // Devuelve un mensaje si el error es 'required' (campo obligatorio).

        case 'minlength':
          return `Minimo ${errors['minlength'].requiredLength} caracteres`;
          // Devuelve un mensaje si el error es 'minlength', especificando cuántos caracteres se requieren.
      }
    }

    return null;
    // Si no hay errores o no se encuentran coincidencias, devuelve 'null'.
  }

  // Método para eliminar un juego favorito del FormArray en la posición especificada por 'index'.
  onDeleteFavorite(index: number) {
    this.favoriteGames.removeAt(index);
    // Elimina el FormControl en la posición 'index' dentro del FormArray 'favoriteGames'.
  }

  // Método que añade un nuevo juego a la lista de juegos favoritos.
  onAddToFavs(): void {
    if (this.newFavorite.invalid) return;
    // Si el control 'newFavorite' es inválido (no pasa las validaciones), detiene la ejecución.

    const newGame = this.newFavorite.value;
    // Obtiene el valor del control 'newFavorite' (el nuevo juego).

    this.favoriteGames.push(
      this.formBuilder.control(newGame, Validators.required)
    );
    // Añade un nuevo FormControl con el valor del juego y el validador 'required' al FormArray 'favoriteGames'.

    this.newFavorite.reset();
    // Reinicia el control 'newFavorite' para que quede listo para recibir otro valor.
  }

  // Método para manejar el envío del formulario.
  onSumbit(): void {
    if (this.myForm.invalid) {
      // Si el formulario es inválido (algún campo no pasa las validaciones)...
      this.myForm.markAllAsTouched();
      // ...marca todos los campos como 'touched' (para mostrar los errores en la UI).
      return;
      // Detiene la ejecución.
    }

    console.log(this.myForm.value);
    // Si el formulario es válido, imprime el valor del formulario en la consola.

    (this.myForm.controls['favoriteGames'] as FormArray) = this.formBuilder.array([]);
    // Limpia el array de juegos favoritos, reemplazándolo por un nuevo array vacío.

    this.myForm.reset();
    // Reinicia todo el formulario, dejando todos los campos en su valor inicial.
  }
}

