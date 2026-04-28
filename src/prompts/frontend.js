import inquirer from "inquirer";

export async function askFrontend() {
  const { hasFrontend } = await inquirer.prompt({
    type: "confirm",
    name: "hasFrontend",
    message: "Do you want a frontend?",
  });

  if (!hasFrontend) return null;

  const { framework } = await inquirer.prompt({
    type: "list",
    name: "framework",
    message: "Select a frontend framework:",
    choices: [
      "React (Vite)",
      "Next.js",
      "Vue 3 (Vite)",
      "Nuxt 3",
      "SvelteKit",
      "Astro",
      "Remix",
      "Angular",
    ],
  });

  let options = { framework };

  // Language choice (not needed for Angular — always TS, or Nuxt — always TS)
  if (
    [
      "React (Vite)",
      "Next.js",
      "Vue 3 (Vite)",
      "SvelteKit",
      "Astro",
    ].includes(framework)
  ) {
    const { language } = await inquirer.prompt({
      type: "list",
      name: "language",
      message: "Select a language:",
      choices: ["TypeScript", "JavaScript"],
    });
    options.language = language;
  }

  // Framework-specific tools
  const toolChoices = getToolChoices(framework);
  if (toolChoices.length > 0) {
    const { tools } = await inquirer.prompt({
      type: "checkbox",
      name: "tools",
      message: `Select additional tools for ${framework}:`,
      choices: toolChoices,
    });
    options.tools = tools;
  } else {
    options.tools = [];
  }

  return options;
}

function getToolChoices(framework) {
  switch (framework) {
    case "React (Vite)":
      return ["TailwindCSS", "Framer Motion"];
    case "Next.js":
      return ["TailwindCSS", "Framer Motion"];
    case "Vue 3 (Vite)":
      return ["TailwindCSS", "Pinia", "Vue Router"];
    case "Nuxt 3":
      return ["TailwindCSS", "Pinia"];
    case "SvelteKit":
      return ["TailwindCSS"];
    case "Astro":
      return ["TailwindCSS", "React", "Vue", "Svelte"];
    case "Remix":
      return ["TailwindCSS"];
    case "Angular":
      return ["TailwindCSS"];
    default:
      return [];
  }
}
