import { World } from 'ue';

export interface IManager {
    Init: (world: World) => void;
    Exit: () => void;
    Update?: () => void;
}
