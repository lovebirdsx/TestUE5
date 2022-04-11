/* eslint-disable spellcheck/spell-checker */
import { IActionInfo, TActionType } from '../../../../Game/Flow/Action';
import { error, log } from '../../Log';
import {
    fixFileds,
    IAbstractType,
    normalActionScheme,
    TDynamicObjectType,
    TFixResult,
    TObjectFilter,
    TObjectType,
} from '../Type';
import { jumpTalkScheme } from './JumpTalk';
import { logScheme, showMssageScheme, waitScheme } from './Misc';
import { setCameraModeScheme, setFlowBoolOptionScheme, setPlotModeScheme } from './PlotNode';
import { playSequenceDataScheme } from './Sequence';
import { showOptionScheme, showTalkScheme } from './ShowTalk';
import { changeRandomStateScheme, changeStateScheme, finishStateScheme } from './State';

export * from '../Type';

const actionSchemeMap: { [key in TActionType]: TObjectType<unknown> } = {
    ChangeState: changeStateScheme as TObjectType<unknown>,
    ChangeRandomState: changeRandomStateScheme as TObjectType<unknown>,
    FinishState: finishStateScheme as TObjectType<unknown>,
    JumpTalk: jumpTalkScheme as TObjectType<unknown>,
    Log: logScheme as TObjectType<unknown>,
    PlaySequenceData: playSequenceDataScheme as TObjectType<unknown>,
    SetCameraMode: setCameraModeScheme as TObjectType<unknown>,
    SetFlowBoolOption: setFlowBoolOptionScheme as TObjectType<unknown>,
    SetPlotMode: setPlotModeScheme as TObjectType<unknown>,
    ShowMessage: showMssageScheme as TObjectType<unknown>,
    ShowOption: showOptionScheme as TObjectType<unknown>,
    ShowTalk: showTalkScheme as TObjectType<unknown>,
    Wait: waitScheme as TObjectType<unknown>,
};

function createActionNamesByfilter(): Map<TObjectFilter, TActionType[]> {
    const map = new Map<TObjectFilter, TActionType[]>();
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

const actionNamesByfilter = createActionNamesByfilter();

function getScheme(name: string): TObjectType<unknown> {
    const as = (actionSchemeMap as Record<string, TObjectType<unknown>>)[name];
    if (!as) {
        error(`No action scheme for ${name}`);
    }
    return as;
}

function spawnAction(name: TActionType): IActionInfo {
    const as = actionSchemeMap[name];
    return {
        Name: name,
        Params: as.CreateDefault(undefined),
    };
}

function spawnDefaultAction(filter: TObjectFilter): IActionInfo {
    const actionName = actionNamesByfilter.get(filter || 'normal')[0];
    const as = actionSchemeMap[actionName];
    return {
        Name: actionName,
        Params: as.CreateDefault(undefined),
    };
}

function getActionNames(filter?: TObjectFilter): TActionType[] {
    return actionNamesByfilter.get(filter || 'normal');
}

function isFolderAble(scheme: IAbstractType<unknown>): boolean {
    return scheme.Meta.NewLine;
}

function fixAction(action: IActionInfo): TFixResult {
    const typeData = getScheme(action.Name);
    if (!typeData) {
        Object.assign(action, spawnDefaultAction('normal'));
        return 'fixed';
    }

    const old = JSON.stringify(action.Params);
    const result = fixFileds(action.Params, typeData.Fields);
    if (result === 'fixed') {
        log(`Fix action [${action.Name}]: from ${old} => ${JSON.stringify(action.Params)}`);
    }
    return result;
}

function getNormalActionScheme(): TDynamicObjectType {
    return normalActionScheme;
}

export const scheme = {
    GetScheme: getScheme,
    GetActionNames: getActionNames,
    SpawnAction: spawnAction,
    SpawnDefaultAction: spawnDefaultAction,
    IsFolderAble: isFolderAble,
    FixAction: fixAction,
    GetNormalActionScheme: getNormalActionScheme,
};
