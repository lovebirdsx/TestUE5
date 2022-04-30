export interface IManager {
    Init: () => void;
    Exit: () => void;
    Tick?: (deltaTime: number) => void;
}
