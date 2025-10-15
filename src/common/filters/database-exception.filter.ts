import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus, Logger } from "@nestjs/common";
import { EntityNotFoundError, QueryFailedError } from "typeorm";
import { Request, Response } from 'express';

@Catch(QueryFailedError, EntityNotFoundError)
export class DatabaseExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(DatabaseExceptionFilter.name);

    catch(exception: QueryFailedError | EntityNotFoundError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        let status: HttpStatus;
        let message: string;
        let details: any;

        if (exception instanceof EntityNotFoundError) {
            status = HttpStatus.NOT_FOUND;
            message = 'Registro não encontrado.';
            details = exception.message;
        } else {
            status = HttpStatus.CONFLICT;
            message = 'Erro ao processar a requisição.';

            switch ((exception.driverError as any).code) {
                case '23505':
                    status = HttpStatus.CONFLICT; // 409
                    message = 'Já existe um registro com os dados informados.';
                    details = (exception.driverError as any).detail;
                    break;
                case '23503':
                    status = HttpStatus.BAD_REQUEST; // 400
                    message = 'A referência a uma entidade relacionada não é válida.';
                    details = (exception.driverError as any).detail;
                    break;
                case '22P02':
                    status = HttpStatus.BAD_REQUEST; // 400
                    message = 'Um dos parâmetros enviados está no formato inválido.';
                    details = `O formato do valor fornecido é inválido.`;
                    break;
                default:
                    status = HttpStatus.INTERNAL_SERVER_ERROR;
                    message = 'Ocorreu um erro inesperado no banco de dados.';
                    details = (exception.driverError as any).detail;
            }
        }

        const errorResponse = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message: message,
            details: details,
        }

        this.logger.error(
            'DatabaseExceptionFilter caught an exception:',
            JSON.stringify({
                ...errorResponse,
                exception: exception.message,
                stack: exception.stack,
            }, null, 2
            )
        );

        response.status(status).json(errorResponse);
    }
}