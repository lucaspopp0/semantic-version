import { info, setOutput } from '@actions/core';

const setOutputVerbose = (name: string, value: string): void => {
    setOutput(name, value)
    info(`Output '${name}' set to '${JSON.stringify(value)}'`)
}

export default setOutputVerbose;
