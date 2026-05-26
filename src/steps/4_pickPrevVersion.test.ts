import { parse } from 'semver';
import pickPrevVersion from './4_pickPrevVersion';

describe('pickPrevVersion', () => {
    it('returns null for an empty version list', () => {
        expect(pickPrevVersion([])).toBeNull();
    });

    it('returns the only version when there is one', () => {
        const version = parse('1.2.3', true);

        if (!version) {
            throw new Error('expected valid semver');
        }

        const result = pickPrevVersion([version]);

        expect(result?.version).toBe('1.2.3');
    });

    it('returns the highest version when multiple are present', () => {
        const v1 = parse('1.9.0', true);
        const v2 = parse('1.10.0', true);
        const v3 = parse('1.2.0', true);

        if (!v1 || !v2 || !v3) {
            throw new Error('expected valid semver');
        }

        const result = pickPrevVersion([v1, v2, v3]);

        expect(result?.version).toBe('1.10.0');
    });
});
