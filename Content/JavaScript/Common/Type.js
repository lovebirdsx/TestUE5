"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCsvIndexValueScheme = exports.CsvIndexValueScheme = exports.ECsvName = exports.floatScheme = exports.createFloatScheme = exports.FloatScheme = exports.booleanScheme = exports.booleanHideNameScheme = exports.createBooleanScheme = exports.BooleanScheme = exports.createAssetScheme = exports.AssetScheme = exports.stringScheme = exports.createStringScheme = exports.StringScheme = exports.intScheme = exports.createIntScheme = exports.IntScheme = exports.emptyObjectScheme = exports.createObjectScheme = exports.ObjectScheme = exports.createArrayScheme = exports.ArrayScheme = exports.actionFilterExcept = exports.allActionFilters = exports.EActionFilter = exports.createEnumScheme = exports.EnumScheme = exports.getSchemeClass = exports.createScheme = exports.Scheme = void 0;
/* eslint-disable spellcheck/spell-checker */
const Log_1 = require("./Log");
const Util_1 = require("./Util");
class Scheme {
    RenderType = 'string';
    CreateDefault() {
        return undefined;
    }
    Fix(value) {
        return 'canNotFixed';
    }
    Check(value, messages) {
        return 0;
    }
    ShowName; // 是否显示字段的名字
    Hide; // 是否在编辑器中隐藏
    NewLine; // 字段是否换行
    Optional; // 字段是否可选
    ArraySimplify; // 数组的名字不新起一行
    Width; // 显示的宽度
    Tip; // 提示文字
}
exports.Scheme = Scheme;
function createScheme(type) {
    const scheme = new Scheme();
    Object.assign(scheme, type);
    return scheme;
}
exports.createScheme = createScheme;
function getSchemeClass(scheme) {
    if (scheme.constructor) {
        return scheme.constructor;
    }
    return undefined;
}
exports.getSchemeClass = getSchemeClass;
function getEnumNames(config) {
    const names = [];
    for (const key in config) {
        names.push(key);
    }
    return names;
}
class EnumScheme extends Scheme {
    RenderType = 'enum';
    Config;
    Names;
    CreateDefault() {
        for (const k in this.Config) {
            return k;
        }
        return undefined;
    }
}
exports.EnumScheme = EnumScheme;
function createEnumScheme(config) {
    const scheme = new EnumScheme();
    scheme.Config = config;
    scheme.Names = getEnumNames(config);
    return scheme;
}
exports.createEnumScheme = createEnumScheme;
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
class ArrayScheme extends Scheme {
    RenderType = 'array';
    CreateDefault() {
        return [];
    }
    Element;
    Check(value, messages) {
        let fixCount = 0;
        value.forEach((e) => {
            fixCount += this.Element.Check(e, messages);
        });
        return fixCount;
    }
    Fix(value) {
        let fixCount = 0;
        value.forEach((e) => {
            if (this.Element.Fix(e) === 'fixed') {
                fixCount++;
            }
        });
        return fixCount > 0 ? 'fixed' : 'nothing';
    }
}
exports.ArrayScheme = ArrayScheme;
function createArrayScheme(type) {
    const scheme = new ArrayScheme();
    Object.assign(scheme, type);
    return scheme;
}
exports.createArrayScheme = createArrayScheme;
class ObjectScheme extends Scheme {
    RenderType = 'object';
    Filters = exports.allActionFilters;
    Fields;
    CreateDefault() {
        const fieldArray = [];
        for (const key in this.Fields) {
            const filedTypeData = this.Fields[key];
            if (!filedTypeData.Optional) {
                fieldArray.push([key, filedTypeData.CreateDefault()]);
            }
        }
        return Object.fromEntries(fieldArray);
    }
    Scheduled;
    Fix(value) {
        let fixCount = 0;
        for (const key in this.Fields) {
            const filedTypeData = this.Fields[key];
            if (value[key] === undefined) {
                if (!filedTypeData.Optional) {
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
            if (!this.Fields[key] && !key.startsWith('_')) {
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
    Check(value, messages) {
        let errorCount = 0;
        for (const key in this.Fields) {
            const filedTypeData = this.Fields[key];
            if (value[key] === undefined) {
                if (!filedTypeData.Optional) {
                    messages.push(`字段[${key}]值为空`);
                    errorCount++;
                }
            }
            else {
                errorCount += filedTypeData.Check(value[key], messages);
            }
        }
        for (const key in value) {
            if (!this.Fields[key] && !key.startsWith('_')) {
                messages.push(`存在非法的字段[${key}]`);
                errorCount++;
            }
        }
        return errorCount;
    }
}
exports.ObjectScheme = ObjectScheme;
function createObjectScheme(fields, type) {
    const scheme = new ObjectScheme();
    scheme.Fields = fields;
    if (type) {
        Object.assign(scheme, type);
    }
    return scheme;
}
exports.createObjectScheme = createObjectScheme;
exports.emptyObjectScheme = createObjectScheme({});
// ============================================================================
class IntScheme extends Scheme {
    RenderType = 'int';
    CreateDefault() {
        return 0;
    }
}
exports.IntScheme = IntScheme;
function createIntScheme(type) {
    const scheme = new IntScheme();
    if (type) {
        Object.assign(scheme, type);
    }
    return scheme;
}
exports.createIntScheme = createIntScheme;
exports.intScheme = new IntScheme();
// ============================================================================
class StringScheme extends Scheme {
    RenderType = 'string';
    CreateDefault() {
        return 'Empty';
    }
}
exports.StringScheme = StringScheme;
function createStringScheme(type) {
    const scheme = new StringScheme();
    if (type) {
        Object.assign(scheme, type);
    }
    return scheme;
}
exports.createStringScheme = createStringScheme;
exports.stringScheme = createStringScheme();
// ============================================================================
class AssetScheme extends Scheme {
    RenderType = 'asset';
    CreateDefault() {
        return '';
    }
    ClassPath;
    SearchPath;
}
exports.AssetScheme = AssetScheme;
function createAssetScheme(type) {
    if (!type.ClassPath || !type.SearchPath) {
        (0, Log_1.error)('AssetScheme must set ClassPath and SearchPath');
    }
    const scheme = new AssetScheme();
    Object.assign(scheme, type);
    return scheme;
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
    const scheme = new BooleanScheme();
    if (type) {
        Object.assign(scheme, type);
    }
    return scheme;
}
exports.createBooleanScheme = createBooleanScheme;
exports.booleanHideNameScheme = createBooleanScheme();
exports.booleanScheme = createBooleanScheme({
    ShowName: true,
});
// ============================================================================
class FloatScheme extends Scheme {
    RenderType = 'float';
    CreateDefault() {
        return 0.0;
    }
}
exports.FloatScheme = FloatScheme;
function createFloatScheme(type) {
    const scheme = new FloatScheme();
    if (type) {
        Object.assign(scheme, type);
    }
    return scheme;
}
exports.createFloatScheme = createFloatScheme;
exports.floatScheme = createFloatScheme();
// ============================================================================
var ECsvName;
(function (ECsvName) {
    ECsvName["Global"] = "\u5168\u5C40\u914D\u7F6E";
    ECsvName["Talker"] = "\u5BF9\u8BDD\u4EBA";
    ECsvName["CustomSeq"] = "\u81EA\u5B9A\u4E49\u5E8F\u5217";
})(ECsvName = exports.ECsvName || (exports.ECsvName = {}));
class CsvIndexValueScheme extends Scheme {
    RenderType = 'csvIndexValue';
    CreateDefault() {
        if (this.IndexType === 'Int') {
            return 1;
        }
        else if (this.IndexType === 'BigInt') {
            return BigInt(1);
        }
        return '';
    }
    CsvName;
    IndexField;
    ValueField;
    IndexType;
}
exports.CsvIndexValueScheme = CsvIndexValueScheme;
function createCsvIndexValueScheme(type) {
    const scheme = new CsvIndexValueScheme();
    Object.assign(scheme, type);
    return scheme;
}
exports.createCsvIndexValueScheme = createCsvIndexValueScheme;
//# sourceMappingURL=Type.js.map