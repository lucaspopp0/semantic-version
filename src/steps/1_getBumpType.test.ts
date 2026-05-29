import { setFailed } from '@actions/core';
import getBumpType from './1_getBumpType';
import execFileAsync from '../utils/execFileAsync';
import { BumpType } from '../utils/bumpType';

jest.mock('../utils/execFileAsync');

const mockExecFileAsync = jest.mocked(execFileAsync);

const mockCommitMessage = (message: string): void => {
    mockExecFileAsync.mockResolvedValue({
        stdout: message,
        stderr: '',
    });
};

describe('getBumpType', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it.each(['major', 'minor', 'patch'] as const)(
        'returns %s when bump-type is set explicitly',
        async (bumpType) => {
            const result = await getBumpType(bumpType);

            expect(result).toBe(bumpType);
            expect(mockExecFileAsync).not.toHaveBeenCalled();
        },
    );

    const testCases: Record<string, {
        commitMessage: string,
        expectBumpType: BumpType,
    }> = {
        'infers patch from a non-feat commit message': {
            commitMessage: 'fix: handle null tags',
            expectBumpType: 'patch',
        },
        'infers minor from a feat commit without breaking change': {
            commitMessage: 'feat: add tag listing',
            expectBumpType: 'minor',
        },
        'infers minor from a scoped feat commit': {
            commitMessage: 'feat(api): expose versions',
            expectBumpType: 'minor',
        },
        'infers major from a breaking feat commit': {
            commitMessage: 'feat!: remove legacy tags',
            expectBumpType: 'major',
        },
        'infers major from a scoped breaking feat commit': {
            commitMessage: 'feat(api)!: drop v1 tags',
            expectBumpType: 'major',
        },
    }

    for (const [name, tc] of Object.entries(testCases)) {
        it(name, async () => {
            mockCommitMessage(tc.commitMessage);

            const result = await getBumpType('');

            expect(result).toBe(tc.expectBumpType);
            expect(mockExecFileAsync).toHaveBeenCalledWith(
                'git',
                ['show', '-s', '--format=%s'],
                { encoding: 'utf8' },
            );
        })
    }

    it('calls setFailed and exits on an unrecognized bump-type', async () => {
        const exitSpy = jest
            .spyOn(process, 'exit')
            .mockImplementation((() => {
                throw new Error('process.exit');
            }) as typeof process.exit);

        await expect(getBumpType('nope')).rejects.toThrow('process.exit');

        expect(setFailed).toHaveBeenCalledWith(
            'Unrecognized bump-type: nope',
        );
        expect(mockExecFileAsync).not.toHaveBeenCalled();

        exitSpy.mockRestore();
    });
});
