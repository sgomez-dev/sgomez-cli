import chalk from "chalk";
import ora from "ora";

export default {
    info: (msg) => console.log(chalk.blue(msg)),
    success: (msg) => console.log(chalk.green(msg)),
    error: (msg) => console.log(chalk.red(msg)),
    warning: (msg) => console.log(chalk.yellow(msg)),
    spinner: (msg) => ora({ text: msg, color: 'cyan' }).start(),
}