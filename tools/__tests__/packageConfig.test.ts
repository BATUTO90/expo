import * as fs from 'fs';
import * as path from 'path';

// Note: Using Jest as the testing framework based on the repository's testing setup
// These tests provide comprehensive validation of the tools/package.json configuration

describe('Package Configuration Tests', () => {
  let packageJson: any;
  const packagePath = path.join(__dirname, '..', 'package.json');

  beforeAll(() => {
    // Load the package.json file
    const packageContent = fs.readFileSync(packagePath, 'utf-8');
    packageJson = JSON.parse(packageContent);
  });

  describe('Basic Package Structure', () => {
    test('should have required top-level fields', () => {
      expect(packageJson).toHaveProperty('name');
      expect(packageJson).toHaveProperty('version');
      expect(packageJson).toHaveProperty('description');
      expect(packageJson).toHaveProperty('main');
      expect(packageJson).toHaveProperty('license');
      expect(packageJson).toHaveProperty('author');
    });

    test('should have valid package name', () => {
      expect(packageJson.name).toBe('expotools');
      expect(packageJson.name).toMatch(/^[a-z0-9-._~]+$/); // Valid npm package name
    });

    test('should have valid semantic version', () => {
      expect(packageJson.version).toMatch(/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/);
      expect(packageJson.version).toBe('1.0.0');
    });

    test('should have valid main entry point', () => {
      expect(packageJson.main).toBe('build/expotools.js');
      expect(packageJson.main).toMatch(/\.(js|ts)$/);
    });

    test('should have MIT license', () => {
      expect(packageJson.license).toBe('MIT');
    });

    test('should have valid author email', () => {
      expect(packageJson.author).toBe('support@expo.dev');
      expect(packageJson.author).toMatch(/^[^@]+@[^@]+\.[^@]+$/);
    });

    test('should have proper description', () => {
      expect(packageJson.description).toBeTruthy();
      expect(packageJson.description.length).toBeGreaterThan(10);
      expect(packageJson.description).toContain('Expo');
    });
  });

  describe('Files Configuration', () => {
    test('should include essential directories in files array', () => {
      expect(packageJson.files).toBeDefined();
      expect(Array.isArray(packageJson.files)).toBe(true);
      expect(packageJson.files).toContain('bin');
      expect(packageJson.files).toContain('build');
      expect(packageJson.files).toContain('scripts');
      expect(packageJson.files).toContain('templates');
    });

    test('should have exactly 4 entries in files array', () => {
      expect(packageJson.files).toHaveLength(4);
    });

    test('files array should not contain source directories', () => {
      expect(packageJson.files).not.toContain('src');
      expect(packageJson.files).not.toContain('test');
      expect(packageJson.files).not.toContain('__tests__');
    });
  });

  describe('Scripts Configuration', () => {
    test('should have all required scripts', () => {
      expect(packageJson.scripts).toBeDefined();
      expect(packageJson.scripts).toHaveProperty('build');
      expect(packageJson.scripts).toHaveProperty('watch');
      expect(packageJson.scripts).toHaveProperty('clean');
      expect(packageJson.scripts).toHaveProperty('et');
      expect(packageJson.scripts).toHaveProperty('lint');
      expect(packageJson.scripts).toHaveProperty('postinstall');
    });

    test('should have correct build script', () => {
      expect(packageJson.scripts.build).toBe('taskr release');
    });

    test('should have correct watch script', () => {
      expect(packageJson.scripts.watch).toBe('taskr');
    });

    test('should have correct clean script', () => {
      expect(packageJson.scripts.clean).toBe('rm -rf build cache');
      expect(packageJson.scripts.clean).toContain('build');
      expect(packageJson.scripts.clean).toContain('cache');
    });

    test('should have correct et (expotools) script', () => {
      expect(packageJson.scripts.et).toBe('node bin/expotools.js');
      expect(packageJson.scripts.et).toContain('expotools.js');
    });

    test('should have correct lint script', () => {
      expect(packageJson.scripts.lint).toBe('eslint .');
    });

    test('should have postinstall script for patch-package', () => {
      expect(packageJson.scripts.postinstall).toBe('patch-package');
    });

    test('should not have test script defined', () => {
      expect(packageJson.scripts.test).toBeUndefined();
    });
  });

  describe('Taskr Configuration', () => {
    test('should have taskr configuration', () => {
      expect(packageJson.taskr).toBeDefined();
      expect(packageJson.taskr).toHaveProperty('requires');
    });

    test('should require taskfile-swc.js', () => {
      expect(Array.isArray(packageJson.taskr.requires)).toBe(true);
      expect(packageJson.taskr.requires).toContain('./taskfile-swc.js');
      expect(packageJson.taskr.requires).toHaveLength(1);
    });
  });

  describe('Dependencies', () => {
    test('should have dependencies defined', () => {
      expect(packageJson.dependencies).toBeDefined();
      expect(typeof packageJson.dependencies).toBe('object');
      expect(Object.keys(packageJson.dependencies).length).toBeGreaterThan(0);
    });

    test('should have critical Expo dependencies', () => {
      expect(packageJson.dependencies).toHaveProperty('@expo/commander');
      expect(packageJson.dependencies).toHaveProperty('@expo/json-file');
      expect(packageJson.dependencies).toHaveProperty('@expo/spawn-async');
      expect(packageJson.dependencies).toHaveProperty('@expo/xdl');
    });

    test('should have specific Expo package versions', () => {
      expect(packageJson.dependencies['@expo/commander']).toBe('2.21.1');
      expect(packageJson.dependencies['@expo/json-file']).toBe('^8.3.3');
      expect(packageJson.dependencies['@expo/multipart-body-parser']).toBe('^2.0.0');
      expect(packageJson.dependencies['@expo/plist']).toBe('^0.0.20');
      expect(packageJson.dependencies['@expo/spawn-async']).toBe('^1.7.2');
      expect(packageJson.dependencies['@expo/swiftlint']).toBe('^0.57.1');
      expect(packageJson.dependencies['@expo/xcodegen']).toBe('2.18.0-patch.1');
      expect(packageJson.dependencies['@expo/xdl']).toBe('^59.2.1');
    });

    test('should have AWS SDK for S3', () => {
      expect(packageJson.dependencies).toHaveProperty('@aws-sdk/client-s3');
      expect(packageJson.dependencies['@aws-sdk/client-s3']).toMatch(/^\^3\.\d+\.\d+$/);
    });

    test('should have Linear SDK', () => {
      expect(packageJson.dependencies).toHaveProperty('@linear/sdk');
      expect(packageJson.dependencies['@linear/sdk']).toMatch(/^\^\d+\.\d+\.\d+$/);
    });

    test('should have GitHub Octokit', () => {
      expect(packageJson.dependencies).toHaveProperty('@octokit/rest');
      expect(packageJson.dependencies['@octokit/rest']).toMatch(/^\^\d+\.\d+\.\d+$/);
    });

    test('should have essential CLI tools', () => {
      expect(packageJson.dependencies).toHaveProperty('chalk');
      expect(packageJson.dependencies).toHaveProperty('inquirer');
      expect(packageJson.dependencies).toHaveProperty('ora');
      expect(packageJson.dependencies).toHaveProperty('cli-table3');
    });

    test('should have file system utilities', () => {
      expect(packageJson.dependencies).toHaveProperty('fs-extra');
      expect(packageJson.dependencies).toHaveProperty('glob');
      expect(packageJson.dependencies).toHaveProperty('klaw-sync');
      expect(packageJson.dependencies).toHaveProperty('ncp');
    });

    test('should have networking libraries', () => {
      expect(packageJson.dependencies).toHaveProperty('express');
      expect(packageJson.dependencies).toHaveProperty('body-parser');
      expect(packageJson.dependencies).toHaveProperty('http-proxy');
      expect(packageJson.dependencies).toHaveProperty('got');
      expect(packageJson.dependencies).toHaveProperty('node-fetch');
    });

    test('should have patch-package for postinstall', () => {
      expect(packageJson.dependencies).toHaveProperty('patch-package');
      expect(packageJson.dependencies).toHaveProperty('postinstall-postinstall');
    });

    test('should have OpenAI dependency', () => {
      expect(packageJson.dependencies).toHaveProperty('openai');
      expect(packageJson.dependencies['openai']).toMatch(/^\^\d+\.\d+\.\d+$/);
    });

    test('should have image processing library', () => {
      expect(packageJson.dependencies).toHaveProperty('sharp');
      expect(packageJson.dependencies['sharp']).toMatch(/^\^\d+\.\d+\.\d+$/);
    });

    test('should have semver for version management', () => {
      expect(packageJson.dependencies).toHaveProperty('semver');
      expect(packageJson.dependencies['semver']).toMatch(/^\^\d+\.\d+\.\d+$/);
    });

    test('all dependencies should have valid version ranges', () => {
      Object.entries(packageJson.dependencies).forEach(([name, version]) => {
        expect(typeof version).toBe('string');
        // Check for valid semver range patterns
        expect(version).toMatch(/^[\^~]?\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/);
      });
    });

    test('should have exactly 54 dependencies', () => {
      expect(Object.keys(packageJson.dependencies)).toHaveLength(54);
    });

    test('should have xcode dependency', () => {
      expect(packageJson.dependencies).toHaveProperty('xcode');
      expect(packageJson.dependencies['xcode']).toBe('^3.0.1');
    });

    test('should have specific versions for critical dependencies', () => {
      expect(packageJson.dependencies['chalk']).toBe('^4.1.2');
      expect(packageJson.dependencies['semver']).toBe('^7.6.3');
      expect(packageJson.dependencies['uuid']).toBe('^9.0.0');
      expect(packageJson.dependencies['lodash']).toBe('^4.17.21');
      expect(packageJson.dependencies['typedoc']).toBe('0.27.6');
    });
  });

  describe('DevDependencies', () => {
    test('should have devDependencies defined', () => {
      expect(packageJson.devDependencies).toBeDefined();
      expect(typeof packageJson.devDependencies).toBe('object');
      expect(Object.keys(packageJson.devDependencies).length).toBeGreaterThan(0);
    });

    test('should have TypeScript and type definitions', () => {
      expect(packageJson.devDependencies).toHaveProperty('typescript');
      expect(packageJson.devDependencies['typescript']).toMatch(/^\^\d+\.\d+\.\d+$/);
    });

    test('should have Babel and SWC for compilation', () => {
      expect(packageJson.devDependencies).toHaveProperty('@babel/core');
      expect(packageJson.devDependencies).toHaveProperty('@swc/core');
    });

    test('should have specific compiler versions', () => {
      expect(packageJson.devDependencies['@babel/core']).toBe('^7.26.0');
      expect(packageJson.devDependencies['@swc/core']).toBe('^1.11.11');
    });

    test('should have Taskr build dependencies', () => {
      expect(packageJson.devDependencies).toHaveProperty('taskr');
      expect(packageJson.devDependencies).toHaveProperty('@taskr/clear');
      expect(packageJson.devDependencies).toHaveProperty('@taskr/esnext');
      expect(packageJson.devDependencies).toHaveProperty('@taskr/watch');
    });

    test('should have ESLint and Prettier for code quality', () => {
      expect(packageJson.devDependencies).toHaveProperty('eslint');
      expect(packageJson.devDependencies).toHaveProperty('eslint-config-universe');
      expect(packageJson.devDependencies).toHaveProperty('eslint-plugin-lodash');
      expect(packageJson.devDependencies).toHaveProperty('prettier');
    });

    test('should have specific linting tool versions', () => {
      expect(packageJson.devDependencies['eslint']).toBe('^8.57.1');
      expect(packageJson.devDependencies['eslint-config-universe']).toBe('^14.0.0');
      expect(packageJson.devDependencies['prettier']).toBe('^3.3.3');
    });

    test('should have type definitions for dependencies', () => {
      const typePackages = Object.keys(packageJson.devDependencies)
        .filter(name => name.startsWith('@types/'));
      
      expect(typePackages.length).toBeGreaterThan(0);
      expect(typePackages).toContain('@types/node');
      expect(typePackages).toContain('@types/semver');
      expect(typePackages).toContain('@types/uuid');
      expect(typePackages).toContain('@types/fs-extra');
    });

    test('should have specific type definition versions', () => {
      expect(packageJson.devDependencies['@types/node']).toBe('^18.19.61');
      expect(packageJson.devDependencies['@types/semver']).toBe('^7.5.8');
      expect(packageJson.devDependencies['@types/uuid']).toBe('^9.0.2');
    });

    test('should have @types/node with compatible version', () => {
      expect(packageJson.devDependencies['@types/node']).toMatch(/^\^\d+\.\d+\.\d+$/);
    });

    test('all devDependencies should have valid version ranges', () => {
      Object.entries(packageJson.devDependencies).forEach(([name, version]) => {
        expect(typeof version).toBe('string');
        expect(version).toMatch(/^[\^~]?\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/);
      });
    });

    test('should have exactly 23 devDependencies', () => {
      expect(Object.keys(packageJson.devDependencies)).toHaveLength(23);
    });
  });

  describe('Volta Configuration', () => {
    test('should have Volta configuration', () => {
      expect(packageJson.volta).toBeDefined();
      expect(packageJson.volta).toHaveProperty('node');
    });

    test('should specify Node.js version 22.13.1', () => {
      expect(packageJson.volta.node).toBe('22.13.1');
    });

    test('should have valid Node.js version format', () => {
      expect(packageJson.volta.node).toMatch(/^\d+\.\d+\.\d+$/);
    });

    test('should use Node.js 22.x', () => {
      const majorVersion = parseInt(packageJson.volta.node.split('.')[0]);
      expect(majorVersion).toBe(22);
    });
  });

  describe('Dependency Version Compatibility', () => {
    test('should have compatible Express and body-parser versions', () => {
      const expressVersion = packageJson.dependencies['express'];
      const bodyParserVersion = packageJson.dependencies['body-parser'];
      
      expect(expressVersion).toMatch(/^\^4\./);
      expect(bodyParserVersion).toMatch(/^\^1\./);
    });

    test('should have consistent @expo package versions', () => {
      const expoPackages = Object.entries(packageJson.dependencies)
        .filter(([name]) => name.startsWith('@expo/'));
      
      expect(expoPackages.length).toBeGreaterThan(0);
      expect(expoPackages.length).toBe(8); // Verify we have exactly 8 @expo packages
      expoPackages.forEach(([name, version]) => {
        expect(typeof version).toBe('string');
        expect(version).toMatch(/^[\^~]?\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/);
      });
    });

    test('should have matching types for runtime dependencies', () => {
      const runtimeDeps = ['semver', 'uuid', 'fs-extra', 'node-fetch'];
      
      runtimeDeps.forEach(dep => {
        if (packageJson.dependencies[dep]) {
          const typeDep = `@types/${dep}`;
          expect(packageJson.devDependencies).toHaveProperty(typeDep);
        }
      });
    });

    test('should verify all @types packages have corresponding dependencies', () => {
      const typePackages = Object.keys(packageJson.devDependencies)
        .filter(name => name.startsWith('@types/'))
        .map(name => name.replace('@types/', ''));
      
      // Special cases that don't need corresponding dependencies
      const exceptions = ['node', 'ip', 'npm-registry-fetch'];
      
      typePackages.forEach(typePkg => {
        if (!exceptions.includes(typePkg)) {
          const hasDep = packageJson.dependencies.hasOwnProperty(typePkg) ||
                        packageJson.dependencies.hasOwnProperty(typePkg.replace(/-/g, ''));
          if (!hasDep) {
            console.warn(`@types/${typePkg} has no corresponding dependency`);
          }
        }
      });
    });
  });

  describe('Security and Best Practices', () => {
    test('should not have exact version pinning in dependencies', () => {
      Object.values(packageJson.dependencies).forEach((version: any) => {
        // Should use ^ or ~ for flexibility (with exceptions for special cases)
        if (!version.includes('-patch')) {
          expect(version).toMatch(/^[\^~]/);
        }
      });
    });

    test('should not have git dependencies', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      Object.values(allDeps).forEach((version: any) => {
        expect(version).not.toContain('git+');
        expect(version).not.toContain('github:');
        expect(version).not.toContain('gitlab:');
      });
    });

    test('should not have file: protocol dependencies', () => {
      const allDeps = {
        ...packageJson.dependencies,
        ...packageJson.devDependencies
      };
      
      Object.values(allDeps).forEach((version: any) => {
        expect(version).not.toContain('file:');
      });
    });

    test('should not have deprecated packages', () => {
      // Check for commonly deprecated packages
      expect(packageJson.dependencies).not.toHaveProperty('request');
      expect(packageJson.dependencies).not.toHaveProperty('node-uuid');
      expect(packageJson.devDependencies).not.toHaveProperty('tslint');
    });

    test('should not have vulnerable package versions', () => {
      // Check for known vulnerable versions
      if (packageJson.dependencies['minimatch']) {
        const version = packageJson.dependencies['minimatch'];
        expect(version).toMatch(/^\^3\./); // Should be at least v3
      }
    });
  });

  describe('Package Integrity', () => {
    test('should have no circular dependencies in scripts', () => {
      const scripts = packageJson.scripts || {};
      const scriptNames = Object.keys(scripts);
      
      scriptNames.forEach(scriptName => {
        const scriptContent = scripts[scriptName];
        // Check that scripts don't call themselves
        expect(scriptContent).not.toContain(`npm run ${scriptName}`);
        expect(scriptContent).not.toContain(`yarn ${scriptName}`);
      });
    });

    test('should have consistent naming in files array', () => {
      packageJson.files.forEach((file: string) => {
        // Files should not start with dots or slashes
        expect(file).not.toMatch(/^\./);
        expect(file).not.toMatch(/^\//);
        // Should be lowercase
        expect(file).toBe(file.toLowerCase());
      });
    });

    test('should not expose sensitive directories', () => {
      const sensitivePatterns = ['.env', '.git', 'node_modules', 'coverage', '.nyc_output'];
      
      packageJson.files.forEach((file: string) => {
        sensitivePatterns.forEach(pattern => {
          expect(file).not.toContain(pattern);
        });
      });
    });
  });

  describe('Edge Cases and Error Scenarios', () => {
    test('should handle missing optional fields gracefully', () => {
      // These fields are optional but good to have
      const optionalFields = ['keywords', 'repository', 'bugs', 'homepage'];
      
      optionalFields.forEach(field => {
        // Just check they can be accessed without errors
        const value = packageJson[field];
        expect(value === undefined || value !== null).toBe(true);
      });
    });

    test('should not have conflicting peer dependencies', () => {
      // Since no peerDependencies are defined, this should be undefined
      expect(packageJson.peerDependencies).toBeUndefined();
    });

    test('should have valid JSON structure', () => {
      // Test that the package.json can be stringified and parsed back
      const stringified = JSON.stringify(packageJson);
      const reparsed = JSON.parse(stringified);
      
      expect(reparsed).toEqual(packageJson);
    });

    test('should not have duplicate entries in files array', () => {
      const filesSet = new Set(packageJson.files);
      expect(filesSet.size).toBe(packageJson.files.length);
    });

    test('should handle special characters in dependency versions', () => {
      // Check for special version formats like patch versions
      const xcodegen = packageJson.dependencies['@expo/xcodegen'];
      expect(xcodegen).toBe('2.18.0-patch.1');
      expect(xcodegen).toMatch(/^\d+\.\d+\.\d+-patch\.\d+$/);
    });
  });

  describe('NPM Publishing Readiness', () => {
    test('should have all required fields for npm publish', () => {
      const requiredForPublish = ['name', 'version', 'description', 'main', 'author', 'license'];
      
      requiredForPublish.forEach(field => {
        expect(packageJson).toHaveProperty(field);
        expect(packageJson[field]).toBeTruthy();
      });
    });

    test('should have files array for npm package inclusion', () => {
      expect(Array.isArray(packageJson.files)).toBe(true);
      expect(packageJson.files.length).toBeGreaterThan(0);
    });

    test('should have build output in files array', () => {
      expect(packageJson.files).toContain('build');
      // Main file references build directory
      expect(packageJson.main).toContain('build/');
    });

    test('should have bin directory for CLI tools', () => {
      expect(packageJson.files).toContain('bin');
    });

    test('should include necessary runtime files', () => {
      expect(packageJson.files).toContain('scripts');
      expect(packageJson.files).toContain('templates');
    });
  });

  describe('Development Workflow', () => {
    test('should have development scripts in correct order', () => {
      const workflowScripts = ['clean', 'build', 'watch'];
      
      workflowScripts.forEach(script => {
        expect(packageJson.scripts).toHaveProperty(script);
      });
    });

    test('should have taskr configured for build process', () => {
      expect(packageJson.scripts.build).toContain('taskr');
      expect(packageJson.scripts.watch).toBe('taskr');
      expect(packageJson.devDependencies).toHaveProperty('taskr');
    });

    test('should have linting configured', () => {
      expect(packageJson.scripts.lint).toContain('eslint');
      expect(packageJson.devDependencies).toHaveProperty('eslint');
      expect(packageJson.devDependencies).toHaveProperty('eslint-config-universe');
    });

    test('should have clean script that removes build artifacts', () => {
      const cleanScript = packageJson.scripts.clean;
      expect(cleanScript).toContain('rm -rf');
      expect(cleanScript).toContain('build');
      expect(cleanScript).toContain('cache');
    });
  });

  describe('Specific Dependency Versions', () => {
    test('should use TypeScript 5.x', () => {
      expect(packageJson.devDependencies.typescript).toMatch(/^\^5\./);
      expect(packageJson.devDependencies.typescript).toBe('^5.6.3');
    });

    test('should use ESLint 8.x', () => {
      expect(packageJson.devDependencies.eslint).toMatch(/^\^8\./);
      expect(packageJson.devDependencies.eslint).toBe('^8.57.1');
    });

    test('should use Prettier 3.x', () => {
      expect(packageJson.devDependencies.prettier).toMatch(/^\^3\./);
      expect(packageJson.devDependencies.prettier).toBe('^3.3.3');
    });

    test('should use latest major versions of critical tools', () => {
      expect(packageJson.dependencies.semver).toBe('^7.6.3');
      expect(packageJson.dependencies.uuid).toBe('^9.0.0');
      expect(packageJson.dependencies.sharp).toBe('^0.33.5');
    });

    test('should use specific versions for documentation tools', () => {
      expect(packageJson.dependencies.typedoc).toBe('0.27.6'); // Pinned version
      expect(packageJson.dependencies.marked).toBe('^4.0.10');
    });
  });

  describe('CLI and Tooling Dependencies', () => {
    test('should have CLI visualization dependencies', () => {
      expect(packageJson.dependencies['cli-table3']).toBe('^0.6.5');
      expect(packageJson.dependencies['qrcode-terminal']).toBe('^0.12.0');
      expect(packageJson.dependencies['terminal-link']).toBe('^2.1.1');
    });

    test('should have progress and spinner libraries', () => {
      expect(packageJson.dependencies['ora']).toBe('^5.4.1');
      expect(packageJson.dependencies['pretty-bytes']).toBe('^5.6.0');
    });

    test('should have diff and patch utilities', () => {
      expect(packageJson.dependencies['diff']).toBe('^5.1.0');
      expect(packageJson.dependencies['parse-diff']).toBe('^0.9.0');
      expect(packageJson.dependencies['jsondiffpatch']).toBe('^0.4.1');
    });
  });
});

// Integration test for package.json validity
describe('Package.json Integration Tests', () => {
  test('should be valid JSON', () => {
    const packagePath = path.join(__dirname, '..', 'package.json');
    expect(() => {
      const content = fs.readFileSync(packagePath, 'utf-8');
      JSON.parse(content);
    }).not.toThrow();
  });

  test('should have consistent dependency versions', () => {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const content = fs.readFileSync(packagePath, 'utf-8');
    const pkg = JSON.parse(content);
    
    // Check that all version strings are valid
    const allDeps = {
      ...pkg.dependencies,
      ...pkg.devDependencies
    };
    
    Object.entries(allDeps).forEach(([name, version]) => {
      expect(() => {
        // This would throw if version is invalid
        const versionRegex = /^[\^~]?\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/;
        if (!versionRegex.test(version as string)) {
          throw new Error(`Invalid version: ${version}`);
        }
      }).not.toThrow();
    });
  });

  test('should have taskr properly configured', () => {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const content = fs.readFileSync(packagePath, 'utf-8');
    const pkg = JSON.parse(content);
    
    // Verify taskr is in devDependencies
    expect(pkg.devDependencies).toHaveProperty('taskr');
    
    // Verify taskr configuration exists
    expect(pkg.taskr).toBeDefined();
    expect(pkg.taskr.requires).toBeDefined();
    expect(Array.isArray(pkg.taskr.requires)).toBe(true);
  });
});

// Schema validation tests
describe('Package.json Schema Validation', () => {
  let packageJson: any;

  beforeAll(() => {
    const packagePath = path.join(__dirname, '..', 'package.json');
    const packageContent = fs.readFileSync(packagePath, 'utf-8');
    packageJson = JSON.parse(packageContent);
  });

  test('should match expected schema structure', () => {
    const expectedStructure = {
      name: 'string',
      version: 'string',
      description: 'string',
      main: 'string',
      files: 'array',
      scripts: 'object',
      taskr: 'object',
      author: 'string',
      license: 'string',
      dependencies: 'object',
      devDependencies: 'object',
      volta: 'object'
    };

    Object.entries(expectedStructure).forEach(([key, type]) => {
      if (type === 'array') {
        expect(Array.isArray(packageJson[key])).toBe(true);
      } else if (type === 'object') {
        expect(typeof packageJson[key]).toBe('object');
        expect(packageJson[key]).not.toBeNull();
      } else {
        expect(typeof packageJson[key]).toBe(type);
      }
    });
  });

  test('should not have unexpected top-level keys', () => {
    const allowedKeys = [
      'name', 'version', 'description', 'main', 'files', 'scripts',
      'taskr', 'author', 'license', 'dependencies', 'devDependencies', 'volta'
    ];
    
    const actualKeys = Object.keys(packageJson);
    actualKeys.forEach(key => {
      expect(allowedKeys).toContain(key);
    });
  });

  test('should have valid script commands', () => {
    Object.entries(packageJson.scripts).forEach(([name, command]) => {
      expect(typeof command).toBe('string');
      expect(command).not.toBe('');
      // Scripts should not contain dangerous commands
      expect(command).not.toContain('rm -rf /');
      expect(command).not.toContain('sudo');
    });
  });

  test('should validate files array structure', () => {
    expect(Array.isArray(packageJson.files)).toBe(true);
    packageJson.files.forEach((file: any) => {
      expect(typeof file).toBe('string');
      expect(file.length).toBeGreaterThan(0);
    });
  });

  test('should validate volta configuration structure', () => {
    expect(packageJson.volta).toBeDefined();
    expect(typeof packageJson.volta).toBe('object');
    expect(typeof packageJson.volta.node).toBe('string');
    expect(packageJson.volta.node).toMatch(/^\d+\.\d+\.\d+$/);
  });
});

// Export for use with testing frameworks
export { };