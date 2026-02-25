import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ApiResponse } from './common/http/response.helper';
import { DomainExceptionFilter } from './common/filters/domain-exception.filter';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.flatMap((error) => {
          const firstConstraint = Object.values(error.constraints ?? {})[0];
          return firstConstraint;
        });

        return new BadRequestException(ApiResponse.error('Validation failed', formattedErrors));
      },
    })
  )

    app.useGlobalFilters(new GlobalExceptionFilter())
    app.useGlobalFilters(new DomainExceptionFilter());

    app.setGlobalPrefix('api');

    await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
