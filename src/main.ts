import { getInput, setOutput } from "@actions/core";
import getBumpType from "./steps/getBumpType"
import getPrevVersion from "./steps/getPrevVersion";
import getNextVersion from "./steps/getNextVersion";

const run = async () => {
    const inputBumpType = getInput('bump-type');
    const inputTagPrefix = getInput('tag-prefix');

    const bumpType = await getBumpType(inputBumpType);
    const previousVersion = await getPrevVersion(inputTagPrefix);
    const outputTags = getNextVersion(inputTagPrefix, bumpType, previousVersion);

    if (previousVersion != null) {
        setOutput('prev-tag', `${inputTagPrefix}${previousVersion.toString()}`)
    }
    
    setOutput('next-patch-tag', outputTags.patchTag);
    setOutput('next-minor-tag', outputTags.minorTag);
    setOutput('next-major-tag', outputTags.majorTag);
}

run()
