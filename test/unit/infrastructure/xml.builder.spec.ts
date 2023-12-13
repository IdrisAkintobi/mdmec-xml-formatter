import { XMLValidator } from 'fast-xml-parser';
import { validateXML, xmlBuilder, xmlPrefix } from '../../../src/infrastructure/xml.builder';

jest.mock('fast-xml-parser');

describe('xmlModule', () => {
    it('should create XMLBuilder instance', () => {
        expect(xmlBuilder).toBeDefined();
        expect(xmlBuilder).toBeInstanceOf(Object);
    });

    it('should validate XML', () => {
        const xmlString = '<root><element>value</element></root>';
        validateXML(xmlString);
        // Assert that the validate method was called with the correct arguments
        expect(XMLValidator.validate).toHaveBeenCalledWith(xmlString);
        expect(XMLValidator.validate).toHaveBeenCalledTimes(1);
    });

    it('should have correct XML prefix', () => {
        expect(xmlPrefix).toBe('<?xml version="1.0" encoding="UTF-8"?>');
    });
});
