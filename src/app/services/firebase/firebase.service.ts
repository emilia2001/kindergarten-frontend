import { Injectable } from '@angular/core';
import {AngularFireStorage, AngularFireStorageReference} from "@angular/fire/compat/storage";

import {catchError, from, Observable, of, switchMap} from "rxjs";

import {FileUpload} from "../../shared/models/FileUpload";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  basePath = '/uploads';

  constructor(
    private _firebaseStorage: AngularFireStorage)
  { }

  pushFileToStorage(fileUpload: FileUpload, path: string, name: string): Observable<string> {
    const filePath = `${this.basePath}/${path}/${name}`;
    const storageRef = this._firebaseStorage.ref(filePath);
    const uploadTask = this._firebaseStorage.upload(filePath, fileUpload.file);

    return from(uploadTask).pipe(
      switchMap(() => this.waitForFileAvailability(storageRef))
    );
  }

  waitForFileAvailability(storageRef: AngularFireStorageReference): Observable<string> {
    return from(storageRef.getDownloadURL());
  }


  getFileFromStorage(): Observable<string | undefined> {
    const filePath = `${this.basePath}/requests/extension/Cerere-inscriere-pe-perioada-vacantei-2.pdf`;
    const storageRef = this._firebaseStorage.ref(filePath);

    return storageRef.getDownloadURL().pipe(
      catchError((error) => {
        console.error('Error retrieving file from Firebase Storage:', error);
        return of(undefined);
      })
    );
  }
}
