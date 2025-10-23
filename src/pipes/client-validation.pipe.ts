import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class ClientValidationPipe implements PipeTransform {
    transform(value: any, metadata: ArgumentMetadata) {
        console.log({ ClientValidationPipe: value, metadata })
        return value;
    }
}