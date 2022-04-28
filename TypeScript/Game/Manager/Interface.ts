import { IGameContext } from '../Interface';

export interface IManager {
    Init: (context: IGameContext) => void;
    Exit: () => void;
    Update?: () => void;
}
