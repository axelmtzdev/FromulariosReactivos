import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  templateUrl: './switches-page.component.html',
  styles: ``
})
export class SwitchesPageComponent {

  constructor(private formBuilder:FormBuilder){}

  public myForm: FormGroup = this.formBuilder.group({
    gender: ['M', Validators.required],
    wantNotification: [true, Validators.required],
    termsAndConditions: [false, Validators.requiredTrue]
  })


  // Método para verificar si un campo específico es válido o no.
  isValidField(field: string): boolean | null {
    return this.myForm.controls[field].errors
    // Si el campo tiene errores (es decir, no es válido)...
    && this.myForm.controls[field].touched;
    // ... y si el campo ha sido tocado (es decir, el usuario ha interactuado con él), devuelve 'true', lo que indica que el campo no es válido.
  }

  onSave(){

    if(this.myForm.invalid) {
      this.myForm.markAllAsTouched();
      return;
    }


    console.log(this.myForm.value);
  }



}
