// utils/transliterate.ts

export class Transliterator {
  private readonly multiMap: [string, string][] = [
    ["O'", 'Ў'],
    ["G'", 'Ғ'],
    ['Sh', 'Ш'],
    ['Ch', 'Ч'],
    ['Ng', 'Нг'],
    ['Yo', 'Ё'],
    ['Ya', 'Я'],
    ['Ye', 'Е'],
    ['Yu', 'Ю'],
    ["o'", 'ў'],
    ["g'", 'ғ'],
    ['sh', 'ш'],
    ['ch', 'ч'],
    ['ng', 'нг'],
    ['yo', 'ё'],
    ['ya', 'я'],
    ['ye', 'е'],
    ['yu', 'ю']
  ];

  private readonly singleMap: Record<string, string> = {
    A: 'А',
    B: 'Б',
    D: 'Д',
    E: 'Э',
    F: 'Ф',
    G: 'Г',
    H: 'Ҳ',
    I: 'И',
    J: 'Ж',
    K: 'К',
    L: 'Л',
    M: 'М',
    N: 'Н',
    O: 'О',
    P: 'П',
    Q: 'Қ',
    R: 'Р',
    S: 'С',
    T: 'Т',
    U: 'У',
    V: 'В',
    X: 'Х',
    Y: 'Й',
    Z: 'З',
    a: 'а',
    b: 'б',
    d: 'д',
    e: 'э',
    f: 'ф',
    g: 'г',
    h: 'ҳ',
    i: 'и',
    j: 'ж',
    k: 'к',
    l: 'л',
    m: 'м',
    n: 'н',
    o: 'о',
    p: 'п',
    q: 'қ',
    r: 'р',
    s: 'с',
    t: 'т',
    u: 'у',
    v: 'в',
    x: 'х',
    y: 'й',
    z: 'з'
  };

  toCyrillic(text: string): string {
    let result = text;

    // Avvalo ko‘p belgili kombinatsiyalarni almashtirish
    for (const [latin, cyr] of this.multiMap) {
      const regex = new RegExp(latin, 'g');
      result = result.replace(regex, cyr);
    }

    // Keyin bitta belgili xaritalarni qo‘llash
    for (const [latin, cyr] of Object.entries(this.singleMap)) {
      const regex = new RegExp(latin, 'g');
      result = result.replace(regex, cyr);
    }

    return result;
  }
}
