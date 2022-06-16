/* eslint-disable spellcheck/spell-checker */
import { IActionInfo, TActionType } from '../../../../Common/Interface/IAction';
import { error, log } from '../../../../Common/Misc/Log';
import { ObjectScheme, TFixResult } from '../../Type';

export type TObjectSchemeMap = { [key in TActionType]: ObjectScheme<unknown> };

class ActionRegistry {
    private ObjectSchemeMap: TObjectSchemeMap;

    private readonly ActionNameByCnName: Map<string, TActionType> = new Map();

    private InitBySchemeMap(actionSchemeMap: TObjectSchemeMap): void {
        for (const typeName in actionSchemeMap) {
            const typeData = (actionSchemeMap as Record<string, ObjectScheme<unknown>>)[typeName];
            this.ActionNameByCnName.set(typeData.CnName, typeName as TActionType);
        }
    }

    public SetupObjectMap(objectSchemeMap: TObjectSchemeMap): void {
        this.ObjectSchemeMap = objectSchemeMap;
        this.InitBySchemeMap(objectSchemeMap);
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

    public SpawnAction(actionType: TActionType): IActionInfo {
        const scheme = this.ObjectSchemeMap[actionType];
        return {
            Name: actionType,
            Params: scheme.CreateDefault(),
        };
    }

    public FixAction(action: IActionInfo): TFixResult {
        const scheme = this.GetScheme(action.Name);
        const result = scheme.Fix(action.Params);
        if (result === 'fixed') {
            const old = JSON.stringify(action.Params);
            log(`Fix action [${action.Name}]: from ${old} => ${JSON.stringify(action.Params)}`);
        }
        return result;
    }

    public CheckAction(action: IActionInfo, errorMessages: string[]): number {
        const scheme = this.GetScheme(action.Name);
        if (!scheme) {
            throw new Error(`Check action error: no scheme for name ${action.Name}`);
        }

        const errorMessages1 = [] as string[];
        scheme.Check(action.Params, errorMessages1);
        errorMessages1.forEach((msg) => {
            errorMessages.push(`[${action.Name}]${msg}`);
        });
        return errorMessages1.length;
    }
}

export const actionRegistry = new ActionRegistry();
