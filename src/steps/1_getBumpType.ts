import { info, setFailed } from '@actions/core';
import execFileAsync from '../utils/execFileAsync';
import type { BumpType } from '../utils/bumpType';

const getBumpType = async (
    inputBumpType: string,
): Promise<BumpType> => {
    switch (inputBumpType) {
        case 'major':
        case 'minor':
        case 'patch':
            return inputBumpType
        case '':
            break
        default:
            setFailed(`Unrecognized bump-type: ${inputBumpType}`)
            process.exit(0)
    }

    const commitMessage = await getCommitMessage()

    info(`Message for current commit: ${commitMessage}`)

    const bumpType = bumpTypeFromMessage(commitMessage)
    info(`Bump type: ${bumpType.toString()}`)

    return bumpType;
}

const getCommitMessage = async (): Promise<string> => {
    const { stdout } = await execFileAsync(
        'git',
        ['show', '-s', "--format=%s"],
        { encoding: 'utf8' },
    );

    return stdout;
}

const bumpTypeFromMessage = (message: string): BumpType => {
    if (/^feat(\([^\)]+\)?!:.+$)/.test(message)) {
        return 'major'
    } else if (/^feat(\([^\)]+\)?:.+$)/.test(message)) {
        return 'minor'
    }

    return 'patch'
}

export default getBumpType;
