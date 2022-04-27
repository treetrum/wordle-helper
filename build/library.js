"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
exports.__esModule = true;
exports.solveWithInput = void 0;
var fs = __importStar(require("fs"));
var cliProgress = __importStar(require("cli-progress"));
var createLetterCombinations = function (availableLetters, wordLength, possibleWords, currentWord) {
    if (possibleWords === void 0) { possibleWords = []; }
    if (currentWord === void 0) { currentWord = ""; }
    availableLetters.forEach(function (letter) {
        if (currentWord.length + 1 === wordLength) {
            possibleWords.push(currentWord + letter);
        }
        else {
            possibleWords = createLetterCombinations(availableLetters, wordLength, possibleWords, currentWord + letter);
        }
    });
    return possibleWords;
};
var solveWithInput = function (KNOWN_LETTER_POSITIONS_TEMPLATE, POSITION_EXCLUSIONS, AVAILABLE_LETTERS) {
    var KNOWN_LETTERS = [];
    POSITION_EXCLUSIONS.forEach(function (position) {
        position.forEach(function (letter) {
            if (!KNOWN_LETTERS.includes(letter)) {
                KNOWN_LETTERS.push(letter);
            }
        });
    });
    KNOWN_LETTER_POSITIONS_TEMPLATE.split("")
        .filter(function (l) { return l !== "@"; })
        .forEach(function (letter) {
        if (!KNOWN_LETTERS.includes(letter)) {
            KNOWN_LETTERS.push(letter);
        }
    });
    var file = fs.readFileSync(__dirname + "/../data/words.txt");
    var words = file
        .toString()
        .split("\n")
        .map(function (w) { return w.toLowerCase(); });
    var unknownCount = KNOWN_LETTER_POSITIONS_TEMPLATE.split("").filter(function (letter) { return letter === "@"; }).length;
    var startTime = Date.now();
    console.log("Generating letter combinations");
    var letterCombinations = createLetterCombinations(AVAILABLE_LETTERS, unknownCount);
    console.log("Checking all combinations");
    var progressBar = new cliProgress.SingleBar({});
    progressBar.start(letterCombinations.length, 0);
    var candidates = [];
    letterCombinations.forEach(function (combination, index) {
        progressBar.update(index + 1);
        // Generate the word from template
        var word = KNOWN_LETTER_POSITIONS_TEMPLATE;
        for (var index_1 = 0; index_1 < 5; index_1++) {
            var char = combination.charAt(0);
            combination = combination.substring(1);
            word = word.replace("@", char);
        }
        // Ensure it matches criteria
        if (words.includes(word.toLowerCase())) {
            var isAPossibleCandidate_1 = true;
            POSITION_EXCLUSIONS.forEach(function (exclusions, exclusionIndex) {
                if (exclusions.includes(word.charAt(exclusionIndex))) {
                    isAPossibleCandidate_1 = false;
                }
            });
            KNOWN_LETTERS.forEach(function (inclusion) {
                if (!word.includes(inclusion)) {
                    isAPossibleCandidate_1 = false;
                }
            });
            if (isAPossibleCandidate_1) {
                candidates.push(word);
            }
        }
    });
    progressBar.stop();
    var finishTime = Date.now();
    console.log("=== CANDIDATES ===");
    candidates.map(function (word, index) { return console.log("".concat(index + 1, ". ").concat(word)); });
    console.log("==================");
    console.log("".concat(candidates.length, " candidate/s"));
    console.log("Took ".concat((finishTime - startTime) / 1000, " seconds"));
};
exports.solveWithInput = solveWithInput;
