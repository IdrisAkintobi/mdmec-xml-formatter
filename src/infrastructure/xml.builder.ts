import { XMLBuilder, XMLValidator } from 'fast-xml-parser';

export const xmlBuilder = new XMLBuilder({
    attributeNamePrefix: '@',
    textNodeName: '$',
    ignoreAttributes: false,
});

export const validateXML = XMLValidator.validate;

export const xmlPrefix = '<?xml version="1.0" encoding="UTF-8"?>';
