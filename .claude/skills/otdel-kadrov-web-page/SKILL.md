```markdown
# otdel-kadrov-web-page Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches the core development patterns and conventions used in the `otdel-kadrov-web-page` TypeScript codebase. You'll learn about file naming, import/export styles, commit patterns, and how to write and run tests. This guide is ideal for contributors seeking to maintain consistency and efficiency in this project.

## Coding Conventions

### File Naming
- Use **camelCase** for file names.
  - Example: `userProfile.ts`, `employeeList.ts`

### Import Style
- Use **relative imports** for modules within the project.
  - Example:
    ```typescript
    import userService from './userService';
    ```

### Export Style
- Use **default exports** for modules.
  - Example:
    ```typescript
    const userService = { /* ... */ };
    export default userService;
    ```

### Commit Patterns
- Commit messages are **freeform** and typically short (average 9 characters).
  - No enforced prefix or structure.

## Workflows

### Adding a New Module
**Trigger:** When you need to add a new feature or module to the codebase  
**Command:** `/add-module`

1. Create a new file using camelCase naming (e.g., `newFeature.ts`).
2. Implement your module logic.
3. Export the module using a default export.
4. Import the module where needed using a relative import.
5. Add or update corresponding test files (see Testing Patterns).
6. Commit your changes with a concise, descriptive message.

### Writing and Running Tests
**Trigger:** When you add or modify code that requires testing  
**Command:** `/run-tests`

1. Create a test file with the pattern `*.test.*` (e.g., `userProfile.test.ts`).
2. Write your test cases using the project's (unknown) test framework.
3. Run the tests using the project's test runner (refer to project documentation or package scripts).
4. Ensure all tests pass before committing.

## Testing Patterns

- Test files use the pattern: `*.test.*`
  - Example: `employeeList.test.ts`
- The test framework is **unknown** (check project dependencies for details).
- Place test files alongside the modules they test or in a designated test directory.

## Commands
| Command      | Purpose                                      |
|--------------|----------------------------------------------|
| /add-module  | Guide for adding a new module or feature     |
| /run-tests   | Steps for writing and running tests          |
```
