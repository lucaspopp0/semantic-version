import { setFailed } from '@actions/core';
import { getExecOutput } from '@actions/exec';

export type BumpType = 'major' | 'minor' | 'patch';

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
    return bumpTypeFromMessage(commitMessage)
}

const getCommitMessage = async (): Promise<string> => {
    const output = await getExecOutput('git', ["show", "-s", "--format='%s"]);

    return output.stdout;
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
