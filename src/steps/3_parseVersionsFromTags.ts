import { info } from '@actions/core';
import { parse, SemVer } from 'semver';

const parseVersionsFromTags = (
    tagPrefix: string,
    tags: string[],
): SemVer[] => {
    const out: SemVer[] = [];

    for (const tag of tags) {
        const stripped = tag.substring(tagPrefix.length);
        const parsed = parse(stripped, false, false);

        if (parsed) {
            out.push(parsed);
        }
    }

    if (out.length === 0) {
        info(`No valid semver tags found`)
    } else {
        info(`Parsed versions from tags:`)
        info(out.map(v => v.toString()).join('\n'))
    }

    return out;
}

export default parseVersionsFromTags;
