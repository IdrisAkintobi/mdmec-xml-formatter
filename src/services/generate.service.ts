import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MECBuilder, MMCBuilder, MovieLabsIDGenerator, type MECData, type MMCData } from 'mec-mmc-maker';
import { GenerateMECDto } from '../dto/generate/mec.dto';
import { GenerateMMCDto } from '../dto/generate/mmc.dto';

@Injectable()
export class GenerateService {
    constructor(private readonly configService: ConfigService) {}

    /**
     * Generate MEC XML from JSON data
     */
    async generateMECXml(data: GenerateMECDto): Promise<string> {
        const defaultOrg = this.configService.get<string>('app.defaultOrganization', 'wiflix');

        // Auto-generate contentId if not provided but title is available
        let contentId = data.contentId;
        if (!contentId && data.localizedInfo?.[0]?.titleDisplay) {
            const titleSlug = this.createSlugFromTitle(data.localizedInfo[0].titleDisplay);
            const organization = data.organization?.id || defaultOrg;
            contentId = MovieLabsIDGenerator.contentID(organization, titleSlug);
        }

        if (!contentId) {
            throw new Error('Either contentId or localizedInfo[0].titleDisplay is required');
        }

        // Convert DTO to MECData format
        const mecData: MECData = {
            contentId,
            localizedInfo: data.localizedInfo.map(info => ({
                language: info.language,
                titleDisplay: info.titleDisplay,
                titleSort: info.titleSort,
                summary190: info.summary190,
                summary400: info.summary400,
                artReference: info.artReference,
            })),
            genre: data.genre.map(genre => ({
                primary: genre.primary,
                subGenre: genre.subGenre,
            })),
            releaseYear: data.releaseYear,
            releaseDate: data.releaseDate,
            releaseHistory: data.releaseHistory.map(history => ({
                type: history.type as any,
                country: history.country,
                date: history.date,
            })),
            workType: data.workType as any,
            identifier: data.identifier.map(id => ({
                namespace: id.namespace as any,
                value: id.value,
            })),
            rating: data.rating?.map(rating => ({
                country: rating.country,
                system: rating.system,
                value: rating.value,
            })),
            cast: data.cast.map(member => ({
                jobFunction: member.jobFunction,
                billingBlockOrder: member.billingBlockOrder,
                displayName: member.displayName,
            })),
            originalLanguage: data.originalLanguage,
            organization: {
                id: data.organization.id,
                role: data.organization.role,
            },
            companyDisplayCredit: {
                value: data.companyDisplayCredit.value,
                language: data.companyDisplayCredit.language,
            },
            category: data.category
                ? {
                      type: data.category.type as any,
                      sequenceNumber: data.category.sequenceNumber,
                      parentContentId: data.category.parentContentId,
                  }
                : undefined,
        };

        // Build and return XML using static method
        return MECBuilder.build(mecData);
    }

    /**
     * Generate MMC XML from JSON data
     */
    async generateMMCXml(data: GenerateMMCDto): Promise<string> {
        const defaultOrg = this.configService.get<string>('app.defaultOrganization', 'wiflix');
        const organization = data.organization || defaultOrg;

        // Auto-generate track IDs if not provided
        const audioTracks = data.audio.map((audio, index) => ({
            trackId:
                audio.trackId || this.generateTrackId('audio', audio.location, organization, index, audio.language),
            type: audio.type,
            language: audio.language,
            location: audio.location,
            hash: audio.hash,
        }));

        const videoTracks = data.video.map((video, index) => ({
            trackId:
                video.trackId || this.generateTrackId('video', video.location, organization, index, video.language),
            type: video.type,
            language: video.language,
            location: video.location,
            hash: video.hash,
            picture: {
                heightPixels: video.picture.heightPixels,
                widthPixels: video.picture.widthPixels,
                aspectRatio:
                    video.picture.aspectRatio ||
                    this.calculateAspectRatio(video.picture.widthPixels, video.picture.heightPixels),
                progressive: video.picture.progressive,
                progressiveScanOrder: video.picture.progressiveScanOrder,
            },
        }));

        const subtitleTracks = data.subtitle?.map((subtitle, index) => ({
            trackId:
                subtitle.trackId ||
                this.generateTrackId('subtitle', subtitle.location, organization, index, subtitle.language),
            type: subtitle.type,
            language: subtitle.language,
            location: subtitle.location,
            hash: subtitle.hash,
            frameRate: subtitle.frameRate,
            frameRateMultiplier: subtitle.frameRateMultiplier,
            frameRateTimeCode: subtitle.frameRateTimeCode,
        }));

        const imageTracks = data.image?.map((image, index) => ({
            id: image.id || this.generateTrackId('image', image.location, organization, index),
            purpose: image.purpose as any,
            language: image.language,
            location: image.location,
        }));

        // Auto-generate presentation IDs and references
        const presentations = data.presentation.map((pres, index) => ({
            id: pres.id || this.generatePresentationId(data.video[0]?.location, organization, index),
            trackNum: pres.trackNum || '0',
            videoId: pres.videoId || videoTracks[0]?.trackId,
            audioId: pres.audioId || audioTracks[0]?.trackId,
            subtitleId: pres.subtitleId || subtitleTracks?.[0]?.trackId,
        }));

        // Auto-generate experience IDs
        const experiences = data.experience.map(exp => ({
            id: exp.id || this.generateExperienceId(data.video[0]?.location, organization),
            type: exp.type as any,
            subType: exp.subType,
            child: exp.child,
        }));

        // Auto-generate ALID mappings
        const alidExperience = data.alidExperience.map((mapping, index) => ({
            alid: mapping.alid || this.generateALID(data.video[0]?.location, organization),
            experienceId: mapping.experienceId || experiences[index]?.id,
        }));

        // Convert DTO to MMCData format
        const mmcData: MMCData = {
            audio: audioTracks,
            video: videoTracks,
            subtitle: subtitleTracks,
            image: imageTracks,
            presentation: presentations,
            pictureGroup: data.pictureGroup?.map(group => ({
                id:
                    group.id ||
                    this.generateTrackId('picturegroup', data.image?.[0]?.location || 'default', organization),
                imageIds: group.imageIds,
            })),
            experience: experiences,
            alidExperience: alidExperience,
        };

        // Build and return XML using static method
        return MMCBuilder.build(mmcData);
    }

    /**
     * Generate track ID from location URL with index and language for uniqueness
     */
    private generateTrackId(
        type: string,
        location: string,
        organization: string,
        index: number = 0,
        language?: string,
    ): string {
        const slug = this.extractSlugFromUrl(location);
        const typeMap = {
            audio: 'audtrackid',
            video: 'vidtrackid',
            subtitle: 'subtitletrackid',
            image: 'imageid',
            picturegroup: 'picturegroupid',
        };

        // For multiple tracks, append language code or index to make IDs unique
        let suffix = type;
        if (index > 0 || (language && index === 0)) {
            // Use language code if available (e.g., "en-US", "es-ES")
            suffix = language ? `${type}-${language.toLowerCase()}` : `${type}${index + 1}`;
        }

        return `md:${typeMap[type]}:org:${organization}:${slug}:${suffix}`;
    }

    /**
     * Generate presentation ID
     */
    private generatePresentationId(location: string, organization: string, index: number): string {
        const slug = this.extractSlugFromUrl(location);
        return `md:presentationid:org:${organization}:${slug}:presentation${index > 0 ? index : ''}`;
    }

    /**
     * Generate experience ID
     */
    private generateExperienceId(location: string, organization: string): string {
        const slug = this.extractSlugFromUrl(location);
        return `md:experienceid:org:${organization}:${slug}:experience`;
    }

    /**
     * Generate ALID
     */
    private generateALID(location: string, organization: string): string {
        const slug = this.extractSlugFromUrl(location);
        return `md:ALID:org:${organization}:${slug}`;
    }

    /**
     * Extract content slug from URL
     * Example: https://cdn.wiflix.com/chioma-my-love/video.mp4 -> chioma-my-love
     */
    private extractSlugFromUrl(url: string): string {
        if (!url) return 'default-content';

        try {
            // Remove protocol and domain
            const withoutProtocol = url.replace(/^https?:\/\/[^\/]+\//, '');

            // Split by slashes
            const parts = withoutProtocol.split('/');

            // Return first segment (content slug/folder name)
            // Example: "chioma-my-love/video.mp4" -> parts[0] = "chioma-my-love"
            return parts[0] || 'default-content';
        } catch {
            return 'default-content';
        }
    }

    /**
     * Calculate aspect ratio from dimensions
     */
    private calculateAspectRatio(width: string, height: string): string {
        const w = parseInt(width);
        const h = parseInt(height);

        if (isNaN(w) || isNaN(h) || h === 0) {
            return '16:9'; // Default
        }

        const gcd = this.gcd(w, h);
        return `${w / gcd}:${h / gcd}`;
    }

    /**
     * Greatest common divisor
     */
    private gcd(a: number, b: number): number {
        return b === 0 ? a : this.gcd(b, a % b);
    }

    /**
     * Get filename from content ID
     */
    getFilenameFromContentId(contentId: string): string {
        const parts = contentId.split(':');
        const slug = parts[4] || parts[parts.length - 1] || 'content';
        return slug.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }

    /**
     * Get filename from URL
     */
    getFilenameFromUrl(url: string): string {
        const slug = this.extractSlugFromUrl(url);
        return slug.replace(/[^a-z0-9]/gi, '_').toLowerCase();
    }

    /**
     * Create a URL-safe slug from a title
     * @example "The Matrix: Reloaded" -> "the-matrix-reloaded"
     */
    private createSlugFromTitle(title: string): string {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
    }
}
