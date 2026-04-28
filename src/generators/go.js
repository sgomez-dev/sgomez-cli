import { runCommand } from "../utils/exec.js";
import fs from "fs";
import path from "path";
import logger from "../utils/logger.js";

export async function generateGo(options) {
  const { projectName } = options;

  const spinner = logger.spinner("Setting up Go project...");

  fs.mkdirSync(projectName, { recursive: true });

  await runCommand("go", ["mod", "init", projectName], { cwd: projectName });

  const mainCode = `package main

import (
\t"fmt"
\t"log"
\t"net/http"
)

func main() {
\thttp.HandleFunc("/", homeHandler)
\thttp.HandleFunc("/health", healthHandler)

\tport := ":8080"
\tfmt.Printf("Server starting on http://localhost%s\\n", port)

\tif err := http.ListenAndServe(port, nil); err != nil {
\t\tlog.Fatal("Server failed to start:", err)
\t}
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
\tw.Header().Set("Content-Type", "application/json")
\tfmt.Fprintf(w, \`{"message": "Hello from %s!"}\`, "${projectName}")
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
\tw.Header().Set("Content-Type", "application/json")
\tw.WriteHeader(http.StatusOK)
\tfmt.Fprint(w, \`{"status": "ok"}\`)
}
`;

  const testCode = `package main

import (
\t"net/http"
\t"net/http/httptest"
\t"testing"
)

func TestHomeHandler(t *testing.T) {
\treq, err := http.NewRequest("GET", "/", nil)
\tif err != nil {
\t\tt.Fatal(err)
\t}
\trr := httptest.NewRecorder()
\thandler := http.HandlerFunc(homeHandler)
\thandler.ServeHTTP(rr, req)
\tif status := rr.Code; status != http.StatusOK {
\t\tt.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
\t}
}

func TestHealthHandler(t *testing.T) {
\treq, err := http.NewRequest("GET", "/health", nil)
\tif err != nil {
\t\tt.Fatal(err)
\t}
\trr := httptest.NewRecorder()
\thandler := http.HandlerFunc(healthHandler)
\thandler.ServeHTTP(rr, req)
\tif status := rr.Code; status != http.StatusOK {
\t\tt.Errorf("handler returned wrong status code: got %v want %v", status, http.StatusOK)
\t}
\texpected := \`{"status": "ok"}\`
\tif rr.Body.String() != expected {
\t\tt.Errorf("handler returned unexpected body: got %v want %v", rr.Body.String(), expected)
\t}
}
`;

  const readmeContent = `# ${projectName}

A Go project created with **SGOMEZ CLI**.

## Setup

\`\`\`bash
go run main.go         # Run
go build -o app .      # Build
go test ./...          # Test
\`\`\`

Open http://localhost:8080
`;

  const gitignoreContent = `*.exe\n*.exe~\n*.dll\n*.so\n*.dylib\n*.test\n*.out\nvendor/\n.env\n.DS_Store\n`;

  fs.writeFileSync(path.join(projectName, "main.go"), mainCode);
  fs.writeFileSync(path.join(projectName, "main_test.go"), testCode);
  fs.writeFileSync(path.join(projectName, "README.md"), readmeContent);
  fs.writeFileSync(path.join(projectName, ".gitignore"), gitignoreContent);

  spinner.succeed("Go project created");
  logger.success(`Go project '${projectName}' created successfully.`);
}
