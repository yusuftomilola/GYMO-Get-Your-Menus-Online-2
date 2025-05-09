import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // GLOBAL VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // SET UP SWAGGER DOCUMENTATION
  const config = new DocumentBuilder()
    .setTitle('GYMO: Get Your Menus Online')
    .setDescription(
      'A QR-code powered digital menu platform that helps restaurants, bars, cafés, lounges, hotels, etc., go paperless with stylish digital menus customers access instantly.',
    )
    .setTermsOfService('terms-of-service')
    .setLicense('MIT License', 'mit')
    .addServer('http://localhost:3000')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
