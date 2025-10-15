import { Catch, ArgumentsHost, HttpException, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch(HttpException)
export class ErrorHandlingFilter implements ExceptionFilter {
    constructor(
        private readonly httpAdapterHost: HttpAdapterHost,
    ) {}

 catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: any = 'Ocorreu um erro interno inesperado no servidor.';

    // ===================================================================
    // LÓGICA DO DATABASE EXCEPTION FILTER (INCORPORADA AQUI)
    // ===================================================================
    if (exception instanceof QueryFailedError) {
      const driverError = exception.driverError;
      // Erro de chave duplicada do PostgreSQL
      if (driverError && driverError.code === '23505') {
        status = HttpStatus.CONFLICT; // 409
        message = 'Um registro com um dos campos únicos já existe.';

        console.log('teste: ');

        if (driverError.detail?.includes('email')) {
          message = 'Este e-mail já está em uso.';
        } else if (driverError.detail?.includes('cpf')) {
            message = 'Este CPF já está cadastrado.';
        }
      }
      // Aqui você poderia adicionar `else if` para outros códigos de erro de DB
      
    // ===================================================================
    // LÓGICA DO ALL EXCEPTIONS FILTER (O RESTANTE)
    // ===================================================================
    } else if (exception instanceof HttpException) {
      // Se for uma exceção HTTP já tratada (ex: NotFoundException)
      status = exception.getStatus();
      message = exception.getResponse();
    }

    // Apenas em ambiente de desenvolvimento, logue o erro completo
    if (process.env.NODE_ENV !== 'production') {
      console.error('Erro capturado pelo filtro combinado:', exception);
    } else {
       // Em produção, você enviaria o erro para um serviço de logging (Sentry, etc.)
    }


    const responseBody = {
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: httpAdapter.getRequestUrl(request),
    };

    httpAdapter.reply(response, responseBody, status);
  }
}
