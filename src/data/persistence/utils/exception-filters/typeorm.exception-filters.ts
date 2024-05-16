import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { TypeORMError } from 'typeorm';

@Catch(TypeORMError)
export class TypeOrmExceptionFilter implements ExceptionFilter {
  catch(exception: TypeORMError, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();
    const message = exception.message;
    const code: number = (exception as any).code;
    const aditional = (exception as any).detail;
    const customResponse = {
      status: 500,
      message: 'Ocurrió un error',
      type: 'Internal Server Error',
      errors: [{ message: message, detail: aditional }],
      errorCode: code,
      timestamp: new Date().toISOString(),
    };

    response.status(customResponse.status).json(customResponse);
  }
}
