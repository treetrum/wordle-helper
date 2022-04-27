import * as fs from "fs";
import * as cliProgress from "cli-progress";

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

export const solveWithInput = (
    KNOWN_LETTER_POSITIONS_TEMPLATE: string,
    POSITION_EXCLUSIONS: string[][],
    AVAILABLE_LETTERS: string[]
) => {
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

    const file = fs.readFileSync(__dirname + "/../data/words.txt");
    const words = file
        .toString()
        .split("\n")
        .map((w) => w.toUpperCase());

    let startTime = Date.now();
    console.log("Generating letter combinations");

    console.log(`Checking all combinations`);
    const progressBar = new cliProgress.SingleBar({});
    progressBar.start(words.length, 0);

    let candidates = [];

    words.forEach((word, index) => {
        progressBar.update(index + 1);

        // Ensure it matches criteria
        let isAPossibleCandidate = true;
        word.split("").forEach((letter) => {
            if (!AVAILABLE_LETTERS.includes(letter)) {
                isAPossibleCandidate = false;
            }
        });
        KNOWN_LETTER_POSITIONS_TEMPLATE.split("").forEach((letter, index) => {
            if (letter == "@") return;
            if (word.charAt(index) !== letter) {
                isAPossibleCandidate = false;
            }
        });
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
    });

    progressBar.stop();
    let finishTime = Date.now();

    console.log(`=== CANDIDATES ===`);
    candidates.map((word, index) => console.log(`${index + 1}. ${word}`));
    console.log("==================");

    console.log(`${candidates.length} candidate/s`);
    console.log(`Took ${(finishTime - startTime) / 1000} seconds`);
};
