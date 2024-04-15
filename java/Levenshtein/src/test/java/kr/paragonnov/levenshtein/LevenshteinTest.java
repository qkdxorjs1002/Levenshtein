package kr.paragonnov.levenshtein;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

import java.util.List;


class LevenshteinTest {

    @Test
    void koreanDecomposition() {
        List<List<Character>> testCases = List.of(
                List.of('갈', 'ㄱ', 'ㅏ', 'ㄹ'),
                List.of('향', 'ㅎ', 'ㅑ', 'ㅇ'),
                List.of('탵', 'ㅌ', 'ㅐ', 'ㅌ'),
                List.of('귬', 'ㄱ', 'ㅠ', 'ㅁ'),
                List.of('힣', 'ㅎ', 'ㅣ', 'ㅎ')
        );
        for (List<Character> tc : testCases) {
            List<Character> decomposed = KoreanComposition.decompose(tc.get(0));
            System.out.println(decomposed);
            Assertions.assertEquals(tc.subList(1, 4), decomposed);
        }
    }

    @Test
    void koreanComposition() {
        List<List<Character>> testCases = List.of(
                List.of('ㄱ', 'ㅏ', 'ㄹ', '갈'),
                List.of('ㅎ', 'ㅑ', 'ㅇ', '향'),
                List.of('ㅌ', 'ㅐ', 'ㅌ', '탵'),
                List.of('ㄱ', 'ㅠ', 'ㅁ', '귬'),
                List.of('ㅎ', 'ㅣ', 'ㅎ', '힣')
        );
        for (List<Character> tc : testCases) {
            char composed = KoreanComposition.compose(tc.get(0), tc.get(1), tc.get(2));
            System.out.println(composed);
            Assertions.assertEquals(tc.get(3), composed);
        }
    }

    @Test
    void calculate() {
        System.out.println(Levenshtein.calculate("아b이", "아이"));
    }
}