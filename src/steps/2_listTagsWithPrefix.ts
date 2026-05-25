import { info } from '@actions/core';
import execFileAsync from '../utils/execFileAsync';

const listTagsWithPrefix = async (
    tagPrefix: string,
): Promise<string[]> => {
    const allTags = await listAllTags(tagPrefix);

    if (allTags.length == 0) {
        info(`No tags found matching prefix`)
    } else {
        info(`Tags matching prefix:`)
        info(allTags.join('\n'))
    }

    return allTags
}

const listAllTags = async (
    tagPrefix: string,
): Promise<string[]> => {
    let { stdout } = await execFileAsync(
        'git',
        ['tag', '--list', `${tagPrefix}*`],
        { encoding: 'utf8' },
    );

    stdout = stdout.trim();

    if (stdout == '') {
        return [];
    }

    return stdout.split('\n');
}

export default listTagsWithPrefix;
