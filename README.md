# Amazon Prime Video XML Generator API

## Description

A NestJS application that generates MovieLabs-compliant XML files (MEC and MMC) for Amazon Prime Video content delivery. Supports both CSV file uploads and modern JSON API endpoints.

### What This Service Does

-   **MEC (Media Entertainment Core)**: Generates metadata XML for your content (title, cast, genres, ratings, release dates, etc.)
-   **MMC (Media Manifest Core)**: Generates technical specifications XML for your media files (video/audio tracks, subtitles, presentations)
-   **Image-Only**: Generates XML for promotional images and artwork

### Two Ways to Generate XML

1. **CSV Upload** (Legacy) - Upload CSV files via web interface or API
2. **JSON API** (Modern) - Send JSON payloads programmatically with auto-generated IDs

## Quick Start

### Installation

```bash
npm install
```

### Running the Service

```bash
# Development mode with hot-reload
npm run start:dev

# Production mode
npm run start:prod
```

The service will start on `http://localhost:3000`

### Interactive API Documentation

Once running, access the Swagger UI for interactive testing and complete documentation:

```
http://localhost:3000/api
```

## Usage

### Option 1: JSON API (Recommended)

Generate XML programmatically with JSON payloads. IDs are auto-generated from your content URLs.

#### Generate MMC (Media Manifest)

```bash
curl -X POST http://localhost:3000/generate/mmc \
  -H "Content-Type: application/json" \
  -d '{
    "audio": [{
      "type": "stereo",
      "language": "en-US",
      "location": "https://cdn.example.com/my-movie/audio.aac"
    }],
    "video": [{
      "type": "primary",
      "language": "en-US",
      "location": "https://cdn.example.com/my-movie/video.mp4",
      "picture": {
        "heightPixels": "1080",
        "widthPixels": "1920"
      }
    }],
    "presentation": [{}],
    "experience": [{
      "type": "Movie",
      "subType": "Feature"
    }],
    "alidExperience": [{}]
  }'
```

#### Generate MEC (Metadata)

```bash
curl -X POST http://localhost:3000/generate/mec \
  -H "Content-Type: application/json" \
  -d '{
    "contentId": "md:cid:org:yourorg:my-movie",
    "localizedInfo": [{
      "language": "en-US",
      "titleDisplay": "My Movie",
      "summary400": "An amazing film about..."
    }],
    "genre": [{"primary": "Action"}],
    "releaseYear": "2024",
    "releaseDate": "2024-01-15",
    "releaseHistory": [{
      "type": "Original",
      "country": "US",
      "date": "2024-01-15"
    }],
    "workType": "movie",
    "identifier": [{"namespace": "ORG", "value": "movie-001"}],
    "cast": [{
      "jobFunction": "Actor",
      "billingBlockOrder": "1",
      "displayName": {"en-US": "Actor Name"}
    }],
    "originalLanguage": "en",
    "organization": {"id": "md:orgid:yourorg", "role": "licensor"},
    "companyDisplayCredit": {"value": "Your Studio", "language": "en-US"}
  }'
```

**See Full Examples**: Check the `samples/json/` directory for complete JSON payloads including multi-language content, subtitles, and more.

### Option 2: CSV Upload

Upload CSV files to generate XML:

```bash
curl -X POST http://localhost:3000/upload \
  -F "file=@samples/csv/minimal-MMC.csv" \
  -F "variant=MMC"
```

**Supported Variants**: `MEC`, `MMC`, `Image-Only`

**Sample CSV Files**: See `samples/csv/` directory for template CSV files.

## Key Features

### Auto-Generated Fields

The JSON API automatically generates MovieLabs-compliant IDs:

-   **Track IDs**: Video, audio, subtitle, and image track identifiers
-   **Presentation IDs**: Derived from video location URLs
-   **Experience IDs**: Auto-linked to presentations
-   **ALIDs**: Asset list identifiers
-   **Aspect Ratio**: Calculated from video dimensions
-   **Title Sort**: Removes articles (The, A, An) from titles

### ID Generation Example

```
Input URL: https://cdn.example.com/chioma-my-love/video.mp4
Generated IDs:
  - Video Track: md:vidtrackid:org:wiflix:chioma-my-love:video-en-us
  - Audio Track: md:audtrackid:org:wiflix:chioma-my-love:audio-en-us
  - Presentation: md:presentationid:org:wiflix:chioma-my-love:presentation
  - Experience: md:experienceid:org:wiflix:chioma-my-love:experience
```

### Multi-Language Support

For content with multiple audio or subtitle languages, track IDs are automatically made unique using language codes:

```json
{
  "audio": [
    { "language": "en-US", ... },  // → audio-en-us
    { "language": "es-ES", ... },  // → audio-es-es
    { "language": "fr-FR", ... }   // → audio-fr-fr
  ]
}
```

## API Endpoints

| Endpoint        | Method | Description                   |
| --------------- | ------ | ----------------------------- |
| `/generate/mmc` | POST   | Generate MMC XML from JSON    |
| `/generate/mec` | POST   | Generate MEC XML from JSON    |
| `/upload`       | POST   | Upload CSV file (returns ZIP) |
| `/api`          | GET    | Swagger UI documentation      |

## Documentation

-   **Swagger UI**: `http://localhost:3000/api` - Interactive API documentation with examples
-   **JSON Examples**: `samples/json/README.md` - Complete guide with example payloads
-   **CSV Samples**: `samples/csv/README.md` - CSV template files and usage guide

## Testing

```bash
# Unit tests
npm run test

# E2E tests
npm run test:e2e

# Test coverage
npm run test:cov
```

## Project Structure

```bash
.
├── samples/json/              # JSON API example payloads
│   ├── mmc-minimal.json
│   ├── mmc-multiple-tracks.json
│   ├── mec-minimal.json
│   ├── mec-complete.json
│   └── README.md
├── samples/csv/          # CSV template files
│   ├── minimal-MMC.csv
│   ├── optimized-MMC.csv
│   ├── minimal-MEC.csv
│   └── README.md
├── src/
│   ├── controllers/
│   │   ├── file.controller.ts      # CSV upload endpoint
│   │   └── generate.controller.ts  # JSON API endpoints
│   ├── services/
│   │   ├── file.service.ts         # CSV processing
│   │   └── generate.service.ts     # JSON XML generation
│   ├── dto/generate/
│   │   ├── mmc.dto.ts              # MMC validation DTOs
│   │   └── mec.dto.ts              # MEC validation DTOs
│   ├── decorators/
│   │   └── swagger.decorators.ts   # API documentation decorators
│   ├── infrastructure/
│   │   ├── file.processor.ts
│   │   ├── file-type-detector.ts
│   │   └── data.processor.ts
│   └── main.ts
└── test/
    └── e2e/
        ├── upload.e2e-spec.ts
        └── generate.e2e-spec.ts
```

## Requirements

-   Node.js v18.0.0 or higher
-   npm v7.0.0 or higher

## Dependencies

-   **NestJS**: Web framework
-   **mec-mmc-maker**: Modern XML builder library with builder pattern
-   **mdmec-xml-maker**: Legacy CSV-based XML generation library
-   **class-validator**: DTO validation
-   **@nestjs/swagger**: API documentation

## Environment Variables

The service runs on port 3000 by default. Configure via:

```bash
PORT=3000  # Default port
```

## MovieLabs Specification

This service generates XML files compliant with:

-   MovieLabs MEC (Media Entertainment Core) v2.9
-   MovieLabs MMC (Media Manifest Core) v1.9

For more information: [MovieLabs Specifications](https://www.movielabs.com)

## Common Use Cases

### Single Movie with One Language

Use `samples/json/mmc-minimal.json` and `samples/json/mec-minimal.json`

### Multi-Language Content

Use `samples/json/mmc-multiple-tracks.json` and `samples/json/mec-complete.json`

### TV Show Episodes

Use episodic example in `samples/json/mec-complete.json` with `category` field

### Content with Ratings

See `samples/json/mec-complete.json` with `rating` array

## Troubleshooting

### Invalid MovieLabs ID Format

Ensure content IDs follow: `md:cid:org:{organization}:{content-slug}`

### Missing Required Fields

Check Swagger UI at `/api` for complete field requirements

### Track ID Collisions

For multiple tracks of the same type, ensure different language codes or provide explicit `trackId` values

## License

[MIT licensed](LICENSE)
