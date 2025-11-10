import { AuthRequest } from "./AuthRequest";

export interface RegisterRequest extends AuthRequest {
  readonly firstName: string;
  readonly lastName: string;
  readonly imageStringBase64: string;
  readonly imageFileExtension: string;
}
