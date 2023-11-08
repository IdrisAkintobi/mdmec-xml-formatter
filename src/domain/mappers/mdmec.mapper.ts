import { Injectable } from '@nestjs/common';
import { CategoryEnum, LangRemap, LanguageEnum, RelationshipTypeEnum } from '../enum/domain.enums';
import { ParsedType } from '../types/parsed.type';
import {
    FeatureType,
    MdAltIdentifier,
    MdArtReference,
    MdDisplay,
    MdGenre,
    MdLocalizedInfo,
    MdParent,
    MdPerson,
    MdRating,
    MdReleaseHistory,
    MdSequenceInfo,
} from '../types/schema.type';

@Injectable()
export class MdMecMapper {
    map(data: ParsedType): FeatureType {
        const useRating = data['Rating'].toLowerCase() === 'yes';
        const category = data['Category'];

        // check if it is an episode or season
        const requireSequence = category === CategoryEnum.Episode || category === CategoryEnum.Season;

        const Feature: FeatureType = {
            'mdmec:CoreMetadata': {
                '@xmlns:xsi': 'http://www.w3.org/2001/XMLSchema-instance',
                '@xmlns:md': 'http://www.movielabs.com/schema/md/v2.9/md',
                '@xmlns:mdmec': 'http://www.movielabs.com/schema/mdmec/v2.9',
                '@xsi:schemaLocation': 'http://www.movielabs.com/schema/mdmec/v2.9 ../mdmec-v2.9.xsd',
                'mdmec:Basic': {
                    '@ContentID': data.ContentID,
                    'md:LocalizedInfo': this.mapLocalizedInfo(data),
                    'md:ReleaseYear': data['ReleaseYear'],

                    'md:ReleaseDate': data['ReleaseDate'],
                    'md:ReleaseHistory': this.mapReleaseHistory(data),
                    'md:WorkType': data['WorkType'],
                    'md:AltIdentifier': this.mapAltIdentifier(data),
                    ...(useRating && {
                        'md:RatingSet': {
                            'md:Rating': this.mapRating(data),
                        },
                    }),
                    ...(!useRating && { 'md:notrated': 'true' }),
                    'md:People': this.mapPeople(data),
                    'md:OriginalLanguage': LanguageEnum[LangRemap[data['OriginalLanguage']]],
                    'md:AssociatedOrg': {
                        '@organizationID': data['OrganizationID'],
                        '@role': data['OrganizationRole'],
                    },
                    ...(requireSequence && this.mapCategory(data, category)),
                },
                'mdmec:CompanyDisplayCredit': {
                    'md:DisplayString': {
                        '@language': LanguageEnum[LangRemap[data['CompanyDisplayCredit:language']]],
                        $: data['CompanyDisplayCredit'],
                    },
                },
            },
        };

        return Feature;
    }

    private mapCategory(
        data: ParsedType,
        category: CategoryEnum,
    ): {
        'md:SequenceInfo': MdSequenceInfo;
        'md:Parent': MdParent;
    } {
        const sequenceNumber = data['SequenceNumber'];
        const parentContentID = data['ParentContentID'];

        if (!sequenceNumber || !parentContentID) {
            throw new Error('SequenceNumber and ParentContentID must be provided for Episode and Season');
        }

        return {
            'md:SequenceInfo': {
                'md:Number': sequenceNumber,
            },
            'md:Parent': {
                '@relationshipType': RelationshipTypeEnum[category],
                'md:ParentContentID': parentContentID,
            },
        };
    }

    private mapArtReference(data: ParsedType): MdArtReference[] {
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

    private mapGenre(data: ParsedType): MdGenre[] {
        const genre = data['Genre'].split(';');

        const genreArray = [];

        for (let i = 0; i < genre.length; i++) {
            genreArray.push({
                '@id': `av_genre_${genre[i]?.trim()}`,
            });
        }

        return genreArray;
    }

    private mapLocalizedInfo(data: ParsedType): MdLocalizedInfo[] {
        const languages = data['LocalizedInfo:language'].split(';');
        const titleDisplay = data['TitleDisplay'].split(';');
        const titleSort = data['TitleSort'].split(';');
        const summary400 = data['Summary400'].split(';');
        const summary190 = data['Summary190'].split(';');

        // check if all arrays have the same length
        if (languages.length !== titleDisplay.length || languages.length !== summary400.length) {
            throw new Error('LocalizedInfo:language, TitleDisplay and, md:Summary400, must have the same length');
        }

        //NOTE  us-EN is the default language. Must be the first element of the array

        const localizedInfo = [];

        for (let i = 0; i < languages.length; i++) {
            localizedInfo.push({
                '@language': LanguageEnum[LangRemap[languages[i]]],
                'md:TitleDisplayUnlimited': titleDisplay[i],
                'md:TitleSort': titleSort[i]?.trim() || '',
                ...(i === 0 && { ['md:ArtReference']: this.mapArtReference(data) }),
                'md:Summary190': summary190[i]?.trim() || '',
                'md:Summary400': summary400[i]?.trim() || '',
                ...(i === 0 && { ['md:Genre']: this.mapGenre(data) }),
            });
        }

        return localizedInfo;
    }

    private mapReleaseHistory(data: ParsedType): MdReleaseHistory[] {
        const releaseType = data['ReleaseHistory:Type'].split(';');
        const country = data['ReleaseHistory:Country'].split(';');
        const date = data['ReleaseHistory:Date'].split(';');

        // check if all arrays have the same length
        if (releaseType.length !== country.length || releaseType.length !== date.length) {
            throw new Error(
                'ReleaseHistory:Type, ReleaseHistory:Country and, ReleaseHistory:Date arrays must have the same length',
            );
        }

        //NOTE Provide as much release history as possible.

        const releaseHistory = [];

        for (let i = 0; i < releaseType.length; i++) {
            releaseHistory.push({
                'md:ReleaseType': releaseType[i]?.trim(),
                'md:DistrTerritory': { 'md:country': country[i]?.trim() },
                'md:Date': date[i]?.trim(),
            });
        }

        return releaseHistory;
    }

    private mapAltIdentifier(data: ParsedType): MdAltIdentifier[] {
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

    private mapRating(data: ParsedType): MdRating[] {
        const country = data['Rating:Country'].split(';');
        const system = data['Rating:System'].split(';');
        const value = data['Rating:Value'].split(';');

        // check if all arrays have the same length
        if (country.length !== system.length || country.length !== value.length) {
            throw new Error('Rating:Country, Rating:System and, Rating:Value arrays must have the same length');
        }

        const rating = [];

        for (let i = 0; i < country.length; i++) {
            rating.push({
                'md:Region': {
                    'md:country': country[i]?.trim(),
                },
                'md:System': system[i]?.trim(),
                'md:Value': value[i]?.trim(),
            });
        }

        return rating;
    }

    private mapPeopleDisplayNames(displayNameObj, currIndex: number): MdDisplay[] {
        const peopleDisplayNames = [];

        for (const lang in displayNameObj) {
            peopleDisplayNames.push({
                '@language': LanguageEnum[LangRemap[lang]],
                $: displayNameObj[lang][currIndex]?.trim(),
            });
        }

        return peopleDisplayNames;
    }

    private mapPeople(data: ParsedType): MdPerson[] {
        const jobFunction = data['Cast:JobFunction'].split(';');
        const billingBlockOrder = data['Cast:BillingBlockOrder'].split(';');
        const displayNameLanguage = data['Cast:DisplayName:language'].split(';');
        const displayNameObj = displayNameLanguage.reduce((acc: Record<string, string[]>, lang: LanguageEnum) => {
            const key = `Cast:DisplayName${lang === LanguageEnum.EnUS ? '' : ':' + LanguageEnum[LangRemap[lang]]}`;
            const value = data[key]?.split(';');
            if (!value) {
                throw new Error(`${key} column is missing`);
            }
            return {
                ...acc,
                [lang]: value,
            };
        }, {});

        const displayNameValuesArray: Array<string>[] = Object.values(displayNameObj);

        // check if all display names have the same length
        displayNameValuesArray.forEach(value => {
            if (displayNameValuesArray[0].length !== value.length) {
                throw new Error('DisplayNames in different language must have the same length');
            }
        });

        // check if all arrays have the same length
        if (jobFunction.length !== billingBlockOrder.length) {
            throw new Error('JobFunction, BillingBlockOrder arrays must have the same length');
        }

        const people = [];

        for (let i = 0; i < jobFunction.length; i++) {
            people.push({
                'md:Job': {
                    'md:JobFunction': jobFunction[i]?.trim(),
                    'md:BillingBlockOrder': billingBlockOrder[i]?.trim(),
                },
                'md:Name': {
                    'md:DisplayName': this.mapPeopleDisplayNames(displayNameObj, i),
                },
            });
        }

        return people;
    }
}
