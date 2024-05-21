export interface MyFormData extends FormData {
  append(name: string, value: string | Blob | Array<string>): void;
}
