import chalk from "chalk";
import ora from "ora";
import boxen from "boxen";
import gradient from "gradient-string";
import { VERSION } from "./version.js";

const sgomezGradient = gradient([
  "#ff6b6b",
  "#ee5a24",
  "#f9ca24",
  "#6ab04c",
  "#22a6b3",
  "#be2edd",
]);

export default {
  info: (msg) => console.log(chalk.blue(`  ℹ ${msg}`)),
  success: (msg) => console.log(chalk.green(`  ✓ ${msg}`)),
  error: (msg) => console.log(chalk.red(`  ✗ ${msg}`)),
  warn: (msg) => console.log(chalk.yellow(`  ⚠ ${msg}`)),
  dim: (msg) => console.log(chalk.gray(`    ${msg}`)),
  spinner: (msg) => ora({ text: msg, color: "cyan", spinner: "dots" }).start(),

  banner: () => {
    const art = `
  ███████  ██████   ██████  ███    ███ ███████ ███████
  ██      ██       ██    ██ ████  ████ ██         ███
  ███████ ██   ███ ██    ██ ██ ████ ██ █████     ███
       ██ ██    ██ ██    ██ ██  ██  ██ ██       ███
  ███████  ██████   ██████  ██      ██ ███████ ███████`;

    console.log(sgomezGradient(art));
    console.log();
    console.log(
      boxen(
        `${chalk.bold.white("SGOMEZ CLI")} ${chalk.gray(`v${VERSION}`)}\n${chalk.cyan("The Ultimate Developer Toolkit")}`,
        {
          padding: { left: 2, right: 2, top: 0, bottom: 0 },
          margin: { left: 2 },
          borderStyle: "round",
          borderColor: "magenta",
        }
      )
    );
    console.log();
  },

  box: (title, content, color = "green") => {
    console.log(
      boxen(`${chalk.bold(title)}\n\n${content}`, {
        padding: 1,
        margin: { left: 2, top: 1, bottom: 1 },
        borderStyle: "round",
        borderColor: color,
      })
    );
  },

  gradient: (text) => console.log(sgomezGradient(text)),

  table: (rows) => {
    for (const [label, value] of rows) {
      console.log(
        `  ${chalk.gray("│")} ${chalk.bold(label.padEnd(20))} ${value}`
      );
    }
  },
};
