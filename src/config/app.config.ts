import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
    port: parseInt(process.env.PORT || '3000', 10),
    nodeEnv: process.env.NODE_ENV || 'development',
    defaultOrganization: process.env.DEFAULT_ORGANIZATION || 'wiflix',
    defaultOrgPrefix: process.env.DEFAULT_ORG_PREFIX || 'md:cid:org',
}));
