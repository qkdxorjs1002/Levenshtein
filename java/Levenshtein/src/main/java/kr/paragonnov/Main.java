package kr.paragonnov;

import kr.paragonnov.levenshtein.Levenshtein;

public class Main {

    public static void main(String[] args) {
//        for (char c : "azAZ가힣ㄱㄴㅎㅏ".toCharArray()) {
//            System.out.printf("%s = %d%n", c, (int) c);
//        }
        Levenshtein.calculate("가나다", "가나다라");
    }
}
