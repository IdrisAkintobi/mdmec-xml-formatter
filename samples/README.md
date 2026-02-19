# Sample Files

This directory contains sample files for testing the MEC and MMC XML generators in both JSON and CSV formats.

## 📁 Directory Structure

```
samples/
├── csv/          # CSV format samples (for /upload endpoint)
│   ├── minimal-MEC.csv
│   ├── minimal-MMC.csv
│   ├── optimized-MEC.csv
│   ├── optimized-MMC.csv
│   └── ... (legacy formats)
│
├── json/         # JSON format samples (for /generate/* endpoints)
│   ├── mec-minimal.json
│   ├── mec-complete.json
│   ├── mmc-minimal.json
│   └── mmc-multiple-tracks.json
│
└── README.md     # This file
```

---

## 🆕 What's New

### 🎉 Zero Configuration Required - All IDs Auto-Generated!

**You don't need to provide ANY MovieLabs IDs!** Just provide your media files and content details:

**For MEC (Metadata):**

-   ✅ Just provide `TitleDisplay` → ContentID auto-generated
-   ✅ Example: `"TitleDisplay": "The Matrix"` → `md:cid:org:wiflix:the-matrix`

**For MMC (Manifest):**

-   ✅ Just provide media file locations → All track IDs auto-generated
-   ✅ VideoTrackID, AudioTrackID, SubtitleTrackID - all auto-generated
-   ✅ PresentationID, ExperienceID, ALID - all auto-generated
-   ✅ IDs use your video URL path as content slug

**Example:**

```json
{
    "video": [
        {
            "location": "https://cdn.com/my-movie/video.mp4"
        }
    ]
}
```

Generates: `md:vidtrackid:org:wiflix:my-movie:video`

### Environment Configuration

Configure your organization in `.env`:

```bash
# .env
DEFAULT_ORGANIZATION=your-company-name
```

All auto-generated IDs will use your organization instead of `wiflix`.

**Slug Generation Examples:**

-   "The Matrix" → `the-matrix`
-   "Spider-Man 2" → `spider-man-2`
-   "Chioma: My Love" → `chioma-my-love`

---

## 🎯 Quick Start

### Using JSON API (Recommended)

```bash
# MEC (Metadata)
curl -X POST http://localhost:3000/generate/mec \
  -H "Content-Type: application/json" \
  -d @samples/json/mec-minimal.json

# MMC (Manifest)
curl -X POST http://localhost:3000/generate/mmc \
  -H "Content-Type: application/json" \
  -d @samples/json/mmc-minimal.json
```

### Using CSV Upload

```bash
# Upload CSV file
curl -X POST http://localhost:3000/upload \
  -F "file=@samples/csv/minimal-MEC.csv" \
  -F "variant=MEC"
```

---

## 📄 JSON Samples (`json/`)

### MEC (Metadata Core) Samples

#### `mec-minimal.json` ✅ RECOMMENDED FOR BEGINNERS

Minimal required fields for MEC metadata. Great starting point!

**Features:**

-   Single language (en-US)
-   Basic cast information
-   Simple genre classification
-   Auto-generates ContentID from title

**Example:**

```json
{
  "localizedInfo": [{
    "language": "en-US",
    "titleDisplay": "My Movie"
  }],
  "genre": [{"primary": "Drama"}],
  ...
}
```

#### `mec-complete.json` ✅ FULL EXAMPLE

Complete MEC example with all optional fields populated.

**Features:**

-   Multiple languages (en-US, es-ES)
-   Multiple genres and subgenres
-   Art references (cover, poster, hero images)
-   Cast and crew information
-   Release history across territories
-   Rating information
-   Episodic content support

---

### MMC (Manifest Core) Samples

#### `mmc-minimal.json` ✅ RECOMMENDED FOR BEGINNERS

Minimal required fields for MMC manifest.

**Features:**

-   Single video track
-   Single audio track
-   Auto-generated track IDs
-   Auto-calculated aspect ratio

**Example:**

```json
{
  "video": [{
    "type": "primary",
    "language": "en-US",
    "location": "https://cdn.example.com/video.mp4",
    "picture": {
      "widthPixels": "1920",
      "heightPixels": "1080"
    }
  }],
  ...
}
```

#### `mmc-multiple-tracks.json` ✅ ADVANCED

MMC example with multiple audio and subtitle tracks.

**Features:**

-   Multiple audio languages
-   Multiple subtitle tracks
-   Image assets
-   Picture groups
-   Experience children (trailers, bonus content)

---

## 📄 CSV Samples (`csv/`)

### MEC (Metadata Core) CSV Files

#### `minimal-MEC.csv` (29 columns) ✅ RECOMMENDED FOR BEGINNERS

Simple example with basic content. ContentID auto-generated from TitleDisplay.

**ContentID auto-generated from TitleDisplay:**

-   Provide: `TitleDisplay` (e.g., "Simple Movie")
-   Auto-generates: `md:cid:org:wiflix:simple-movie` (or your configured organization)
-   No ContentID column needed!

**Example:**

```csv
LocalizedInfo:language,TitleDisplay,...
en-US,Simple Movie,...
```

Auto-generates: `md:cid:org:wiflix:simple-movie`

#### `optimized-MEC.csv` (29 columns) ✅ PRODUCTION EXAMPLE

Full example with complete metadata (genres, cast, ratings, art references).  
ContentID auto-generated - same structure as minimal, just more complete data.

#### `latest-MEC.csv` - LEGACY FORMAT

Legacy MEC format for backward compatibility. Use `minimal-MEC.csv` or `optimized-MEC.csv` instead.

---

### MMC (Manifest Core) CSV Files

#### `minimal-MMC.csv` (10 columns) ✅ RECOMMENDED FOR BEGINNERS

Simplest format with only required fields. All IDs auto-generated.

**Required fields only:**

-   VideoType, VideoLanguage, VideoLocation, WidthPixels, HeightPixels
-   AudioType, AudioLanguage, AudioLocation
-   ExperienceType, ExperienceSubType

**Auto-generated fields:**

-   VideoTrackID, AudioTrackID (from organization + video URL)
-   PresentationID, PresentationIDVid, PresentationIDAud, PresentationIDSub, PresentationIDTrackNum
-   ExperienceID, ALID
-   AspectRatio (calculated from WidthPixels/HeightPixels)

**Example:**

```csv
VideoType,VideoLanguage,VideoLocation,...
primary,en-US,https://s3.../video.mp4,...
```

#### `optimized-MMC.csv` (33 columns) ✅ ADVANCED - CUSTOM IDs

**Use this if:** You need to provide your own MovieLabs IDs (rare - most users don't need this).

**Includes ID columns for custom values:**

-   All minimal-MMC fields PLUS
-   VideoTrackID, AudioTrackID, SubtitleTrackID, ImageID (can specify or leave empty for auto-generation)
-   PresentationID, PresentationIDTrackNum, PresentationIDVid, PresentationIDAud, PresentationIDSub
-   ExperienceID, ALID

**Note:** Even in this format, you can leave ID columns empty and they'll be auto-generated!

#### `mmcParsedType-with-image.csv` (41 columns) - COMPLETE SCHEMA

**Use this if:** You need advanced features like PictureGroups, ExperienceChildren, etc.

**Includes everything in optimized-MMC PLUS:**

-   PictureGroupID, PictureGroupImageID
-   ExperienceChildID, ExperienceChildRelationship
-   Progressive, ProgressiveScanOrder
-   ALIDExperienceID (deprecated but included for backward compatibility)

#### `latest-MMC.csv` - LEGACY FORMAT

Older format for backward compatibility. Use `minimal-MMC.csv` or `optimized-MMC.csv` instead.

---

## 🔧 Important Notes

### Semicolon Delimiter for Multiple Tracks (CSV Only)

Use `;` to separate multiple audio/subtitle tracks:

```csv
# 2 audio tracks
AudioType,AudioLanguage,AudioLocation
stereo;stereo,en-US;es-ES,url1.aac;url2.aac
```

**⚠️ CRITICAL:** All related fields MUST have the same count:

```csv
# WRONG - AudioType has 1 value, but AudioLanguage has 2
AudioType,AudioLanguage
stereo,en-US;es-ES

# CORRECT - Both have 2 values
AudioType,AudioLanguage
stereo;stereo,en-US;es-ES
```

### Quoting Fields with Special Characters (CSV Only)

If your URLs or fields contain commas or semicolons, wrap them in quotes:

```csv
VideoLocation,"https://example.com/video.mp4?param1=a,param2=b"
```

---

## 📊 File Comparison

### JSON Files

| File                     | Complexity | Use Case                       |
| ------------------------ | ---------- | ------------------------------ |
| **MEC Files**            |            |                                |
| mec-minimal.json         | Simple     | Quick start, single language   |
| mec-complete.json        | Advanced   | All features, multi-language   |
| **MMC Files**            |            |                                |
| mmc-minimal.json         | Simple     | Single video+audio             |
| mmc-multiple-tracks.json | Advanced   | Multiple audio/subtitle tracks |

### CSV Files

| File                 | Columns | IDs                      | Best For            |
| -------------------- | ------- | ------------------------ | ------------------- |
| **MEC Files**        |         |                          |                     |
| minimal-MEC.csv      | 29      | Auto (from TitleDisplay) | Simple metadata     |
| optimized-MEC.csv    | 29      | Auto or Manual           | Custom IDs optional |
| latest-MEC.csv       | 34      | Manual                   | Legacy              |
| **MMC Files**        |         |                          |                     |
| minimal-MMC.csv      | 10      | Auto                     | Beginners           |
| optimized-MMC.csv    | 33      | Manual                   | Full control        |
| mmcParsedType-\*.csv | 41      | Manual                   | Advanced            |

---

## 🚀 Common Errors & Solutions

### "VideoType is required"

**Cause:** Row has empty VideoType column  
**Fix:** Ensure every data row has a value like `primary`, `trailer`, or `supplemental`

### "Invalid Record Length: columns length is X, got Y"

**Cause:** Row has different number of columns than header  
**Fix:** Check for unescaped commas in URLs - wrap URLs in quotes if they contain commas

### "AudioTrackID, AudioType, AudioLanguage, and AudioLocation must have the same length"

**Cause:** Multiple audio tracks but field counts don't match  
**Fix:** If you have 2 audio tracks, ALL audio fields must have 2 values separated by `;`

Example:

```csv
# WRONG
AudioType,AudioLanguage,AudioLocation
stereo,en-US;es-ES,url1;url2

# CORRECT
AudioType,AudioLanguage,AudioLocation
stereo;stereo,en-US;es-ES,url1;url2
```

---

## 🎯 Quick Reference Card

### Environment Configuration

```bash
# .env file
DEFAULT_ORGANIZATION=wiflix  # Change this to your organization
DEFAULT_ORG_PREFIX=md:cid:org  # Usually don't need to change
```

### MEC: TitleDisplay Auto-Generation vs ContentID

| Approach   | What You Provide                | Example Input               | Output ContentID                 |
| ---------- | ------------------------------- | --------------------------- | -------------------------------- |
| **Auto**   | TitleDisplay only               | `"Chioma"`                  | `md:cid:org:wiflix:chioma`       |
| **Auto**   | TitleDisplay with special chars | `"Spider-Man 2"`            | `md:cid:org:wiflix:spider-man-2` |
| **Manual** | ContentID explicitly            | `"md:cid:org:custom:my-id"` | Uses exactly as provided         |

**Note:** No more TitleDisplay column needed! ContentID is generated directly from TitleDisplay.

### MMC: Auto-Generated IDs

All MMC IDs are auto-generated from:

-   Organization (from `.env`)
-   Video URL slug (e.g., `https://cdn.wiflix.com/chioma/video.mp4` → `chioma`)

| Field           | Example Output                                     |
| --------------- | -------------------------------------------------- |
| VideoTrackID    | `md:vidtrackid:org:wiflix:chioma:video`            |
| AudioTrackID    | `md:audtrackid:org:wiflix:chioma:audio`            |
| SubtitleTrackID | `md:subtitletrackid:org:wiflix:chioma:subtitle`    |
| ImageID         | `md:imageid:org:wiflix:chioma:cover.art`           |
| PresentationID  | `md:presentationid:org:wiflix:chioma:presentation` |
| ExperienceID    | `md:experienceid:org:wiflix:chioma:experience`     |
| ALID            | `md:ALID:org:wiflix:chioma`                        |

---

## 📚 Additional Documentation

-   **CSV Column Reference**: See `REMOVED_COLUMNS.md` for deprecated fields
-   **API Documentation**: Visit `http://localhost:3000/api` for Swagger UI
-   **Auto-Population Guide**: Check mec-mmc-maker library docs

---

## 💡 Tips

1. **Start with minimal files** - Get familiar with required fields first
2. **Use JSON for new projects** - Better type safety and easier to work with
3. **Use CSV for bulk imports** - Great for migrating existing content catalogs
4. **Let the system auto-generate IDs** - Less error-prone than manual entry
5. **Configure your organization once** - Set it in `.env` and forget it

---

## 🆘 Need Help?

-   Check API documentation: `http://localhost:3000/api`
-   Run tests: `npm test`
-   View logs for detailed error messages
