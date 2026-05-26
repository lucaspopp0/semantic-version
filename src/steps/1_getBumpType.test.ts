import { setFailed } from '@actions/core';
import getBumpType from './1_getBumpType';
import execFileAsync from '../utils/execFileAsync';

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

    it('infers patch from a non-feat commit message', async () => {
        mockCommitMessage('fix: handle null tags');

        const result = await getBumpType('');

        expect(result).toBe('patch');
        expect(mockExecFileAsync).toHaveBeenCalledWith(
            'git',
            ['show', '-s', '--format=%s'],
            { encoding: 'utf8' },
        );
    });

    it('infers minor from a feat commit without breaking change', async () => {
        mockCommitMessage('feat: add tag listing');

        const result = await getBumpType('');

        expect(result).toBe('minor');
    });

    it('infers minor from a scoped feat commit', async () => {
        mockCommitMessage('feat(api): expose versions');

        const result = await getBumpType('');

        expect(result).toBe('minor');
    });

    it('infers major from a breaking feat commit', async () => {
        mockCommitMessage('feat!: remove legacy tags');

        const result = await getBumpType('');

        expect(result).toBe('major');
    });

    it('infers major from a scoped breaking feat commit', async () => {
        mockCommitMessage('feat(api)!: drop v1 tags');

        const result = await getBumpType('');

        expect(result).toBe('major');
    });

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
