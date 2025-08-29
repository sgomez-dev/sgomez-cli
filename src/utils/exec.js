import execa from 'execa';

export async function runCommand(command, args, options = {}) {
    try {
        await execa(command, args, { stdio: "inherit", ...options});
    } catch (error) {
        throw new Error(`Command "${command} ${args.join(' ')}" failed with error: ${error.message}`);
    }
}