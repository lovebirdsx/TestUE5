/* eslint-disable spellcheck/spell-checker */
/* eslint-disable @typescript-eslint/no-magic-numbers */
import { EFileRoot, MyFileHelper } from 'ue';

import { error } from '../../../Common/Log';
import { readJsonObj, writeJson } from '../../../Common/Util';

interface IGameIdGeneratorSnapshot {
    LastGenId: number;
    Ids: number[];
}

export const MIN_GAME_GEN_ID = 0xffffffff / 2 + 1;
export const MAX_GAME_GEN_ID = 0xffffffff - 1;
const defaultSnapshot: IGameIdGeneratorSnapshot = {
    LastGenId: MIN_GAME_GEN_ID - 1,
    Ids: [],
};

export class GameIdAllocator {
    public static GetSavePath(name: string): string {
        const baseDir = MyFileHelper.GetPath(EFileRoot.Save, 'Game/Generator');
        return `${baseDir}/${name}.json`;
    }

    public static LoadSnapshot(name: string): IGameIdGeneratorSnapshot {
        return readJsonObj(this.GetSavePath(name), defaultSnapshot);
    }

    public static SaveSnapshot(name: string, snapshot: IGameIdGeneratorSnapshot): void {
        writeJson(snapshot, this.GetSavePath(name));
    }

    public static IsIdInAllocRange(id: number): boolean {
        return MIN_GAME_GEN_ID <= id && id <= MAX_GAME_GEN_ID;
    }

    private readonly Name: string;

    private GeneratedIds: Set<number>;

    private LastGenId: number;

    public constructor(name: string) {
        this.Name = name;
        this.Reset();
    }

    public get AllocCount(): number {
        return this.GeneratedIds.size;
    }

    public Load(): void {
        const snapshot = GameIdAllocator.LoadSnapshot(this.Name);
        this.LastGenId = snapshot.LastGenId;
        this.GeneratedIds = new Set(snapshot.Ids);
    }

    public Save(): void {
        const snapshot: IGameIdGeneratorSnapshot = {
            LastGenId: this.LastGenId,
            Ids: Array.from(this.GeneratedIds),
        };
        GameIdAllocator.SaveSnapshot(this.Name, snapshot);
    }

    public Reset(): void {
        this.LastGenId = defaultSnapshot.LastGenId;
        this.GeneratedIds = new Set(defaultSnapshot.Ids);
    }

    public SetLastGenId(id: number): void {
        this.LastGenId = id;
    }

    public Alloc(): number {
        while (true) {
            this.LastGenId++;
            if (this.LastGenId > MAX_GAME_GEN_ID) {
                this.LastGenId = MIN_GAME_GEN_ID;
            }
            if (!this.GeneratedIds.has(this.LastGenId)) {
                this.GeneratedIds.add(this.LastGenId);
                break;
            }
        }
        return this.LastGenId;
    }

    public Free(id: number): void {
        if (!GameIdAllocator.IsIdInAllocRange(id)) {
            throw new Error(`GameIdAllocator[${this.Name}] free invalid id [${id}]`);
        }

        if (!this.GeneratedIds.delete(id)) {
            error(`GameIdAllocator[${this.Name}] Free no exist id [${id}]`);
        }
    }
}

export const entityIdAllocator = new GameIdAllocator('entity');

class EntityOp {}

export const entityOp = new EntityOp();
