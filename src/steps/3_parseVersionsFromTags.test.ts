import parseVersionsFromTags from './3_parseVersionsFromTags';

describe('parseVersionsFromTags', () => {
    it('parses valid tags with the given prefix', () => {
        const tags = ['v1.0.0', 'v2.3.4'];

        const result = parseVersionsFromTags('v', tags);

        expect(result).toHaveLength(2);
        expect(result[0]?.version).toBe('1.0.0');
        expect(result[1]?.version).toBe('2.3.4');
    });

    it('skips invalid tags and keeps only valid semver entries', () => {
        const tags = ['v1.0.0', 'vnot-a-version', 'v2.0.0'];

        const result = parseVersionsFromTags('v', tags);

        expect(result).toHaveLength(2);
        expect(result.map((v) => v.version)).toEqual(['1.0.0', '2.0.0']);
    });

    it('returns an empty array when no tags are valid semver', () => {
        const tags = ['vfoo', 'vbar'];

        const result = parseVersionsFromTags('v', tags);

        expect(result).toEqual([]);
    });

    it('returns an empty array when prefix is longer than the tag', () => {
        const tags = ['v1.0.0'];

        const result = parseVersionsFromTags('v1.0.0-extra', tags);

        expect(result).toEqual([]);
    });
});
