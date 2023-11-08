import { Injectable } from '@nestjs/common';
import { LangRemap, LanguageEnum } from '../enum/domain.enums';
import { ImageOnlyParsedType } from '../types/image-only-parsed.type';
import { ImageOnly, MdAltIdentifier, MdArtReference, MdLocalizedInfo } from '../types/image-only.type';

@Injectable()
export class ImageOnlyMdMecMapper {
    map(data: ImageOnlyParsedType): ImageOnly {
        const Feature: ImageOnly = {
            'mdmec:CoreMetadata': {
                '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                '@xmlns:md': 'http://www.movielabs.com/schema/md/v2.9/md',
                '@xmlns:mdmec': 'http://www.movielabs.com/schema/mdmec/v2.9',
                '@xsi:schemaLocation': 'http://www.movielabs.com/schema/mdmec/v2.9 ../mdmec-v2.9.xsd',
                'mdmec:Compatibility': {
                    'md:SpecVersion': '2.9',
                    'md:Profile': 'CM-IMAGE-1',
                },
                'mdmec:Basic': {
                    '@ContentID': data.ContentID,
                    'md:LocalizedInfo': this.mapLocalizedInfo(data),
                    'md:ReleaseYear': data['ReleaseYear'],
                    'md:WorkType': data['WorkType'],
                    'md:AltIdentifier': this.mapAltIdentifier(data),
                    'md:AssociatedOrg': {
                        '@organizationID': data['OrganizationID'],
                        '@role': data['OrganizationRole'],
                    },
                },
            },
        };

        return Feature;
    }

    private mapArtReference(data: ImageOnlyParsedType): MdArtReference[] {
        const reference = data['ArtReference'].split(';');
        const resolution = data['ArtReference:resolution'].split(';');
        const purpose = data['ArtReference:purpose'].split(';');

        // check if all arrays have the same length
        if (reference.length !== resolution.length || reference.length !== purpose.length) {
            throw new Error(
                'ArtReference, ArtReference:resolution and, ArtReference:purpose arrays must have the same length',
            );
        }

        const artReference = [];

        for (let i = 0; i < reference.length; i++) {
            artReference.push({
                '@resolution': resolution[i]?.trim(),
                '@purpose': purpose[i]?.trim(),
                $: reference[i]?.trim(),
            });
        }

        return artReference;
    }

    private mapLocalizedInfo(data: ImageOnlyParsedType): MdLocalizedInfo[] {
        const languages = data['LocalizedInfo:language'].split(';');

        const localizedInfo = [];

        for (let i = 0; i < languages.length; i++) {
            localizedInfo.push({
                '@language': LanguageEnum[LangRemap[languages[i]]],
                ['md:ArtReference']: this.mapArtReference(data),
            });
        }

        return localizedInfo;
    }

    private mapAltIdentifier(data: ImageOnlyParsedType): MdAltIdentifier[] {
        const namespace = data['Identifier:Namespace'].split(';');
        const identifier = data['Identifier'].split(';');

        // check if all arrays have the same length
        if (namespace.length !== identifier.length) {
            throw new Error('Identifier and Identifier:Namespace must have the same length');
        }

        const altIdentifier = [];

        for (let i = 0; i < namespace.length; i++) {
            altIdentifier.push({
                'md:Namespace': namespace[i]?.trim(),
                'md:Identifier': identifier[i]?.trim(),
            });
        }

        return altIdentifier;
    }
}
