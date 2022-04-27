"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var prompts_1 = __importDefault(require("prompts"));
var library_1 = require("./library");
var POSITION_EXCLUSIONS = [[], [], [], [], []];
var KNOWN_LETTER_POSITIONS_TEMPLATE = "@@@@@";
var AVAILABLE_LETTERS = [
    "A",
    "B",
    "C",
    "D",
    "E",
    "F",
    "G",
    "H",
    "I",
    "J",
    "K",
    "L",
    "M",
    "N",
    "O",
    "P",
    "Q",
    "R",
    "S",
    "T",
    "U",
    "V",
    "W",
    "X",
    "Y",
    "Z",
];
var go = function () { return __awaiter(void 0, void 0, void 0, function () {
    var hasKnownPositions, response, letters, knownLetterMap, _i, letters_1, letter, letterPos, notInPos, hasExcludedLetters, excludedLetters_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, (0, prompts_1["default"])({
                    type: "confirm",
                    name: "hasKnownPositions",
                    message: "Any known letters?"
                })];
            case 1:
                hasKnownPositions = (_a.sent()).hasKnownPositions;
                if (!hasKnownPositions) return [3 /*break*/, 8];
                return [4 /*yield*/, (0, prompts_1["default"])([
                        {
                            type: "list",
                            name: "letters",
                            message: "What letters?"
                        },
                    ])];
            case 2:
                response = _a.sent();
                letters = response.letters.map(function (l) {
                    return l.toUpperCase();
                });
                knownLetterMap = {};
                _i = 0, letters_1 = letters;
                _a.label = 3;
            case 3:
                if (!(_i < letters_1.length)) return [3 /*break*/, 7];
                letter = letters_1[_i];
                return [4 /*yield*/, (0, prompts_1["default"])([
                        {
                            type: "number",
                            name: "letterPos",
                            message: "What position for '".concat(letter, "'?"),
                            initial: "Unknown",
                            hint: "asdfs"
                        },
                    ])];
            case 4:
                letterPos = (_a.sent()).letterPos;
                knownLetterMap[letter] = {
                    position: letterPos === "Unknown" ? undefined : letterPos,
                    notInPositions: undefined
                };
                if (!!knownLetterMap[letter].position) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, prompts_1["default"])([
                        {
                            type: "list",
                            name: "notInPos",
                            message: "What position/s is ".concat(letter, " not in?")
                        },
                    ])];
            case 5:
                notInPos = (_a.sent()).notInPos;
                knownLetterMap[letter].notInPositions = notInPos.map(function (a) { return parseInt(a, 10); });
                _a.label = 6;
            case 6:
                _i++;
                return [3 /*break*/, 3];
            case 7:
                Object.entries(knownLetterMap).forEach(function (_a) {
                    var letter = _a[0], info = _a[1];
                    if (info.position) {
                        KNOWN_LETTER_POSITIONS_TEMPLATE = (function () {
                            var tmp = KNOWN_LETTER_POSITIONS_TEMPLATE.split("");
                            tmp[info.position - 1] = letter;
                            return tmp.join("");
                        })();
                    }
                    if (info.notInPositions) {
                        info.notInPositions.forEach(function (pos) {
                            POSITION_EXCLUSIONS[pos - 1] = __spreadArray(__spreadArray([], POSITION_EXCLUSIONS[pos - 1], true), [
                                letter,
                            ], false);
                        });
                    }
                });
                _a.label = 8;
            case 8: return [4 /*yield*/, (0, prompts_1["default"])({
                    type: "confirm",
                    name: "hasExcludedLetters",
                    message: "Any excluded letters?"
                })];
            case 9:
                hasExcludedLetters = (_a.sent()).hasExcludedLetters;
                if (!hasExcludedLetters) return [3 /*break*/, 11];
                return [4 /*yield*/, (0, prompts_1["default"])({
                        type: "list",
                        name: "excludedLetters",
                        message: "What letters?"
                    })];
            case 10:
                excludedLetters_1 = (_a.sent()).excludedLetters;
                AVAILABLE_LETTERS = AVAILABLE_LETTERS.filter(function (l) { return !excludedLetters_1.includes(l); });
                _a.label = 11;
            case 11:
                console.log(KNOWN_LETTER_POSITIONS_TEMPLATE);
                console.log(POSITION_EXCLUSIONS);
                console.log(AVAILABLE_LETTERS);
                // Kick off the solving
                (0, library_1.solveWithInput)(KNOWN_LETTER_POSITIONS_TEMPLATE, POSITION_EXCLUSIONS, AVAILABLE_LETTERS);
                return [2 /*return*/];
        }
    });
}); };
go();
