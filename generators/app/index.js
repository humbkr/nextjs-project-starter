const os = require('os')
const fs = require('fs')
const Generator = require('yeoman-generator')
const commandExistsSync = require('command-exists').sync

const deleteFolderRecursive = function(path) {
  if (fs.existsSync(path)) {
    fs.readdirSync(path).forEach(function(file){
      const curPath = path + "/" + file
      if (fs.lstatSync(curPath).isDirectory()) {
        deleteFolderRecursive(curPath)
      } else {
        fs.unlinkSync(curPath)
      }
    })
    fs.rmdirSync(path)
  }
}

class NextJSProjectStarter extends Generator {
  constructor(args, opts) {
    super(args, opts)
  }

  initializing() {
    this._validateEnvironment()
  }

  async prompting() {
    await this._getProjectInfo()
  }

  configuring() {
    this._initNextJs()
  }

  writing() {
    this._copyStructure()
  }

  install() {
    this._installDependencies()
    this._installLinter()
    this._installTestTools()
  }

  end() {
    this._addToGitIgnore()

    // Clean up useless next.js starter files.
    this.fs.delete(`${this.destinationPath()}/public/favicon.ico`)
    this.fs.delete(`${this.destinationPath()}/public/vercel.svg`)
    // this.fs.delete is apparently not capable of deleting a directory, only the files in it.
    deleteFolderRecursive(`${this.destinationPath()}/pages`)

    this.log("-- Don't forget to have a look at the generated project README.md for manual configuration steps. --")
  }

  _validateEnvironment() {
    let error = false

    const result = this.spawnCommandSync('node', ['-v'], {stdio: [process.stdout]})
    const nodeVersion = result.stdout.toString()
    this.log('Node version is ' + nodeVersion)

    this.log('Checking yarn installation...')
    if (commandExistsSync('yarn')) {
      this.log('DONE')
    } else {
      error = true
      this.log('Error: yarn is not installed. Follow instructions here: https://yarnpkg.com/lang/en/docs/install')
    }

    if (error === true) {
      // Interrupt process.
      this.env.error('Please install the required elements before resuming initialisation.')
    }
  }

  async _getProjectInfo() {
    this.projectInfo = await this.prompt([{
      type: 'input',
      name: 'projectName',
      message: 'Project name:',
    }])
  }

  _initNextJs() {
    this.log(`Initialising a Next.js project in ${this.destinationPath()}/${this.projectInfo.projectName}...`)

    // Use Npx to have the freshest version.
    this.spawnCommandSync('yarn', [`create next-app "${this.projectInfo.projectName}"`], {shell: true, cwd: this.destinationPath()})

    // Change destination folder as it has been created by react-native-cli inside our custom
    // component and not at the root.
    this.destinationRoot(this.projectInfo.projectName)
    this.log('DONE')
  }

  _installLinter() {
    this.log('Setting-up linting tools...')

    // Install linters dependencies.
    this.yarnInstall([
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'babel-plugin-styled-components',
      'eslint',
      'eslint-config-airbnb',
      'eslint-import-resolver-typescript',
      'eslint-plugin-import',
      'eslint-plugin-jest',
      'eslint-plugin-jsx-a11y',
      'eslint-plugin-prettier',
      'eslint-plugin-react',
      'eslint-plugin-react-hooks',
      'prettier',
      'prettier-eslint',
      'prettier-eslint-cli',
      'husky',
      'lint-staged',
    ], { 'dev': true })

    // Add configuration in package.json.
    const pkgJson = {
      "scripts": {
        "dev": "next dev",
        "build": "next build",
        "start": "next start",
        "eslint": "eslint src/",
        "prettier": "prettier --check $PWD/'src/**/*.{js,jsx,ts,tsx,css,md}'",
        "lint": "prettier-eslint --write $PWD/'src/**/*.{js,jsx,ts,tsx,css,md}'",
        "lint-check": "prettier-eslint --list-different $PWD/'src/**/*.{js,jsx,ts,tsx,css,md}'"
      },
      "eslintConfig": {
        "extends": "react-app"
      },
      "husky": {
        "hooks": {
          "pre-commit": "lint-staged"
        }
      },
      "lint-staged": {
        "src/**/*.{js,jsx,ts,tsx,json,css,md}": [
          "eslint",
          "prettier-eslint --write"
        ]
      },
    }

    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson)
    this.log('DONE')
  }

  _installTestTools() {
    this.log('Setting-up tests tools...')

    // Install test env dependencies.
    const testDependencies = [
      '@testing-library/jest-dom',
      '@testing-library/react',
      '@types/jest',
    ]

    this.yarnInstall(testDependencies, {'dev': true})
    this.log('DONE')
  }

  _installDependencies() {
    this.log('Installing project dependencies...')

    // This is a list of basic dependencies used on all projects.
    const dependencies = [
      'normalize.css',
      'sitemap',
      'styled-components',
      'i18n-js',
      'zlib',
    ]

    this.yarnInstall(dependencies)

    // Same with dev dependencies.
    const devDependencies = [
      '@types/node',
      '@types/react',
    ]

    this.yarnInstall(devDependencies, { 'dev': true })

    this.log('DONE')
  }

  _copyStructure() {
    this.log('Copying source structure...')

    this.fs.copy(
      this.templatePath() + '/base',
      this.destinationPath(),
      { globOptions: { dot: true } }
    )

    this.log('DONE')
  }

  _addToGitIgnore() {
    // Should be stored in a file in templates folder but can't make fs.copy()
    // ignore the file...
    this.fs.append(
      this.destinationPath('.gitignore'),
      `# Project${os.EOL}/.env.*${os.EOL}/coverage${os.EOL}${os.EOL}# OS${os.EOL}.DS_Store${os.EOL}${os.EOL}${os.EOL}# IDE${os.EOL}.idea`,
      { separator: os.EOL + os.EOL }
    )
  }
}

module.exports = NextJSProjectStarter
