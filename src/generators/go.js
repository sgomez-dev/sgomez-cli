import { runCommand } from "../utils/exec.js";
import fs from "fs";
import logger from "../utils/logger.js";

export async function generateGo(options) {
    const { projectName } = options;
    
    try {
        logger.info("Setting up Go project...");
        
        // Crear directorio del proyecto
        await runCommand("mkdir", [projectName]);
        
        // Inicializar módulo Go
        logger.info("Initializing Go module...");
        await runCommand("go", ["mod", "init", projectName], { cwd: projectName });
        
        // Crear main.go con mejor estructura
        const mainCode = `package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	// Simple HTTP server example
	http.HandleFunc("/", homeHandler)
	http.HandleFunc("/health", healthHandler)
	
	port := ":8080"
	fmt.Printf("Server starting on http://localhost%s\\n", port)
	
	if err := http.ListenAndServe(port, nil); err != nil {
		log.Fatal("Server failed to start:", err)
	}
}

func homeHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintf(w, "Hello World from %s!\\n", "${projectName}")
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprint(w, "OK")
}
`;
        
        fs.writeFileSync(`${projectName}/main.go`, mainCode);
        
        // Crear README.md
        const readmeContent = `# ${projectName}

A Go project created with sgomez CLI.

## Getting Started

### Run the application:
\`\`\`bash
go run main.go
\`\`\`

### Build the application:
\`\`\`bash
go build -o ${projectName} main.go
./${projectName}
\`\`\`

### Run tests:
\`\`\`bash
go test ./...
\`\`\`

## Endpoints

- \`GET /\` - Home endpoint
- \`GET /health\` - Health check endpoint

Your Go application will be available at http://localhost:8080
`;
        
        fs.writeFileSync(`${projectName}/README.md`, readmeContent);
        
        // Crear un archivo de test básico
        const testCode = `package main

import (
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestHomeHandler(t *testing.T) {
	req, err := http.NewRequest("GET", "/", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(homeHandler)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}
}

func TestHealthHandler(t *testing.T) {
	req, err := http.NewRequest("GET", "/health", nil)
	if err != nil {
		t.Fatal(err)
	}

	rr := httptest.NewRecorder()
	handler := http.HandlerFunc(healthHandler)
	handler.ServeHTTP(rr, req)

	if status := rr.Code; status != http.StatusOK {
		t.Errorf("handler returned wrong status code: got %v want %v",
			status, http.StatusOK)
	}

	expected := "OK"
	if rr.Body.String() != expected {
		t.Errorf("handler returned unexpected body: got %v want %v",
			rr.Body.String(), expected)
	}
}
`;
        
        fs.writeFileSync(`${projectName}/main_test.go`, testCode);
        
        // Crear .gitignore
        const gitignoreContent = `# Binaries for programs and plugins
*.exe
*.exe~
*.dll
*.so
*.dylib

# Test binary, built with \`go test -c\`
*.test

# Output of the go coverage tool
*.out

# Go workspace file
go.work

# Dependency directories
vendor/

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
`;
        
        fs.writeFileSync(`${projectName}/.gitignore`, gitignoreContent);
        
        console.log(`Go project ${projectName} created successfully!

Next steps:
1. cd ${projectName}
2. go run main.go
3. Visit http://localhost:8080

Project includes:
- HTTP server with basic endpoints
- Unit tests (run with: go test)
- README with usage instructions
- .gitignore file`);
        
    } catch (error) {
        if (error.message.includes('go: command not found') || error.message.includes('ENOENT')) {
            throw new Error(`Go is not installed on your system. Please install Go from https://golang.org/dl/`);
        }
        throw error;
    }
}