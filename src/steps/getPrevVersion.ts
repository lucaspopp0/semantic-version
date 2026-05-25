import { getExecOutput } from '@actions/exec';
import { gt, parse, SemVer } from 'semver';

const getPrevVersion = async (
    tagPrefix: string,
): Promise<SemVer | null> => {
    const tags = await listAllTags(tagPrefix);

    const versions = parseVersionsFromTags(tagPrefix, tags);
    if (versions.length == 0) {
        return null
    }

    return pickHighestVersion(versions)
}

const listAllTags = async (
    tagPrefix: string,
): Promise<string[]> => {
    const output = await getExecOutput('git', ['tag', '--list', `${tagPrefix}*`]);

    const tags = output.stdout.trim().split('\n');

    return tags;
}

const parseVersionsFromTags = (
    tagPrefix: string,
    tags: string[],
): SemVer[] => {
    const out: SemVer[] = [];

    for (let tag of tags) {
        const stripped = tag.substring(0, tagPrefix.length);
        const parsed = parse(stripped, false, false);

        if (!!parsed) {
            out.push(parsed);
        }
    }

    return out;
}

const pickHighestVersion = (
    versions: SemVer[],
): SemVer => {
    let highest = versions[0];

    for (let version of versions) {
        if (gt(version, highest)) {
            highest = version
        }
    }
    
    return highest;
}

export default getPrevVersion;
