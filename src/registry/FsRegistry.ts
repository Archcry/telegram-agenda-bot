import * as fs from 'fs/promises';

class FsRegistry {
  private fsImpl: any;
  private registryFilePath: string;

  constructor(registryFilePath: string) {
    this.fsImpl;
    this.registryFilePath = registryFilePath;
  }

  public async save(key: string, obj: any) {
    return this.readFileNoFail(this.registryFilePath, JSON.stringify({}))
      .then(string => JSON.parse(string))
      .then(registryObj => Object.assign({}, registryObj, { [key]: obj }))
      .then(registryObj => JSON.stringify(registryObj))
      .then(string => fs.writeFile(this.registryFilePath, string));
  }

  public get(key: string) {
    return this.readFileNoFail(this.registryFilePath, JSON.stringify({}))
      .then(string => JSON.parse(string))
      .then(registryObj => registryObj[key]);
  }

  private readFileNoFail(filePath: string, defaultValue: string) {
    return fs.readFile(filePath, 'utf-8')
      .catch(e => Promise.resolve(defaultValue));
  }
}

export default FsRegistry;
