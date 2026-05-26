import { parse } from 'semver';
import pickNextVersion from './5_pickNextVersion';

describe('pickNextVersion', () => {
    const tagPrefix = 'v';

    it('uses 0.0.0 when there is no previous version', () => {
        const result = pickNextVersion(tagPrefix, 'patch', null);

        expect(result).toEqual({
            majorTag: 'v0',
            minorTag: 'v0.0',
            patchTag: 'v0.0.0',
        });
    });

    it('bumps patch from an existing version', () => {
        const previous = parse('1.2.3', true);

        if (!previous) {
            throw new Error('expected valid semver');
        }

        const result = pickNextVersion(tagPrefix, 'patch', previous);

        expect(result).toEqual({
            majorTag: 'v1',
            minorTag: 'v1.2',
            patchTag: 'v1.2.4',
        });
    });

    it('bumps minor from an existing version', () => {
        const previous = parse('1.2.3', true);

        if (!previous) {
            throw new Error('expected valid semver');
        }

        const result = pickNextVersion(tagPrefix, 'minor', previous);

        expect(result).toEqual({
            majorTag: 'v1',
            minorTag: 'v1.3',
            patchTag: 'v1.3.0',
        });
    });

    it('bumps major from an existing version', () => {
        const previous = parse('1.2.3', true);

        if (!previous) {
            throw new Error('expected valid semver');
        }

        const result = pickNextVersion(tagPrefix, 'major', previous);

        expect(result).toEqual({
            majorTag: 'v2',
            minorTag: 'v2.0',
            patchTag: 'v2.0.0',
        });
    });
});
