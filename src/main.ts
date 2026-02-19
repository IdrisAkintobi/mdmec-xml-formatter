import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all.exception.filter';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const port = configService.get<number>('app.port', 3000);

    // Enable validation
    app.useGlobalPipes(
        new ValidationPipe({
            whitelist: true,
            transform: true,
            forbidNonWhitelisted: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    // Enable exception filters
    app.useGlobalFilters(new AllExceptionsFilter(app.get(HttpAdapterHost)));

    // Configure Swagger
    const config = new DocumentBuilder()
        .setTitle('Amazon Prime Video XML Generator API')
        .setDescription(
            `
## API for generating MEC and MMC XML files for Amazon Prime Video

This service provides two ways to generate XML files:

### 1. CSV Upload (Legacy)
- **POST /upload** - Upload CSV files (MEC, MMC, or Image-Only)
- Returns a ZIP file containing the generated XML files

### 2. JSON API (Modern - Recommended)
- **POST /generate/mec** - Generate MEC XML from JSON payload
- **POST /generate/mmc** - Generate MMC XML from JSON payload
- Returns XML file directly with auto-generated IDs

### What is MEC?
Media Entertainment Core (MEC) contains metadata about your content:
- Title, cast, genres, ratings, release dates
- Localized information for multiple languages
- Company credits and organization details

### What is MMC?
Media Manifest Core (MMC) contains technical specifications:
- Video, audio, and subtitle track information
- Presentations and experiences
- File locations and hashes

### Auto-Generated Fields
Both endpoints support auto-generation of:
- Track IDs (video, audio, subtitle, image)
- Presentation IDs and references
- Experience IDs and ALID mappings
- Aspect ratio (calculated from dimensions)
- Title sort (removes articles: The, A, An)

Simply omit optional ID fields and they'll be generated automatically!
        `,
        )
        .setVersion('1.0')
        .addTag('File Upload (CSV)', 'Upload CSV files to generate XML (original endpoint)')
        .addTag('XML Generation (JSON API)', 'Generate XML from JSON payloads (modern API with auto-generation)')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        customSiteTitle: 'Amazon Prime XML Generator API',
        customCss: '.swagger-ui .topbar { display: none }',
        swaggerOptions: {
            persistAuthorization: true,
            docExpansion: 'none',
            filter: true,
            showRequestDuration: true,
        },
    });

    await app.listen(port);

    console.log(`Application is running on: ${await app.getUrl()}`);
    console.log(`Swagger documentation available at: ${await app.getUrl()}/api`);
}
bootstrap();
