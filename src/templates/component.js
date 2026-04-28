function pascalCase(str) {
  return str
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ""))
    .replace(/^(.)/, (_, c) => c.toUpperCase());
}

function kebabCase(str) {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase();
}

export function getComponentTemplate(framework, name) {
  const pascal = pascalCase(name);
  const kebab = kebabCase(name);

  switch (framework) {
    case "React (TSX)":
      return {
        filename: `${pascal}.tsx`,
        content: `import { type FC } from "react";

interface ${pascal}Props {
  className?: string;
  children?: React.ReactNode;
}

export const ${pascal}: FC<${pascal}Props> = ({ className = "", children }) => {
  return (
    <div className={\`${kebab} \${className}\`}>
      <h2>${pascal}</h2>
      {children}
    </div>
  );
};

export default ${pascal};
`,
      };

    case "React (JSX)":
      return {
        filename: `${pascal}.jsx`,
        content: `export function ${pascal}({ className = "", children }) {
  return (
    <div className={\`${kebab} \${className}\`}>
      <h2>${pascal}</h2>
      {children}
    </div>
  );
}

export default ${pascal};
`,
      };

    case "Vue 3":
      return {
        filename: `${pascal}.vue`,
        content: `<script setup lang="ts">
defineProps<{
  class?: string;
}>();
</script>

<template>
  <div :class="['${kebab}', $props.class]">
    <h2>${pascal}</h2>
    <slot />
  </div>
</template>

<style scoped>
.${kebab} {
  /* styles */
}
</style>
`,
      };

    case "Svelte":
      return {
        filename: `${pascal}.svelte`,
        content: `<script lang="ts">
  let { class: className = "", children } = $props<{
    class?: string;
    children?: import("svelte").Snippet;
  }>();
</script>

<div class="${kebab} {className}">
  <h2>${pascal}</h2>
  {@render children?.()}
</div>

<style>
  .${kebab} {
    /* styles */
  }
</style>
`,
      };

    default:
      return {
        filename: `${pascal}.tsx`,
        content: `export function ${pascal}() {\n  return <div>${pascal}</div>;\n}\n`,
      };
  }
}
