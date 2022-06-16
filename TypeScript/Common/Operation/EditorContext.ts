import produce from 'immer';

type TModifyCallback<T, TModifyType> = (value: T, type: TModifyType) => void;
type TGet<T> = () => T;

export class Context<T, TModifyType> {
    private GetFun: TGet<T>;

    private OnModify: TModifyCallback<T, TModifyType>;

    public Set(getFun: TGet<T>, onModify: TModifyCallback<T, TModifyType>): void {
        this.GetFun = getFun;
        this.OnModify = onModify;
    }

    public Clear(): void {
        this.GetFun = undefined;
        this.OnModify = undefined;
    }

    public Get(): T {
        if (!this.GetFun) {
            throw new Error('Context get must called after set');
        }
        return this.GetFun();
    }

    public Modify(type: TModifyType, cb: (from: T, to: T) => void): void {
        if (!this.GetFun) {
            throw new Error('Context modify must called after set');
        }

        const oldValue = this.GetFun();
        const newValue = produce(oldValue, (draft) => {
            cb(oldValue, draft as T);
        });

        if (newValue !== oldValue) {
            this.OnModify(newValue, type);
        }
    }
}

export function createEditorContext<T, TModifyType>(): Context<T, TModifyType> {
    return new Context<T, TModifyType>();
}
