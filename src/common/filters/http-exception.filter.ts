import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common";
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
    private readonly logger = new Logger(HttpExceptionFilter.name);

    catch(exception: HttpException, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();
        const status = exception.getStatus();
        const errorResponse = exception.getResponse();

        const message = typeof errorResponse === 'string'
            ? errorResponse
            : (errorResponse as any).message || 'Erro inesperado';

        const details = typeof errorResponse === 'object'
            ? (errorResponse as any).error : undefined;

        const errorResponsePayload = {
            statusCode: status,
            timestamp: new Date().toISOString(),
            path: request.url,
            method: request.method,
            message,
            details,
        };

        this.logger.warn(
            `Application Error: [${request.method}] ${request.url} - Status: ${status}`,
            JSON.stringify(errorResponsePayload),
        );

        response.status(status).json(errorResponsePayload);

        throw new Error("Method not implemented.");
    }

} 