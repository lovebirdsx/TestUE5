"use strict";
/* eslint-disable spellcheck/spell-checker */
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertFlase = exports.assertTrue = exports.assertNe = exports.assertEq = exports.test = void 0;
const Log_1 = require("./Log");
const Util_1 = require("./Util");
function test(name, fun) {
    try {
        fun();
        (0, Log_1.log)(`[${name}] passed`);
    }
    catch (e) {
        const e1 = e;
        (0, Log_1.error)(`[${name}] failed:\n ${e1.stack}`);
    }
}
exports.test = test;
function assertEq(exp, result, msg) {
    if (!(0, Util_1.deepEquals)(exp, result)) {
        throw new Error(`assert failed: \n${msg}\n: ${JSON.stringify(exp)} !== ${JSON.stringify(result)}`);
    }
}
exports.assertEq = assertEq;
function assertNe(exp, result, msg) {
    if ((0, Util_1.deepEquals)(exp, result)) {
        throw new Error(`assert failed: \n${msg}\n: ${JSON.stringify(exp)} === ${JSON.stringify(result)}`);
    }
}
exports.assertNe = assertNe;
function assertTrue(value, msg) {
    if (!value) {
        throw new Error(`assert failed: \n${msg}\n: value is not true`);
    }
}
exports.assertTrue = assertTrue;
function assertFlase(value, msg) {
    if (value) {
        throw new Error(`assert failed: \n${msg}\n: value is not false`);
    }
}
exports.assertFlase = assertFlase;
//# sourceMappingURL=Test.js.map