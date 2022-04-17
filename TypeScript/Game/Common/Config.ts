import { EFileRoot, MyFileHelper } from 'ue';

function getFlowListDir(): string {
    return MyFileHelper.GetPath(EFileRoot.Content, 'Data/FlowList');
}

class GameConfig {
    public readonly FlowListDir = getFlowListDir();

    public readonly FlowListPrefix = '流程_';
}

export const gameConfig = new GameConfig();
