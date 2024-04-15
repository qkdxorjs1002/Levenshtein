class Levenshtein {

    /**
     * calculate
     * @param {string} str1 
     * @param {string} str2 
     * @returns {number}
     */
    static calculate(str1, str2) {
        if (str1.length < str2.length) {
            return this.calculate(str2, str1);
        }

        if (str2.length == 0) {
            return str1.length;
        }

        let previousRow = [...Array(str2.length + 1).keys()];
        for (let idx1 = 0; idx1 < str1.length; idx1++) {
            const char1 = str1[idx1];

            let currentRow = [idx1 + 1.0];
            for (let idx2 = 0; idx2 < str2.length; idx2++) {
                const char2 = str2[idx2];
                const substitutionCost = char1 == char2 ? 0 : this.calculateWithCosts(
                        KoreanComposition.decomposeToString(char1),
                        KoreanComposition.decomposeToString(char2),
                        {}
                ) / 3;

                const insertions = previousRow[idx2 + 1] + 1;
                const deletions = currentRow[idx2] + 1;
                const substitutions = previousRow[idx2] + substitutionCost;

                currentRow.push(Math.min(Math.min(insertions, deletions), substitutions));
            }

            previousRow = [...currentRow];
        }

        return previousRow.pop();
    }

    /**
     * calculateWithCosts
     * @param {string} str1 
     * @param {string} str2 
     * @param {object} costs 
     * @returns {number}
     */
    static calculateWithCosts(str1, str2, costs) {
        if (str1.length < str2.length) {
            return this.calculateWithCosts(str2, str1, costs);
        }

        if (str2.length == 0) {
            return str1.length;
        }

        let previousRow = [...Array(str2.length + 1).keys()];
        for (let idx1 = 0; idx1 < str1.length; idx1++) {
            const char1 = str1[idx1];

            let currentRow = [idx1 + 1.0];
            for (let idx2 = 0; idx2 < str2.length; idx2++) {
                const char2 = str2[idx2];
                const substitutionCost = char1 == char2 ? 0 : costs[`${char1}>${char2}`] || 1.0;

                const insertions = previousRow[idx2 + 1] + 1;
                const deletions = currentRow[idx2] + 1;
                const substitutions = previousRow[idx2] + substitutionCost;

                currentRow.push(Math.min(Math.min(insertions, deletions), substitutions));
            }

            previousRow = [...currentRow];
        }

        return previousRow.pop();
    }
}

class KoreanComposition {

    static #HANGUL_BEGIN = 44032;
    static #HANGUL_END = 55203;
    static #CHOSUNG_BASE = 588;
    static #JUNGSUNG_BASE = 28;
    static #JAUM_BEGIN = 12593;
    static #JAUM_END = 12622;
    static #MOUM_BEGIN = 12623;
    static #MOUM_END = 12643;

    static #CHOSUNG_LIST = [
            'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ',
            'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ',
            'ㅌ', 'ㅍ', 'ㅎ'
    ];

    static #JUNGSUNG_LIST = [
            'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ',
            'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ',
            'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
    ];

    static #JONGSUNG_LIST = [
            ' ', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ',
            'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ',
            'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ',
            'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ];

    static #JAUM_LIST = [
            'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄸ',
            'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ',
            'ㅁ', 'ㅂ', 'ㅃ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ',
            'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'
    ];

    static #MOUM_LIST = [
            'ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ',
            'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ',
            'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'
    ];

    /**
     * compose
     * @param {string} chosung
     * @param {string} jungsung
     * @param {string} jongsung
     * @returns {string} character
     */
    static compose(chosung, jungsung, jongsung) {
        return String.fromCharCode(this.#HANGUL_BEGIN
                + this.#CHOSUNG_BASE * this.#CHOSUNG_LIST.indexOf(chosung)
                + this.#JUNGSUNG_BASE * this.#JUNGSUNG_LIST.indexOf(jungsung)
                + this.#JONGSUNG_LIST.indexOf(jongsung));
    }

    /**
     * decompose
     * @param {string} char1 
     * @returns {Array} character list
     */
    static decompose(char1) {
        const charCode1 = char1.charCodeAt(0);

        if (!this.isHangul(char1)) {
            return [char1];
        }

        if (this.#JAUM_BEGIN <= charCode1 && charCode1 <= this.#JAUM_END) {
            return [char1, ' ', ' '];
        }
        if (this.#MOUM_BEGIN <= charCode1 && charCode1 <= this.#MOUM_END) {
            return [' ', char1, ' '];
        }

        const charCode2 = charCode1 - this.#HANGUL_BEGIN;
        const cho = parseInt(charCode2 / this.#CHOSUNG_BASE);
        const jung = parseInt((charCode2 - cho * this.#CHOSUNG_BASE) / this.#JUNGSUNG_BASE);
        const jong = parseInt(charCode2 - cho * this.#CHOSUNG_BASE - jung * this.#JUNGSUNG_BASE);

        return [this.#CHOSUNG_LIST[cho], this.#JUNGSUNG_LIST[jung], this.#JONGSUNG_LIST[jong]];
    }

    /**
     * decomposeToString
     * @param {string} char1 
     * @returns {string} character
     */
    static decomposeToString(char1) {
        return this.decompose(char1);
    }

    /**
     * isHangul
     * @param {string} char1 
     * @returns {boolean} boolean
     */
    static isHangul(char1) {
        const charCode1 = char1.charCodeAt(0);
        return ((this.#HANGUL_BEGIN <= charCode1 && charCode1 <= this.#HANGUL_END) ||
                (this.#JAUM_BEGIN <= charCode1 && charCode1 <= this.#JAUM_END) ||
                (this.#MOUM_BEGIN <= charCode1 && charCode1 <= this.#MOUM_END));
    }
}

module.exports = {
    Levenshtein,
    KoreanComposition  
};