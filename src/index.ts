import prompts from "prompts";
import { solveWithInput } from "./library";

let POSITION_EXCLUSIONS = [[], [], [], [], []];
let KNOWN_LETTER_POSITIONS_TEMPLATE = "@@@@@";
let AVAILABLE_LETTERS = [
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

const go = async () => {
    const { hasKnownPositions } = await prompts({
        type: "confirm",
        name: "hasKnownPositions",
        message: "Any known letters?",
    });

    if (hasKnownPositions) {
        const response = await prompts([
            {
                type: "list",
                name: "letters",
                message: "What letters?",
            },
        ]);
        const letters = (response.letters as string[]).map((l) =>
            l.toUpperCase()
        );
        const knownLetterMap: Record<
            string,
            {
                position: number | undefined;
                notInPositions: number[] | undefined;
            }
        > = {};
        for (let letter of letters) {
            const { letterPos } = await prompts([
                {
                    type: "number",
                    name: "letterPos",
                    message: `What position for '${letter}'?`,
                    initial: "Unknown",
                    hint: "asdfs",
                },
            ]);
            knownLetterMap[letter] = {
                position: letterPos === "Unknown" ? undefined : letterPos,
                notInPositions: undefined,
            };
            if (!knownLetterMap[letter].position) {
                const { notInPos } = await prompts([
                    {
                        type: "list",
                        name: "notInPos",
                        message: `What position/s is ${letter} not in?`,
                    },
                ]);
                knownLetterMap[letter].notInPositions = (
                    notInPos as string[]
                ).map((a) => parseInt(a, 10));
            }
        }

        Object.entries(knownLetterMap).forEach(([letter, info]) => {
            if (info.position) {
                KNOWN_LETTER_POSITIONS_TEMPLATE = (() => {
                    let tmp = KNOWN_LETTER_POSITIONS_TEMPLATE.split("");
                    tmp[info.position - 1] = letter;
                    return tmp.join("");
                })();
            }
            if (info.notInPositions) {
                info.notInPositions.forEach((pos) => {
                    POSITION_EXCLUSIONS[pos - 1] = [
                        ...POSITION_EXCLUSIONS[pos - 1],
                        letter,
                    ];
                });
            }
        });
    }

    const { hasExcludedLetters } = await prompts({
        type: "confirm",
        name: "hasExcludedLetters",
        message: "Any excluded letters?",
    });

    if (hasExcludedLetters) {
        const { excludedLetters } = await prompts({
            type: "list",
            name: "excludedLetters",
            message: "What letters?",
        });
        AVAILABLE_LETTERS = AVAILABLE_LETTERS.filter(
            (l) => !(excludedLetters as string[]).includes(l)
        );
    }

    console.log(KNOWN_LETTER_POSITIONS_TEMPLATE);
    console.log(POSITION_EXCLUSIONS);
    console.log(AVAILABLE_LETTERS);

    // Kick off the solving
    solveWithInput(
        KNOWN_LETTER_POSITIONS_TEMPLATE,
        POSITION_EXCLUSIONS,
        AVAILABLE_LETTERS
    );
};

go();
