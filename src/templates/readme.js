export function getReadmeTemplate(project, options = {}) {
  const name = options.name || project.framework || "my-project";
  const language = project.language === "typescript" ? "TypeScript" : "JavaScript";
  const pm = project.packageManager || "npm";
  const pmRun = pm === "npm" ? "npm run" : pm;
  const pmInstall = pm === "npm" ? "npm install" : `${pm} install`;

  let frameworkSection = "";
  if (project.framework) {
    frameworkSection = `\nBuilt with **${capitalize(project.framework)}**`;
    if (project.language) frameworkSection += ` and **${language}**`;
    frameworkSection += ".\n";
  }

  return `# ${name}

${options.description || `A modern ${language} project.`}
${frameworkSection}
## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) >= 18
- [${pm}](https://www.npmjs.com/)

### Installation

\`\`\`bash
git clone <repository-url>
cd ${name}
${pmInstall}
\`\`\`

### Development

\`\`\`bash
${pmRun} dev
\`\`\`

### Build

\`\`\`bash
${pmRun} build
\`\`\`

### Test

\`\`\`bash
${pmRun} test
\`\`\`

## Project Structure

\`\`\`
${name}/
├── src/           # Source code
├── public/        # Static assets
├── package.json
└── README.md
\`\`\`

## Scripts

| Command | Description |
|---|---|
| \`${pmRun} dev\` | Start development server |
| \`${pmRun} build\` | Build for production |
| \`${pmRun} test\` | Run tests |
| \`${pmRun} lint\` | Lint code |

## License

MIT

---

*Generated with [sgomez-cli](https://github.com/sgomez-dev/sgomez-cli)*
`;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
