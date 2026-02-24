import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const formattedErrors = errors.flatMap((error) =>
          Object.values(error.constraints ?? {}),
        );

        return new BadRequestException({
          success: false,
          message: 'Validation failed',
          errors: formattedErrors,
        });
      },
    })
  )

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
