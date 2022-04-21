/* eslint-disable spellcheck/spell-checker */
import { error, log } from '../../../../Common/Log';
import {
    checkFields,
    EActionFilter,
    fixFileds,
    ObjectScheme,
    TFixResult,
} from '../../../../Common/Type';
import { IActionInfo, TActionType } from '../../../../Game/Flow/Action';
import {
    ActionScheme,
    FlowListActionScheme,
    TalkActionScheme,
    TriggerActionScheme,
} from './Action';

export type TObjectSchemeMap = { [key in TActionType]: ObjectScheme<unknown> };

class ActionRegistry {
    private ObjectSchemeMap: TObjectSchemeMap;

    private ActionNamesByfilter: Map<EActionFilter, TActionType[]>;

    private AcitonObjectSchemeMap: Map<EActionFilter, ActionScheme>;

    private CreateActionNamesByfilter(
        actionSchemeMap: TObjectSchemeMap,
    ): Map<EActionFilter, TActionType[]> {
        const map = new Map<EActionFilter, TActionType[]>();
        for (const typeName in actionSchemeMap) {
            const typeData = (actionSchemeMap as Record<string, ObjectScheme<unknown>>)[typeName];
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

    private CreateDynamicObjectSchemeMap(): Map<EActionFilter, ActionScheme> {
        const result: Map<EActionFilter, ActionScheme> = new Map();
        result.set(EActionFilter.FlowList, new FlowListActionScheme());
        result.set(EActionFilter.Talk, new TalkActionScheme());
        result.set(EActionFilter.Trigger, new TriggerActionScheme());
        return result;
    }

    public SetupObjectMap(objectSchemeMap: TObjectSchemeMap): void {
        this.ObjectSchemeMap = objectSchemeMap;
        this.ActionNamesByfilter = this.CreateActionNamesByfilter(objectSchemeMap);
        this.AcitonObjectSchemeMap = this.CreateDynamicObjectSchemeMap();
    }

    public GetScheme(name: string): ObjectScheme<unknown> {
        const as = (this.ObjectSchemeMap as Record<string, ObjectScheme<unknown>>)[name];
        if (!as) {
            error(`No action scheme for ${name}`);
        }
        return as;
    }

    public SpawnAction(name: TActionType): IActionInfo {
        const as = this.ObjectSchemeMap[name];
        return {
            Name: name,
            Params: as.CreateDefault(),
        };
    }

    public SpawnDefaultAction(filter: EActionFilter): IActionInfo {
        const actionName = this.ActionNamesByfilter.get(filter)[0];
        const as = this.ObjectSchemeMap[actionName];
        return {
            Name: actionName,
            Params: as.CreateDefault(),
        };
    }

    public GetActionNames(filter: EActionFilter): TActionType[] {
        return this.ActionNamesByfilter.get(filter);
    }

    public FixAction(action: IActionInfo, objectFilter?: EActionFilter): TFixResult {
        const typeData = this.GetScheme(action.Name);
        if (!typeData) {
            Object.assign(action, this.SpawnDefaultAction(objectFilter || EActionFilter.FlowList));
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

    public GetActionScheme(objectFilter: EActionFilter): ActionScheme {
        return this.AcitonObjectSchemeMap.get(objectFilter);
    }
}

export const actionRegistry = new ActionRegistry();
