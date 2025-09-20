import CommandHandler from "../class/CommandsHandler";
import IConfig from "./IConfig";

export default interface ICustomClient {
  config: IConfig;

  // Commands
  commandHandler: CommandHandler;

  // Functions
  Init(): void;
}
