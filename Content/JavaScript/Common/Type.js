"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUnknownScheme = exports.floatScheme = exports.FloatScheme = exports.createFloatScheme = exports.booleanHideNameScheme = exports.booleanScheme = exports.createBooleanScheme = exports.BooleanScheme = exports.createAssetScheme = exports.stringScheme = exports.createStringScheme = exports.StringScheme = exports.intScheme = exports.createIntScheme = exports.IntScheme = exports.emptyObjectScheme = exports.createObjectScheme = exports.ObjectScheme = exports.createDefaultObject = exports.checkFields = exports.fixFileds = exports.createArrayScheme = exports.actionFilterExcept = exports.allActionFilters = exports.EActionFilter = exports.ArrayScheme = exports.AssetScheme = exports.EnumScheme = exports.getSchemeClass = exports.Scheme = void 0;
/* eslint-disable no-param-reassign */
/* eslint-disable spellcheck/spell-checker */
const Log_1 = require("./Log");
const Util_1 = require("./Util");
class Scheme {
    Render;
    Fix(value) {
        return 'canNotFixed';
    }
    Check(value, messages) {
        return 0;
    }
    Meta = {};
    HideName; // 是否显示字段的名字
    Hide; // 是否在编辑器中隐藏
    NewLine; // 字段是否换行
    Optional; // 字段是否可选
    ArraySimplify; // 数组的名字不新起一行
    Width; // 显示的宽度
    Tip; // 提示文字
}
exports.Scheme = Scheme;
function getSchemeClass(scheme) {
    if (scheme.constructor) {
        return scheme.constructor;
    }
    return undefined;
}
exports.getSchemeClass = getSchemeClass;
class EnumScheme extends Scheme {
    RenderType = 'enum';
    HideName = true;
    Meta = {
        HideName: true,
    };
    CreateDefault() {
        for (const k in this.Config) {
            return k;
        }
        return undefined;
    }
}
exports.EnumScheme = EnumScheme;
class AssetScheme extends Scheme {
    RenderType = 'asset';
    CreateDefault() {
        return '';
    }
    ClassPath;
    SearchPath;
}
exports.AssetScheme = AssetScheme;
class ArrayScheme extends Scheme {
    RenderType = 'array';
    CreateDefault() {
        return [];
    }
    HideName = true;
}
exports.ArrayScheme = ArrayScheme;
var EActionFilter;
(function (EActionFilter) {
    EActionFilter[EActionFilter["FlowList"] = 0] = "FlowList";
    EActionFilter[EActionFilter["Trigger"] = 1] = "Trigger";
    EActionFilter[EActionFilter["Talk"] = 2] = "Talk";
})(EActionFilter = exports.EActionFilter || (exports.EActionFilter = {}));
exports.allActionFilters = (0, Util_1.getEnumValues)(EActionFilter);
function actionFilterExcept(...args) {
    const result = exports.allActionFilters.filter((filter) => !args.includes(filter));
    return result;
}
exports.actionFilterExcept = actionFilterExcept;
function createArrayScheme(type) {
    return {
        RenderType: 'array',
        CreateDefault: type.CreateDefault ||
            function () {
                return [];
            },
        Element: type.Element,
        Meta: type.Meta || {},
        Check: type.Check ||
            ((value, messages) => {
                let fixCount = 0;
                value.forEach((e) => {
                    fixCount += type.Element.Check(e, messages);
                });
                return fixCount;
            }),
        Fix: type.Fix ||
            ((value) => {
                let fixCount = 0;
                value.forEach((e) => {
                    if (type.Element.Fix(e) === 'fixed') {
                        fixCount++;
                    }
                });
                return fixCount > 0 ? 'fixed' : 'nothing';
            }),
    };
}
exports.createArrayScheme = createArrayScheme;
function fixFileds(value, fields) {
    let fixCount = 0;
    for (const key in fields) {
        const filedTypeData = fields[key];
        if (value[key] === undefined) {
            if (!filedTypeData.Meta.Optional) {
                value[key] = filedTypeData.CreateDefault();
                (0, Log_1.log)(`fixed no exist field [${key}]`);
                fixCount++;
            }
        }
        else {
            const reuslt = filedTypeData.Fix(value[key]);
            if (reuslt === 'fixed') {
                (0, Log_1.log)(`fixed field [${key}] to ${JSON.stringify(value[key])}`);
                fixCount++;
            }
        }
    }
    const keysToRemove = [];
    for (const key in value) {
        if (!fields[key] && !key.startsWith('_')) {
            keysToRemove.push(key);
        }
    }
    keysToRemove.forEach((key) => {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete value[key];
        fixCount++;
        (0, Log_1.log)(`remove no exist field [${key}]`);
    });
    return fixCount > 0 ? 'fixed' : 'nothing';
}
exports.fixFileds = fixFileds;
function checkFields(value, fields, errorMessages) {
    let errorCount = 0;
    for (const key in fields) {
        const filedTypeData = fields[key];
        if (value[key] === undefined) {
            if (!filedTypeData.Meta.Optional) {
                errorMessages.push(`字段[${key}]值为空`);
                errorCount++;
            }
        }
        else {
            errorCount += filedTypeData.Check(value[key], errorMessages);
        }
    }
    for (const key in value) {
        if (!fields[key] && !key.startsWith('_')) {
            errorMessages.push(`存在非法的字段[${key}]`);
            errorCount++;
        }
    }
    return errorCount;
}
exports.checkFields = checkFields;
function createDefaultObject(fields) {
    const fieldArray = [];
    for (const key in fields) {
        const filedTypeData = fields[key];
        if (!filedTypeData.Meta.Optional) {
            fieldArray.push([key, filedTypeData.CreateDefault()]);
        }
    }
    return Object.fromEntries(fieldArray);
}
exports.createDefaultObject = createDefaultObject;
class ObjectScheme extends Scheme {
    RenderType = 'object';
    Filters = exports.allActionFilters;
    CreateDefault() {
        return createDefaultObject(this.Fields);
    }
    Scheduled;
}
exports.ObjectScheme = ObjectScheme;
function createObjectScheme(fields, type) {
    type = type || {};
    return {
        RenderType: 'object',
        Fields: fields,
        Meta: type.Meta || {},
        CreateDefault: type.CreateDefault || (() => createDefaultObject(fields)),
        Filters: type.Filters || (0, Util_1.getEnumValues)(EActionFilter),
        Fix: type.Fix || ((value) => fixFileds(value, fields)),
        Check: type.Check || ((value, messages) => checkFields(value, fields, messages)),
        Render: type.Render,
        Scheduled: type.Scheduled,
    };
}
exports.createObjectScheme = createObjectScheme;
exports.emptyObjectScheme = createObjectScheme({});
// ============================================================================
class IntScheme extends Scheme {
    RenderType = 'int';
    HideName = true;
    CreateDefault() {
        return 0;
    }
}
exports.IntScheme = IntScheme;
function createIntScheme(type) {
    type = type || {};
    return {
        RenderType: 'int',
        CreateDefault: type.CreateDefault || (() => 0),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'canNotFixed',
        Check: type.Check || (() => 0),
    };
}
exports.createIntScheme = createIntScheme;
exports.intScheme = new IntScheme();
// ============================================================================
class StringScheme extends Scheme {
    RenderType = 'string';
    CreateDefault() {
        return '';
    }
}
exports.StringScheme = StringScheme;
function createStringScheme(type) {
    type = type || {};
    return {
        RenderType: 'string',
        CreateDefault: type.CreateDefault || (() => 'Empty'),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'nothing',
        Check: type.Check || (() => 0),
    };
}
exports.createStringScheme = createStringScheme;
exports.stringScheme = createStringScheme();
// ============================================================================
function createAssetScheme(type) {
    if (!type.ClassPath || !type.SearchPath) {
        (0, Log_1.error)('AssetScheme must set ClassPath and SearchPath');
    }
    return {
        RenderType: 'asset',
        CreateDefault: type.CreateDefault || (() => ''),
        Meta: type.Meta || {},
        Render: type.Render,
        ClassPath: type.ClassPath,
        SearchPath: type.SearchPath,
        Fix: () => 'nothing',
        Check: type.Check || (() => 0),
    };
}
exports.createAssetScheme = createAssetScheme;
// ============================================================================
class BooleanScheme extends Scheme {
    RenderType = 'boolean';
    CreateDefault() {
        return false;
    }
}
exports.BooleanScheme = BooleanScheme;
function createBooleanScheme(type) {
    type = type || {};
    return {
        RenderType: 'boolean',
        CreateDefault: type.CreateDefault || (() => false),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'canNotFixed',
        Check: type.Check || (() => 0),
    };
}
exports.createBooleanScheme = createBooleanScheme;
exports.booleanScheme = createBooleanScheme();
exports.booleanHideNameScheme = createBooleanScheme({
    Meta: { HideName: true },
});
// ============================================================================
function createFloatScheme(type) {
    type = type || {};
    return {
        RenderType: 'float',
        CreateDefault: type.CreateDefault || (() => 0.0),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'canNotFixed',
        Check: type.Check || (() => 0),
    };
}
exports.createFloatScheme = createFloatScheme;
class FloatScheme extends Scheme {
    RenderType = 'float';
    CreateDefault() {
        return 0.0;
    }
}
exports.FloatScheme = FloatScheme;
exports.floatScheme = new FloatScheme();
// ============================================================================
function createUnknownScheme(type) {
    return {
        RenderType: 'custom',
        Render: type.Render,
        CreateDefault: type.CreateDefault || (() => undefined),
        Fix: type.Fix || (() => 'canNotFixed'),
        Check: type.Check || (() => 0),
        Meta: type.Meta || {},
    };
}
exports.createUnknownScheme = createUnknownScheme;
//# sourceMappingURL=Type.js.map