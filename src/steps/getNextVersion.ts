import { SemVer } from 'semver';
import type { BumpType} from './getBumpType';

type NextTags = {
    majorTag: string
    minorTag: string
    patchTag: string
}

const getNextVersion = (
    tagPrefix: string,
    bumpType: BumpType,
    previousVersion: SemVer | null,
): NextTags => {
    const { major, minor, patch } = bumpVersion(bumpType, previousVersion);

    return {
        majorTag: `${tagPrefix}${major}`,
        minorTag: `${tagPrefix}${major}.${minor}`,
        patchTag: `${tagPrefix}${major}.${minor}.${patch}`,
    }
}

const bumpVersion = (
    bumpType: BumpType,
    previousVersion: SemVer | null,
): SemVer => {
    if (previousVersion == null) {
        return new SemVer('0.0.0')
    }

    const { major, minor, patch } = previousVersion;

    switch (bumpType) {
    case 'major':
        return new SemVer(`${major+1}.${0}.${0}`)
    case 'minor':
        return new SemVer(`${major}.${minor+1}.${0}`)
    default:
        return new SemVer(`${major}.${minor}.${patch+1}`)
    }
}

export default getNextVersion;
