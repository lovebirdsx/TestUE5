/* eslint-disable spellcheck/spell-checker */
import { IActionInfo, TActionType } from '../../../../Game/Flow/Action';
import { error, log } from '../../Log';
import {
    allObjectFilter,
    checkFields,
    createDynamicType,
    EObjectFilter,
    fixFileds,
    IAbstractType,
    TDynamicObjectType,
    TFixResult,
    TObjectType,
} from '../Type';
import { playFlowScheme } from './Flow';
import { jumpTalkScheme } from './JumpTalk';
import { logScheme, showMssageScheme, waitScheme } from './Misc';
import { setCameraModeScheme, setFlowBoolOptionScheme, setPlotModeScheme } from './PlotNode';
import { playSequenceDataScheme } from './Sequence';
import { showOptionScheme, showTalkScheme } from './ShowTalk';
import { showCenterTextScheme } from './ShowText';
import { changeRandomStateScheme, changeStateScheme, finishStateScheme } from './State';

export * from '../Type';

const actionSchemeMap: { [key in TActionType]: TObjectType<unknown> } = {
    ChangeState: changeStateScheme as TObjectType<unknown>,
    ChangeRandomState: changeRandomStateScheme as TObjectType<unknown>,
    FinishState: finishStateScheme as TObjectType<unknown>,
    JumpTalk: jumpTalkScheme as TObjectType<unknown>,
    Log: logScheme as TObjectType<unknown>,
    PlayFlow: playFlowScheme as TObjectType<unknown>,
    PlaySequenceData: playSequenceDataScheme as TObjectType<unknown>,
    SetCameraMode: setCameraModeScheme as TObjectType<unknown>,
    SetFlowBoolOption: setFlowBoolOptionScheme as TObjectType<unknown>,
    SetPlotMode: setPlotModeScheme as TObjectType<unknown>,
    ShowCenterText: showCenterTextScheme as TObjectType<unknown>,
    ShowMessage: showMssageScheme as TObjectType<unknown>,
    ShowOption: showOptionScheme as TObjectType<unknown>,
    ShowTalk: showTalkScheme as TObjectType<unknown>,
    Wait: waitScheme as TObjectType<unknown>,
};

function createActionNamesByfilter(): Map<EObjectFilter, TActionType[]> {
    const map = new Map<EObjectFilter, TActionType[]>();
    for (const typeName in actionSchemeMap) {
        const typeData = (actionSchemeMap as Record<string, TObjectType<unknown>>)[typeName];
        typeData.Filters.forEach((filter) => {
            let names = map.get(filter);
            if (!names) {
                names = [];
                map.set(filter, names);
            }

            names.push(typeName as TActionType);
        });
    }
    return map;
}

function createDynamicObjectSchemeMap(): Map<EObjectFilter, TDynamicObjectType> {
    const result: Map<EObjectFilter, TDynamicObjectType> = new Map();
    allObjectFilter.forEach((objectFilter) => {
        const type = createDynamicType(objectFilter, {
            Meta: {
                NewLine: true,
            },
        });
        result.set(objectFilter, type);
    });
    return result;
}

class Scheme {
    private readonly ActionNamesByfilter: Map<EObjectFilter, TActionType[]>;

    private readonly DynamicObjectSchemeMap: Map<EObjectFilter, TDynamicObjectType>;

    public constructor() {
        this.ActionNamesByfilter = createActionNamesByfilter();
        this.DynamicObjectSchemeMap = createDynamicObjectSchemeMap();
    }

    public GetScheme(name: string): TObjectType<unknown> {
        const as = (actionSchemeMap as Record<string, TObjectType<unknown>>)[name];
        if (!as) {
            error(`No action scheme for ${name}`);
        }
        return as;
    }

    public SpawnAction(name: TActionType): IActionInfo {
        const as = actionSchemeMap[name];
        return {
            Name: name,
            Params: as.CreateDefault(undefined),
        };
    }

    public SpawnDefaultAction(filter: EObjectFilter): IActionInfo {
        const actionName = this.ActionNamesByfilter.get(filter)[0];
        const as = actionSchemeMap[actionName];
        return {
            Name: actionName,
            Params: as.CreateDefault(undefined),
        };
    }

    public GetActionNames(filter: EObjectFilter): TActionType[] {
        return this.ActionNamesByfilter.get(filter);
    }

    public IsFolderAble(scheme: IAbstractType<unknown>): boolean {
        return scheme.Meta.NewLine;
    }

    public FixAction(action: IActionInfo, objectFilter?: EObjectFilter): TFixResult {
        const typeData = this.GetScheme(action.Name);
        if (!typeData) {
            Object.assign(action, this.SpawnDefaultAction(objectFilter || EObjectFilter.FlowList));
            return 'fixed';
        }

        const old = JSON.stringify(action.Params);
        const result = fixFileds(action.Params, typeData.Fields);
        if (result === 'fixed') {
            log(`Fix action [${action.Name}]: from ${old} => ${JSON.stringify(action.Params)}`);
        }
        return result;
    }

    public CheckAction(action: IActionInfo, errorMessages: string[]): number {
        const typeData = this.GetScheme(action.Name);
        if (!typeData) {
            throw new Error(`Check action error: no scheme for name ${action.Name}`);
        }

        const errorMessages1 = [] as string[];
        checkFields(action.Params, typeData.Fields, errorMessages1);
        errorMessages1.forEach((msg) => {
            errorMessages.push(`[${action.Name}]${msg}`);
        });
        return errorMessages1.length;
    }

    public GetDynamicObjectScheme(objectFilter: EObjectFilter): TDynamicObjectType {
        return this.DynamicObjectSchemeMap.get(objectFilter);
    }
}

export const scheme = new Scheme();
