"use strict";
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable spellcheck/spell-checker */
/* eslint-disable no-use-before-define */
/* eslint-disable no-param-reassign */
/* eslint-disable guard-for-in */
/* eslint-disable no-continue */
/* eslint-disable no-var */
/* eslint-disable no-restricted-syntax */
/* eslint-disable max-classes-per-file */
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleUMGDebug = exports.ReactUMG = void 0;
const puerts = require("puerts");
const Reconciler = require("react-reconciler");
const UE = require("ue");
const Log_1 = require("../Common/Misc/Log");
let world = undefined;
let reactUMGStarter = undefined;
let isDebug = false;
function log1(...data) {
    if (isDebug) {
        (0, Log_1.log)(data.join(','));
    }
}
// 可以避免由于循环引用而报错的ToString
// eslint-disable-next-line @typescript-eslint/no-unused-vars
// function toString<T>(obj: T): string {
//     var cache = new Map();
//     return JSON.stringify(obj, (_, value) => {
//         if (typeof value === 'object' && value !== undefined) {
//             if (cache.has(value)) {
//                 return undefined;
//             }
//             cache.set(value, true);
//         }
//         return value as unknown;
//     });
// }
function propsToString(props) {
    return JSON.stringify(props, ['id', 'key', 'Text', 'DefaultOptions', 'SelectedOption']);
}
class UEWidget {
    type;
    callbackRemovers;
    nativePtr;
    slot;
    nativeSlotPtr;
    _childs;
    props;
    constructor(type, props) {
        this.type = type;
        this.callbackRemovers = {};
        this.init(type, props);
    }
    toString() {
        return `[${this.type}]:${this.childs.length} ${propsToString(this.props)}`;
    }
    get childs() {
        if (!this._childs) {
            this._childs = [];
        }
        return this._childs;
    }
    init(type, props) {
        const classPath = exports.lazyloadComponents[type];
        if (classPath) {
            this.nativePtr = UE.NewObject(UE.Class.Load(classPath));
        }
        else {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-call
            const classObj = UE[type];
            this.nativePtr = new classObj();
        }
        const myProps = {};
        for (const key in props) {
            const val = props[key];
            if (key === 'Slot') {
                this.slot = val;
            }
            else if (typeof val === 'function') {
                this.bind(key, val);
            }
            else if (key !== 'children') {
                myProps[key] = val;
            }
        }
        this.props = myProps;
        puerts.merge(this.nativePtr, myProps);
        this.synchronizeWidgetProperties(this.nativePtr, type, props);
    }
    isComboBoxStringOptionEqual(cbs, options) {
        if (cbs.GetOptionCount() !== options.Num()) {
            return false;
        }
        for (let i = 0; i < options.Num(); i++) {
            if (cbs.GetOptionAtIndex(i) !== options.Get(i)) {
                return false;
            }
        }
        return true;
    }
    reinitComboBoxOptions(cbs) {
        const options = [];
        for (let i = 0; i < cbs.GetOptionCount(); i++) {
            options.push(cbs.GetOptionAtIndex(i));
        }
        cbs.ClearOptions();
        options.forEach((e) => {
            cbs.AddOption(e);
        });
    }
    synchronizeWidgetProperties(widget, type, props) {
        if (type === 'ComboBoxString') {
            const cbs = widget;
            const cbsProps = props;
            const options = cbsProps.DefaultOptions;
            const selectedOp = cbsProps.SelectedOption;
            if (options) {
                const prev = cbs.GetSelectedOption();
                // 只有选项改变的时候,才去更新列表,不然会引起回调相关的错误
                if (!this.isComboBoxStringOptionEqual(cbs, options)) {
                    cbs.ClearOptions();
                    for (let i = 0; i < options.Num(); i++) {
                        cbs.AddOption(options.Get(i));
                    }
                    if (prev && !selectedOp) {
                        const index = cbs.FindOptionIndex(prev);
                        cbs.SetSelectedIndex(index >= 0 ? index : 0);
                    }
                }
            }
            if (selectedOp) {
                if (cbs.GetSelectedOption() !== selectedOp) {
                    // 如果选项改变,调用SetSelectedOption可能不会马上生效
                    // 需要重新生成整个列表才正常,此为UE的bug
                    this.reinitComboBoxOptions(cbs);
                    // const index = cbs.FindOptionIndex(selectedOp);
                    cbs.SetSelectedOption(selectedOp);
                }
            }
        }
    }
    bind(name, callback) {
        const { nativePtr } = this;
        const nativeObj = nativePtr;
        const muticastProp = nativeObj[name];
        if (typeof muticastProp.Add === 'function') {
            muticastProp.Add(callback);
            this.callbackRemovers[name] = () => {
                muticastProp.Remove(callback);
            };
            return;
        }
        const unicastProp = nativeObj[name];
        if (typeof unicastProp.Bind === 'function') {
            unicastProp.Bind(callback);
            this.callbackRemovers[name] = () => {
                unicastProp.Unbind();
            };
            return;
        }
        (0, Log_1.error)(`unsupport callback ${name}`);
    }
    updateProps(oldProps, newProps) {
        const myProps = {};
        let propChange = false;
        for (const key in newProps) {
            const oldProp = oldProps[key];
            const newProp = newProps[key];
            if (key !== 'children' && oldProp !== newProp) {
                if (key === 'Slot') {
                    this.slot = newProp;
                    puerts.merge(this.nativeSlotPtr, newProp);
                    UE.UMGManager.SynchronizeSlotProperties(this.nativeSlotPtr);
                }
                else if (typeof newProp === 'function') {
                    this.unbind(key);
                    this.bind(key, newProp);
                }
                else {
                    myProps[key] = newProp;
                    propChange = true;
                }
            }
        }
        if (propChange) {
            puerts.merge(this.nativePtr, myProps);
            this.synchronizeWidgetProperties(this.nativePtr, this.type, myProps);
            UE.UMGManager.SynchronizeWidgetProperties(this.nativePtr);
        }
    }
    unbind(name) {
        const remover = this.callbackRemovers[name];
        this.callbackRemovers[name] = undefined;
        if (remover) {
            remover();
        }
    }
    unbindAll() {
        for (const key in this.callbackRemovers) {
            this.callbackRemovers[key]();
        }
        this.callbackRemovers = {};
    }
    appendChild(child) {
        if (this.childs.includes(child)) {
            (0, Log_1.error)(`${this.toString()} append ${child.toString()} failed: UMG do not support appending child already exist`);
            return;
        }
        log1(`${this.toString()} append ${child.toString()}`);
        const widget = this.nativePtr;
        const nativeSlot = widget.AddChild(child.nativePtr);
        child.setNativeSlot(nativeSlot);
        this.childs.push(child);
    }
    insertBefore(child, beforeChild) {
        const ueParent = this.nativePtr;
        const ueChild = child.nativePtr;
        const id = this.childs.indexOf(beforeChild);
        log1(`${this.toString()} insertBefore: at->${id} child->${child.toString()} before->${beforeChild.toString()} `);
        const nativeSlot = UE.EditorOperations.InsertWidget(ueParent, id, ueChild);
        child.setNativeSlot(nativeSlot);
        this.childs.splice(id, 0, child);
    }
    removeChild(child) {
        log1(`${this.toString()} remove ${child.toString()}`);
        child.unbindAll();
        this.nativePtr.RemoveChild(child.nativePtr);
        this.childs.splice(this.childs.indexOf(child), 1);
    }
    setNativeSlot(value) {
        this.nativeSlotPtr = value;
        if (this.slot) {
            puerts.merge(this.nativeSlotPtr, this.slot);
            UE.UMGManager.SynchronizeSlotProperties(this.nativeSlotPtr);
        }
    }
}
class UEWidgetRoot {
    nativePtr;
    added;
    constructor(nativePtr) {
        this.nativePtr = nativePtr;
    }
    appendChild(child) {
        log1(`[Root] appendChild: ${child.toString()}`);
        const nativeSlot = this.nativePtr.AddChild(child.nativePtr);
        child.setNativeSlot(nativeSlot);
    }
    removeChild(child) {
        log1(`[Root] removeChild: ${child.toString()}`);
        child.unbindAll();
        this.nativePtr.RemoveChild(child.nativePtr);
    }
    addToViewport(z) {
        if (!this.added) {
            this.nativePtr.AddToViewport(z);
            this.added = true;
        }
    }
    removeFromViewport() {
        this.nativePtr.RemoveFromViewport();
    }
}
function compareWidgetProps(x, y) {
    if (x === y) {
        return true;
    }
    if (typeof x !== 'object' || x === undefined || typeof y !== 'object' || y === undefined) {
        return false;
    }
    for (const p in x) {
        if (p === 'children') {
            continue;
        }
        if (!compareWidgetProps(x[p], y[p])) {
            return false;
        }
    }
    for (const p in y) {
        if (p === 'children') {
            continue;
        }
        if (x[p] === undefined) {
            return false;
        }
    }
    return true;
}
const hostConfig = {
    // useSyncScheduling: true,
    supportsMutation: true,
    isPrimaryRenderer: true,
    supportsPersistence: false,
    supportsHydration: false,
    shouldDeprioritizeSubtree: undefined,
    setTimeout: undefined,
    clearTimeout: undefined,
    cancelDeferredCallback: undefined,
    noTimeout: undefined,
    scheduleDeferredCallback: undefined,
    getRootHostContext() {
        return {};
    },
    // CanvasPanel()的parentHostContext是getRootHostContext返回的值
    getChildHostContext(parentHostContext) {
        return parentHostContext; // no use, share one
    },
    appendInitialChild(parent, child) {
        parent.appendChild(child);
    },
    appendChildToContainer(container, child) {
        container.appendChild(child);
    },
    appendChild(parent, child) {
        parent.appendChild(child);
    },
    insertBefore(parent, child, beforeChild) {
        parent.insertBefore(child, beforeChild);
    },
    createInstance(type, props) {
        return new UEWidget(type, props);
    },
    createTextInstance(text) {
        return new UEWidget('TextBlock', { Text: text });
    },
    finalizeInitialChildren() {
        return false;
    },
    getPublicInstance(instance) {
        return instance;
    },
    now: Date.now,
    prepareForCommit() {
        // log('prepareForCommit');
    },
    resetAfterCommit(container) {
        container.addToViewport(0);
    },
    resetTextContent() {
        (0, Log_1.error)('resetTextContent not implemented!');
    },
    shouldSetTextContent(type, props) {
        return false;
    },
    commitTextUpdate(textInstance, oldText, newText) {
        if (oldText !== newText) {
            textInstance.updateProps({}, { Text: newText });
        }
    },
    // return false表示不更新,真值将会出现到commitUpdate的updatePayload里头
    prepareUpdate(instance, type, oldProps, newProps) {
        return !compareWidgetProps(oldProps, newProps);
    },
    commitUpdate(instance, updatePayload, type, oldProps, newProps) {
        instance.updateProps(oldProps, newProps);
    },
    removeChildFromContainer(container, child) {
        container.removeChild(child);
    },
    removeChild(parent, child) {
        parent.removeChild(child);
    },
};
const reconciler = Reconciler(hostConfig);
let umgRoot = undefined;
exports.ReactUMG = {
    render(reactElement) {
        if (!reactUMGStarter) {
            throw new Error('init with ReactUMGStarter first!');
        }
        const root = new UEWidgetRoot(umgRoot);
        const container = reconciler.createContainer(root, false, false);
        reconciler.updateContainer(reactElement, container, undefined, undefined);
        reactUMGStarter.SetContent(root.nativePtr);
    },
    init(starter) {
        world = starter.GetWorld();
        umgRoot = UE.UMGRoot.CreateUmgRoot(world);
        umgRoot.bIsFocusable = true;
        reactUMGStarter = starter;
    },
    getRoot() {
        return umgRoot;
    },
};
function toggleUMGDebug() {
    isDebug = !isDebug;
}
exports.toggleUMGDebug = toggleUMGDebug;
//# sourceMappingURL=react-umg.js.map