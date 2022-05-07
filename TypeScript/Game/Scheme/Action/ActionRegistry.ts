/* eslint-disable spellcheck/spell-checker */
import { error, log } from '../../../Common/Log';
import { EActionFilter, ObjectScheme, TFixResult } from '../../../Common/Type';
import { IActionInfo, TActionType } from '../../Flow/Action';
import {
    ActionScheme,
    flowListActionScheme,
    talkActionScheme,
    triggerActionScheme,
} from './Action';

export type TObjectSchemeMap = { [key in TActionType]: ObjectScheme<unknown> };

class ActionRegistry {
    private ObjectSchemeMap: TObjectSchemeMap;

    private readonly ActionNamesByfilter: Map<EActionFilter, TActionType[]> = new Map();

    private readonly ActionCnNamesByfilter: Map<EActionFilter, string[]> = new Map();

    private readonly ActionNameByCnName: Map<string, TActionType> = new Map();

    private AcitonObjectSchemeMap: Map<EActionFilter, ActionScheme>;

    private InitBySchemeMap(actionSchemeMap: TObjectSchemeMap): void {
        for (const typeName in actionSchemeMap) {
            const typeData = (actionSchemeMap as Record<string, ObjectScheme<unknown>>)[typeName];
            this.ActionNameByCnName.set(typeData.CnName, typeName as TActionType);
            typeData.Filters.forEach((filter) => {
                let names = this.ActionNamesByfilter.get(filter);
                let cnNames = this.ActionCnNamesByfilter.get(filter);
                if (!names) {
                    names = [];
                    this.ActionNamesByfilter.set(filter, names);

                    cnNames = [];
                    this.ActionCnNamesByfilter.set(filter, cnNames);
                }

                names.push(typeName as TActionType);
                cnNames.push(typeData.CnName);
            });
        }
    }

    private CreateDynamicObjectSchemeMap(): Map<EActionFilter, ActionScheme> {
        const result: Map<EActionFilter, ActionScheme> = new Map();
        result.set(EActionFilter.FlowList, flowListActionScheme);
        result.set(EActionFilter.Talk, talkActionScheme);
        result.set(EActionFilter.Trigger, triggerActionScheme);
        return result;
    }

    public SetupObjectMap(objectSchemeMap: TObjectSchemeMap): void {
        this.ObjectSchemeMap = objectSchemeMap;
        this.InitBySchemeMap(objectSchemeMap);
        this.AcitonObjectSchemeMap = this.CreateDynamicObjectSchemeMap();
    }

    public GetScheme(name: string): ObjectScheme<unknown> {
        const as = (this.ObjectSchemeMap as Record<string, ObjectScheme<unknown>>)[name];
        if (!as) {
            error(`No action scheme for ${name}`);
        }
        return as;
    }

    public GetActionTypeByCnName(cnName: string): TActionType {
        return this.ActionNameByCnName.get(cnName);
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

    public GetActionCnNames(filter: EActionFilter): string[] {
        return this.ActionCnNamesByfilter.get(filter);
    }

    public FixAction(action: IActionInfo, objectFilter?: EActionFilter): TFixResult {
        const typeData = this.GetScheme(action.Name);
        if (!typeData) {
            Object.assign(action, this.SpawnDefaultAction(objectFilter || EActionFilter.FlowList));
            return 'fixed';
        }

        const result = typeData.Fix(action.Params);
        if (result === 'fixed') {
            const old = JSON.stringify(action.Params);
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
        typeData.Check(action.Params, errorMessages1);
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
