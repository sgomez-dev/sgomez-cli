export function getLintTemplate(project) {
  const isTS = project.hasTsConfig;
  const devDeps = ["eslint", "prettier", "eslint-config-prettier"];

  if (isTS) {
    devDeps.push("@typescript-eslint/parser", "@typescript-eslint/eslint-plugin");
  }

  const eslint = JSON.stringify(
    {
      env: {
        browser: true,
        es2024: true,
        node: true,
      },
      extends: [
        "eslint:recommended",
        ...(isTS ? ["plugin:@typescript-eslint/recommended"] : []),
        "prettier",
      ],
      ...(isTS
        ? { parser: "@typescript-eslint/parser" }
        : {}),
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
      rules: {
        "no-unused-vars": isTS ? "off" : "warn",
        ...(isTS
          ? { "@typescript-eslint/no-unused-vars": "warn" }
          : {}),
        "no-console": "warn",
      },
    },
    null,
    2
  );

  const prettier = JSON.stringify(
    {
      semi: true,
      singleQuote: false,
      tabWidth: 2,
      trailingComma: "es5",
      printWidth: 100,
      bracketSpacing: true,
      arrowParens: "always",
    },
    null,
    2
  );

  const editorconfig = `root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.md]
trim_trailing_whitespace = false

[*.{yml,yaml}]
indent_size = 2

[Makefile]
indent_style = tab
`;

  return {
    eslint,
    prettier,
    editorconfig,
    devDeps,
  };
}
