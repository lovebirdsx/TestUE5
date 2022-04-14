"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.floatScheme = exports.createFloatScheme = exports.booleanHideNameScheme = exports.booleanScheme = exports.createBooleanScheme = exports.createAssetScheme = exports.stringScheme = exports.createStringScheme = exports.intScheme = exports.createIntScheme = exports.createObjectSchemeForUeClass = exports.createObjectScheme = exports.createDefaultObject = exports.fixFileds = exports.createArrayScheme = exports.createEnumType = exports.createDynamicType = exports.objectFilterExcept = exports.allObjectFilter = exports.EObjectFilter = void 0;
/* eslint-disable no-param-reassign */
/* eslint-disable spellcheck/spell-checker */
const Util_1 = require("../../../Common/Util");
const Log_1 = require("../Log");
var EObjectFilter;
(function (EObjectFilter) {
    EObjectFilter[EObjectFilter["FlowList"] = 0] = "FlowList";
    EObjectFilter[EObjectFilter["Npc"] = 1] = "Npc";
    EObjectFilter[EObjectFilter["Trigger"] = 2] = "Trigger";
    EObjectFilter[EObjectFilter["Talk"] = 3] = "Talk";
})(EObjectFilter = exports.EObjectFilter || (exports.EObjectFilter = {}));
exports.allObjectFilter = (0, Util_1.getEnumValues)(EObjectFilter);
function objectFilterExcept(...args) {
    return exports.allObjectFilter.filter((objerFilter) => !args.includes(objerFilter));
}
exports.objectFilterExcept = objectFilterExcept;
function createDynamicType(filter, type) {
    return {
        Filter: filter,
        RrenderType: 'dynamic',
        CreateDefault: type.CreateDefault ||
            (() => {
                const log = {
                    Level: 'Info',
                    Content: 'Hello World',
                };
                return {
                    Name: 'Log',
                    Params: log,
                };
            }),
        Fix: type.Fix || (() => 'nothing'),
        Meta: type.Meta || {},
        Render: type.Render,
    };
}
exports.createDynamicType = createDynamicType;
function getEnumNames(config) {
    const names = [];
    for (const key in config) {
        names.push(key);
    }
    return names;
}
function createEnumType(config, type) {
    // eslint-disable-next-line no-param-reassign
    type = type || {};
    return {
        RrenderType: 'enum',
        Config: config,
        CreateDefault: type.CreateDefault ||
            (() => {
                for (const k in config) {
                    return k;
                }
                return undefined;
            }),
        Meta: type.Meta || {},
        Fix: (value, container) => {
            // 由于value是值类型,所以无法修复
            if (!config[value]) {
                return 'canNotFixed';
            }
            return 'nothing';
        },
        Names: getEnumNames(config),
    };
}
exports.createEnumType = createEnumType;
function createArrayScheme(type) {
    return {
        RrenderType: 'array',
        CreateDefault: type.CreateDefault ||
            function () {
                return [];
            },
        Element: type.Element,
        Meta: type.Meta || {},
        Fix: type.Fix ||
            ((value) => {
                let fixCount = 0;
                value.forEach((e) => {
                    if (type.Element.Fix(e, value) === 'fixed') {
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
                value[key] = filedTypeData.CreateDefault(value);
                (0, Log_1.log)(`fixed no exist field [${key}]`);
                fixCount++;
            }
        }
        else {
            const reuslt = filedTypeData.Fix(value[key], value);
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
function createDefaultObject(fields) {
    const fieldArray = [];
    for (const key in fields) {
        const filedTypeData = fields[key];
        if (!filedTypeData.Meta.Optional) {
            fieldArray.push([key, filedTypeData.CreateDefault(undefined)]);
        }
    }
    return Object.fromEntries(fieldArray);
}
exports.createDefaultObject = createDefaultObject;
function createObjectScheme(fields, type) {
    type = type || {};
    return {
        RrenderType: 'object',
        Fields: fields,
        Meta: type.Meta || {},
        CreateDefault: type.CreateDefault || (() => createDefaultObject(fields)),
        Filters: type.Filters || (0, Util_1.getEnumValues)(EObjectFilter),
        Fix: type.Fix || ((value, container) => fixFileds(value, fields)),
        Render: type.Render,
        Scheduled: type.Scheduled,
    };
}
exports.createObjectScheme = createObjectScheme;
function createObjectSchemeForUeClass(fields, type) {
    type = type || {};
    return {
        RrenderType: 'object',
        Fields: fields,
        Meta: type.Meta || {},
        CreateDefault: type.CreateDefault || (() => null),
        Filters: [],
        Fix: type.Fix || ((value, container) => 'canNotFixed'),
        Render: type.Render,
        Scheduled: false,
    };
}
exports.createObjectSchemeForUeClass = createObjectSchemeForUeClass;
// ============================================================================
function createIntScheme(type) {
    type = type || {};
    return {
        RrenderType: 'int',
        CreateDefault: type.CreateDefault || (() => 0),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'canNotFixed',
    };
}
exports.createIntScheme = createIntScheme;
exports.intScheme = createIntScheme();
// ============================================================================
function createStringScheme(type) {
    type = type || {};
    return {
        RrenderType: 'string',
        CreateDefault: type.CreateDefault || (() => 'Empty'),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'nothing',
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
        RrenderType: 'asset',
        CreateDefault: type.CreateDefault || (() => ''),
        Meta: type.Meta || {},
        Render: type.Render,
        ClassPath: type.ClassPath,
        SearchPath: type.SearchPath,
        Fix: () => 'nothing',
    };
}
exports.createAssetScheme = createAssetScheme;
// ============================================================================
function createBooleanScheme(type) {
    type = type || {};
    return {
        RrenderType: 'boolean',
        CreateDefault: type.CreateDefault || (() => false),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'canNotFixed',
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
        RrenderType: 'float',
        CreateDefault: type.CreateDefault || (() => 0.0),
        Meta: type.Meta || {},
        Render: type.Render,
        Fix: () => 'canNotFixed',
    };
}
exports.createFloatScheme = createFloatScheme;
exports.floatScheme = createFloatScheme();
//# sourceMappingURL=Type.js.map