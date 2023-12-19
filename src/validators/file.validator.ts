import { FileValidator } from '@nestjs/common';
import { Express } from 'express';
import * as fileType from 'file-type-mime';

export interface FileUploadTypeValidatorOptions {
  fileType: string[];
  // fileSize: number;
}

export class FileUploadFileTypeValidator extends FileValidator {
  private _allowedMimeTypes: string[];
  // private _maxFileSize: number;

  constructor(
    protected readonly validationOptions: FileUploadTypeValidatorOptions,
  ) {
    super(validationOptions);
    this._allowedMimeTypes = this.validationOptions.fileType;
    // this._maxFileSize = this.validationOptions.fileSize;
  }

  public isValid(file?: Express.Multer.File): boolean {
    // console.log('file', file);
    const { fieldname, mimetype, size, originalname } = file;
    // console.log('mimetype', mimetype);
    // console.log('_allowedMimeTypes', this._allowedMimeTypes);
    const isValidMimeType = this._allowedMimeTypes.includes(mimetype);

    console.log('isValidMimeType', isValidMimeType);
    return isValidMimeType;
  }

  public buildErrorMessage(): string {
    return `Upload not allowed. Upload only files of type: ${this._allowedMimeTypes.join(
      ', ',
    )}`;
  }
}
