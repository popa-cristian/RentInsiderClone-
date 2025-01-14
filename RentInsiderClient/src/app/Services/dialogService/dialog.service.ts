import { Injectable } from '@angular/core';
import swal from 'sweetalert';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor() {}

  openWarningDialog(
    title: string,
    message: string,
    addCancelButton: boolean = false,
    focusOnCancel: boolean = false
  ) {
    return swal({
      title: title,
      text: message,
      icon: 'warning',
      buttons: addCancelButton == true ? [true, true] : null,
      dangerMode: focusOnCancel,
    });
  }

  openErrorDialog(title: string, message: string) {
    return swal({
      title: title,
      text: message,
      icon: 'error',
    });
  }

  openSuccessDialog(title: string, message: string) {
    return swal({
      title: title,
      text: message,
      icon: 'success',
    });
  }

  openInfoDialog(
    title: string,
    message: string,
    addCancelButton: boolean = false,
    focusOnCancel: boolean = false
  ) {
    return swal({
      title: title,
      text: message,
      icon: 'info',
      buttons: addCancelButton == true ? [true, true] : null,
      dangerMode: focusOnCancel,
    });
  }
}
