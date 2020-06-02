# nextjs-project-starter
> Opinionated Yeoman Nextjs project starter

nextjs-init is a Nextjs project template generator. It provides:
- a set of preconfigured libraries
- a preconfigured test environment
- a source code organisation structure
- helpers React components
- basic utilities functions

## Technical stack
- Typescript
- Styled-components
- Jest
- React Testing Library

## Prerequisites
- node latest lts version installed
- yarn installed
- yeoman installed globally: `npm install -g yo` or `yarn global add yo`

## Usage
- Clone this repository on your machine
```bash
git clone https://github.com/humbkr/nextjs-project-starter
```
- Link the generator so you can use it locally
```bash
cd nextjs-project-starter
npm link
```
- Generate a new Nextjs project
-> (don't name your app using dashes (-) )
```bash
yo nextjs-project-starter --force
```
