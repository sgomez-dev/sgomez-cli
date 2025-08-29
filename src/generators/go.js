import { runCommand } from "../utils/exec.js";
import fs from "fs";

export async function generateGo(options) {
  const { projectName } = options;

  await runCommand("mkdir", [projectName]);
  await runCommand("go", ["mod", "init", projectName], { cwd: projectName });

  const mainCode = `package main

import "fmt"

func main() {
    fmt.Println("Hello World!")
}
`;

  fs.writeFileSync(`${projectName}/main.go`, mainCode);

  console.log(`Go project ${projectName} created successfully!`);
}