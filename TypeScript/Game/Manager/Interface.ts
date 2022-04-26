export interface IManager {
    Init: () => void;
    Exit: () => void;
    Update?: () => void;
}
