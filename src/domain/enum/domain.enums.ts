// https://gist.github.com/jacobbubu/1836273
export enum LanguageEnum {
    EnUS = 'en-US',
    JaJP = 'ja-JP',
    DeDE = 'de-DE',
    FrFR = 'fr-FR',
    EsEs = 'es-ES',
}

export const LangRemap = {
    [LanguageEnum.EnUS]: 'EnUS',
    [LanguageEnum.JaJP]: 'JaJP',
    [LanguageEnum.DeDE]: 'DeDE',
    [LanguageEnum.FrFR]: 'FrFR',
    [LanguageEnum.EsEs]: 'EsEs',
};

export enum CategoryEnum {
    Episode = 'Episode',
    Feature = 'Feature',
    Season = 'Season',
    Series = 'Series',
}

export enum RelationshipTypeEnum {
    Episode = 'isepisodeof',
    Season = 'isseasonof',
}
