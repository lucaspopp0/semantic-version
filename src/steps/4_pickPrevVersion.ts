import { info } from '@actions/core';
import { gt, SemVer } from 'semver';

const pickPrevVersion = (
    versions: SemVer[],
): SemVer | null => {
    if (versions.length == 0) {
        return null
    }

    let highest = versions[0];

    for (let version of versions) {
        if (gt(version, highest)) {
            highest = version
        }
    }

    info(`Previous version: ${highest.toString()}`)
    
    return highest;
}

export default pickPrevVersion;
