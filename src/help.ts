import * as fs from "fs";
import * as cliProgress from "cli-progress";
import {
    AVAILABLE_LETTERS,
    KNOWN_LETTER_POSITIONS_TEMPLATE,
    POSITION_EXCLUSIONS,
} from "./vars";

let KNOWN_LETTERS = [];
POSITION_EXCLUSIONS.forEach((position) => {
    position.forEach((letter) => {
        if (!KNOWN_LETTERS.includes(letter)) {
            KNOWN_LETTERS.push(letter);
        }
    });
});
KNOWN_LETTER_POSITIONS_TEMPLATE.split("")
    .filter((l) => l !== "@")
    .forEach((letter) => {
        if (!KNOWN_LETTERS.includes(letter)) {
            KNOWN_LETTERS.push(letter);
        }
    });

const createLetterCombinations = (
    availableLetters: string[],
    wordLength: number,
    possibleWords: string[] = [],
    currentWord: string = ""
): string[] => {
    availableLetters.forEach((letter) => {
        if (currentWord.length + 1 === wordLength) {
            possibleWords.push(currentWord + letter);
        } else {
            possibleWords = createLetterCombinations(
                availableLetters,
                wordLength,
                possibleWords,
                currentWord + letter
            );
        }
    });
    return possibleWords;
};

const file = fs.readFileSync(__dirname + "/data/words.txt");
const words = file
    .toString()
    .split("\n")
    .map((w) => w.toLowerCase());

const unknownCount = KNOWN_LETTER_POSITIONS_TEMPLATE.split("").filter(
    (letter) => letter === "@"
).length;

let startTime = Date.now();
console.log("Generating letter combinations");

const letterCombinations = createLetterCombinations(
    AVAILABLE_LETTERS,
    unknownCount
);

console.log(`Checking all combinations`);
const progressBar = new cliProgress.SingleBar({});
progressBar.start(letterCombinations.length, 0);

let candidates = [];

letterCombinations.forEach((combination, index) => {
    progressBar.update(index + 1);

    // Generate the word from template
    let word = KNOWN_LETTER_POSITIONS_TEMPLATE;
    for (let index = 0; index < 5; index++) {
        let char = combination.charAt(0);
        combination = combination.substring(1);
        word = word.replace("@", char);
    }

    // Ensure it matches criteria
    if (words.includes(word.toLowerCase())) {
        let isAPossibleCandidate = true;
        POSITION_EXCLUSIONS.forEach((exclusions, exclusionIndex) => {
            if (exclusions.includes(word.charAt(exclusionIndex))) {
                isAPossibleCandidate = false;
            }
        });
        KNOWN_LETTERS.forEach((inclusion) => {
            if (!word.includes(inclusion)) {
                isAPossibleCandidate = false;
            }
        });
        if (isAPossibleCandidate) {
            candidates.push(word);
        }
    }
});

progressBar.stop();
let finishTime = Date.now();

console.log(`=== CANDIDATES ===`);
candidates.map((word, index) => console.log(`${index + 1}. ${word}`));
console.log("==================");

console.log(`${candidates.length} candidate/s`);
console.log(`Took ${(finishTime - startTime) / 1000} seconds`);
