import { SemVer } from "semver";
import { getInput, group, notice } from "@actions/core";
import setOutputVerbose from "./utils/setOutputVerbose";
import steps from './steps'
import type { BumpType } from "./utils/bumpType";
import type { NextTags } from "./utils/nextTags";

const run = async () => {
    const inputBumpType = getInput('bump-type');
    const inputTagPrefix = getInput('tag-prefix');

    const bumpType = await group(
        'Determining bump type',
        async (): Promise<BumpType> => {
            return steps.getBumpType(inputBumpType);
        },
    )

    const relevantTags = await group(
        `Listing tags with prefix '${inputTagPrefix}'`,
        async (): Promise<string[]> => {
            return steps.listTagsWithPrefix(inputTagPrefix);
        }
    )

    const existingVersions: SemVer[] = await group(
        'Parsing versions from tags',
        async (): Promise<SemVer[]> => {
            return await Promise.resolve(
                steps.parseVersionsFromTags(inputTagPrefix, relevantTags),
            );
        },
    )

    const previousVersion: SemVer | null = await group(
        'Determining previous version',
        async (): Promise<SemVer | null> => {
            return await Promise.resolve(
                steps.pickPrevVersion(existingVersions),
            );
        },
    );

    const outputTags: NextTags = await group(
        'Determining next version',
        async (): Promise<NextTags> => {
            return await Promise.resolve(
                steps.pickNextVersion(
                    inputTagPrefix,
                    bumpType,
                    previousVersion,
                ),
            );
        },
    );

    await group(
        'Setting outputs',
        async () => {
            setOutputVerbose('next-patch-tag', outputTags.patchTag);
            setOutputVerbose('next-minor-tag', outputTags.minorTag);
            setOutputVerbose('next-major-tag', outputTags.majorTag);

            if (previousVersion === null) {
                notice('No previous version found, skipping prev-tag output')
            } else {
                setOutputVerbose(
                    'prev-tag',
                    `${inputTagPrefix}${previousVersion.version}`,
                )
            }

            await Promise.resolve();
        },
    )
}

void run();
