const Assert = require('assert');

const Levenshtein = require("../src/Levenshtein").Levenshtein;
const KoreanComposition = require("../src/Levenshtein").KoreanComposition;

const TEST_CASES = [
    ['갈', 'ㄱ', 'ㅏ', 'ㄹ'],
    ['향', 'ㅎ', 'ㅑ', 'ㅇ'],
    ['탵', 'ㅌ', 'ㅐ', 'ㅌ'],
    ['귬', 'ㄱ', 'ㅠ', 'ㅁ'],
    ['힣', 'ㅎ', 'ㅣ', 'ㅎ']
];

describe('Levenshtein Test', () => {
    it('KoreanDecomposition', koreanDecomposition);
    it('KoreanComposition', koreanComposition);
    it('CalculateKODistance', calculateKorean);
    it('CalculateENDistance', calculateEnglish);
});

function koreanDecomposition() {
    TEST_CASES.forEach(element => {
        const decomposed = KoreanComposition.decompose(element[0]);
        Assert.equal(element.slice(1).toString(), decomposed.toString()); 
    });
}

function koreanComposition() {
    TEST_CASES.forEach(element => {
        const composed = KoreanComposition.compose(...element.slice(1));
         Assert.equal(element[0], composed); 
    });
}

function calculateKorean() {
    Assert.equal(Levenshtein.calculate("아이", "아이").toFixed(3), 0);
    Assert.equal(Levenshtein.calculate("아b이", "아이").toFixed(3), 1);
    Assert.equal(Levenshtein.calculate("야이", "아이").toFixed(3), 0.333);
    Assert.equal(Levenshtein.calculate("야이야이야야", "아이").toFixed(3), 4.333);
    Assert.equal(Levenshtein.calculate("가나다라마", "갸냐댜랴먀").toFixed(3), 1.667);
}

function calculateEnglish() {
    Assert.equal(Levenshtein.calculate("abcd", "abcd").toFixed(3), 0);
    Assert.equal(Levenshtein.calculate("abcdedd", "abcdefg").toFixed(3), 0.667);
    Assert.equal(Levenshtein.calculate("agbcd", "abgcd").toFixed(3), 0.667);
    Assert.equal(Levenshtein.calculate("gabcd", "abcdg").toFixed(3), 1.667);
    Assert.equal(Levenshtein.calculate("abcdf", "zabcd").toFixed(3), 1.667);
}
