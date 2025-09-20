import IConfig from "./IConfig";

export default interface ICustomClient {
    config: IConfig;

    // Functions
    Init(): void;
}