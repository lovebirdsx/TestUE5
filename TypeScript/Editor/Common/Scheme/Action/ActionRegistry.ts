/* eslint-disable spellcheck/spell-checker */
import { error, log } from '../../../../Common/Log';
import {
    allObjectFilter,
    checkFields,
    createDynamicType,
    EObjectFilter,
    fixFileds,
    TDynamicObjectType,
    TFixResult,
    TObjectType,
} from '../../../../Common/Type';
import { IActionInfo, ILog, TActionType } from '../../../../Game/Flow/Action';

export type TActionSchemeMap = { [key in TActionType]: TObjectType<unknown> };

class ActionRegistry {
    private ActionSchemeMap: TActionSchemeMap;

    private ActionNamesByfilter: Map<EObjectFilter, TActionType[]>;

    private DynamicObjectSchemeMap: Map<EObjectFilter, TDynamicObjectType<IActionInfo>>;

    private CreateActionNamesByfilter(
        actionSchemeMap: TActionSchemeMap,
    ): Map<EObjectFilter, TActionType[]> {
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

    private CreateDynamicObjectSchemeMap(): Map<EObjectFilter, TDynamicObjectType<IActionInfo>> {
        const result: Map<EObjectFilter, TDynamicObjectType<IActionInfo>> = new Map();
        allObjectFilter.forEach((objectFilter) => {
            const type = createDynamicType<IActionInfo>(objectFilter, {
                CreateDefault: (container): IActionInfo => {
                    const logAction: ILog = {
                        Level: 'Info',
                        Content: 'Hello World',
                    };
                    return {
                        Name: 'Log',
                        Params: logAction,
                    };
                },
                Meta: {
                    NewLine: true,
                },
            });
            result.set(objectFilter, type);
        });
        return result;
    }

    public SetupActionMap(actionSchemeMap: TActionSchemeMap): void {
        this.ActionSchemeMap = actionSchemeMap;
        this.ActionNamesByfilter = this.CreateActionNamesByfilter(actionSchemeMap);
        this.DynamicObjectSchemeMap = this.CreateDynamicObjectSchemeMap();
    }

    public GetScheme(name: string): TObjectType<unknown> {
        const as = (this.ActionSchemeMap as Record<string, TObjectType<unknown>>)[name];
        if (!as) {
            error(`No action scheme for ${name}`);
        }
        return as;
    }

    public SpawnAction(name: TActionType): IActionInfo {
        const as = this.ActionSchemeMap[name];
        return {
            Name: name,
            Params: as.CreateDefault(undefined),
        };
    }

    public SpawnDefaultAction(filter: EObjectFilter): IActionInfo {
        const actionName = this.ActionNamesByfilter.get(filter)[0];
        const as = this.ActionSchemeMap[actionName];
        return {
            Name: actionName,
            Params: as.CreateDefault(undefined),
        };
    }

    public GetActionNames(filter: EObjectFilter): TActionType[] {
        return this.ActionNamesByfilter.get(filter);
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

    public GetDynamicObjectScheme(objectFilter: EObjectFilter): TDynamicObjectType<IActionInfo> {
        return this.DynamicObjectSchemeMap.get(objectFilter);
    }
}

export const actionRegistry = new ActionRegistry();
