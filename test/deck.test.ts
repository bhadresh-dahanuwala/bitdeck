import { describe, expect, it } from "vitest";
import {
  ALL_CARDS,
  C2C,
  C2D,
  C2H,
  C2S,
  C3C,
  C3H,
  CAC,
  CAD,
  CAH,
  CAS,
  CJC,
  CKS,
  CQD,
  CTC,
  CTH,
  Deck,
  FULL_DECK_MASK,
  cardIndex,
  cardsMask,
  maskAnd,
  maskIntersects,
  maskOr,
  mulberry32,
  popcount,
} from "../src/index";

describe("Deck — ported test_deck.py suite", () => {
  it("test_deck: initialization, dealing specific cards, and containment", () => {
    const deck = new Deck();
    expect(deck.getCards()).toHaveLength(52);
    expect(deck.dealSpecificCard(C2C.key)).toBe(cardsMask([C2C]));
    expect(deck.dealSpecificCards(cardsMask([C2H, C3H]))).toBe(cardsMask([C2H, C3H]));
    expect(deck.dealSpecificCards(0)).toBe(0);
    expect(deck.contains(CAS.key)).toBe(true);
  });

  it("test_count: returns 52 for a new deck", () => {
    const deck = new Deck();
    expect(deck.count()).toBe(52);
  });

  it("test_shuffle: randomizes order without changing card count", () => {
    const deck = new Deck({ rng: mulberry32(42) });
    deck.shuffle();
    expect(deck.count()).toBe(52);
  });

  it("test_clear: removes all cards and sets key to 0", () => {
    const deck = new Deck();
    deck.clear();
    expect(deck.getCards()).toHaveLength(0);
    expect(deck.key).toBe(0);
  });

  it("test_add_card: adds a single card to an empty deck and updates key", () => {
    const deck = new Deck();
    deck.clear();
    deck.addCard(C2C.key);
    expect(deck.contains(C2C.key)).toBe(true);
    expect(deck.key).toBe(cardsMask([C2C]));
  });

  it("test_remove_card: removes a specific card and updates deck state", () => {
    const deck = new Deck();
    deck.removeCard(C2C.key);
    expect(deck.contains(C2C.key)).toBe(false);
    expect(deck.getCards()).toHaveLength(51);
  });

  it("test_deal_cards: deals requested number of cards and removes them from deck", () => {
    const deck = new Deck();
    deck.reset();
    const cards = deck.dealCards(2);
    expect(cards).toBeGreaterThan(0);
    expect(popcount(cards)).toBe(2);
    expect(deck.contains(cards)).toBe(false);
  });

  it("test_reset: restores deck to full 52 cards and FULL_DECK_MASK", () => {
    const deck = new Deck();
    deck.clear();
    deck.reset();
    expect(deck.getCards()).toHaveLength(52);
    expect(deck.key).toBe(FULL_DECK_MASK);
  });

  it("test_add_cards: adds multiple cards and is idempotent when called repeatedly", () => {
    const deck = new Deck();
    deck.clear();
    const cardsKey = cardsMask([C2C, C3H]);
    deck.addCards(cardsKey);
    expect(deck.contains(C2C.key)).toBe(true);
    expect(deck.contains(C3H.key)).toBe(true);
    deck.addCards(cardsKey);
    expect(deck.count()).toBe(2);
  });

  it("test_remove_cards: removes multiple cards from the deck", () => {
    const deck = new Deck();
    const cardsKey = cardsMask([C2C, C3H]);
    deck.removeCards(cardsKey);
    expect(deck.contains(C2C.key)).toBe(false);
    expect(deck.contains(C3H.key)).toBe(false);
    expect(deck.count()).toBe(50);
  });

  it("test_deal_cards_too_many: throws RangeError when drawing more cards than remaining", () => {
    const deck = new Deck();
    deck.clear();
    deck.addCard(C2C.key);
    expect(deck.getCards()).toHaveLength(1);
    expect(() => deck.dealCards(2)).toThrow(
      new RangeError("Only 1 cards remaining; cannot draw 2"),
    );
  });

  it("test_deal_cards_negative: throws RangeError when drawing a negative number of cards", () => {
    const deck = new Deck();
    expect(() => deck.dealCards(-1)).toThrow(
      new RangeError("Cannot draw a negative number of cards"),
    );
  });

  it("test_deal_specific_card_not_in_deck: throws RangeError when card is absent", () => {
    const deck = new Deck();
    deck.clear();
    expect(() => deck.dealSpecificCard(C2C.key)).toThrow(new RangeError("Card not in deck"));
  });

  it("test_get_remaining_cards_key_full_deck: returns FULL_DECK_MASK", () => {
    const deck = new Deck();
    expect(deck.getRemainingCardsKey()).toBe(FULL_DECK_MASK);
  });

  it("test_get_remaining_cards_key_after_dealing: excludes dealt cards and has 47 bits", () => {
    const deck = new Deck();
    const dealtCards = deck.dealCards(5);
    const remainingKey = deck.getRemainingCardsKey();
    expect(maskAnd(remainingKey, dealtCards)).toBe(0);
    expect(popcount(remainingKey)).toBe(47);
  });

  it("test_get_remaining_cards_key_empty_deck: returns 0", () => {
    const deck = new Deck();
    deck.clear();
    expect(deck.getRemainingCardsKey()).toBe(0);
  });

  it("test_get_remaining_cards_full_deck: returns all 52 unique cards", () => {
    const deck = new Deck();
    const remainingCards = deck.getRemainingCards();
    expect(remainingCards).toHaveLength(52);
    const uniqueKeys = new Set(remainingCards.map((c) => c.key));
    expect(uniqueKeys.size).toBe(52);
  });

  it("test_get_remaining_cards_after_dealing: returns 47 unique cards", () => {
    const deck = new Deck();
    deck.dealCards(5);
    const remainingCards = deck.getRemainingCards();
    expect(remainingCards).toHaveLength(47);
    const uniqueKeys = new Set(remainingCards.map((c) => c.key));
    expect(uniqueKeys.size).toBe(47);
  });

  it("test_get_remaining_cards_empty_deck: returns empty array", () => {
    const deck = new Deck();
    deck.clear();
    expect(deck.getRemainingCards()).toEqual([]);
  });

  it("test_get_remaining_cards_after_specific_deal: excludes specifically dealt cards", () => {
    const deck = new Deck();
    deck.dealSpecificCard(C2C.key);
    deck.dealSpecificCard(CAS.key);
    const remainingCards = deck.getRemainingCards();
    expect(remainingCards).toHaveLength(50);
    const remainingKeys = new Set(remainingCards.map((c) => c.key));
    expect(remainingKeys.has(C2C.key)).toBe(false);
    expect(remainingKeys.has(CAS.key)).toBe(false);
  });

  it("test_remaining_cards_consistency: getRemainingCardsKey and getRemainingCards match", () => {
    const deck = new Deck();
    deck.dealCards(10);
    const remainingKey = deck.getRemainingCardsKey();
    const remainingCards = deck.getRemainingCards();
    expect(remainingKey).toBe(cardsMask(remainingCards));
    expect(popcount(remainingKey)).toBe(remainingCards.length);
  });
});

describe("Deck — A7 fixes, determinism, fairness, ordering, and error paths", () => {
  it("regression for Python shuffle bug: shuffle() only shuffles remaining cards", () => {
    const deck = new Deck({ rng: mulberry32(99) });
    const first10 = deck.dealCards(10);
    expect(popcount(first10)).toBe(10);
    expect(deck.count()).toBe(42);

    deck.shuffle();
    expect(deck.count()).toBe(42);

    const rest42 = deck.dealCards(42);
    expect(popcount(rest42)).toBe(42);
    expect(maskIntersects(first10, rest42)).toBe(false);
    expect(maskOr(first10, rest42)).toBe(FULL_DECK_MASK);
    expect(deck.count()).toBe(0);
  });

  it("seeded determinism: two decks with mulberry32(7) deal identical sequences", () => {
    const deck1 = new Deck({ rng: mulberry32(7) });
    const deck2 = new Deck({ rng: mulberry32(7) });

    for (let i = 0; i < 10; i++) {
      expect(deck1.dealCards(5)).toBe(deck2.dealCards(5));
    }
    expect(deck1.dealCards(2)).toBe(deck2.dealCards(2));
    expect(deck1.count()).toBe(0);
    expect(deck2.count()).toBe(0);
  });

  it("fairness sanity: dealing 1 card from a fresh deck 52,000 times with mulberry32(1) hits each card 800–1,200 times", () => {
    const counts = new Uint32Array(52);
    const deck = new Deck({ rng: mulberry32(1) });

    for (let i = 0; i < 52000; i++) {
      deck.reset();
      const key = deck.dealCards();
      const idx = cardIndex(key);
      counts[idx] = (counts[idx] ?? 0) + 1;
    }

    for (let i = 0; i < 52; i++) {
      const c = counts[i] ?? 0;
      expect(c).toBeGreaterThanOrEqual(800);
      expect(c).toBeLessThanOrEqual(1200);
    }
  });

  it("shuffle() is fair: the first card after shuffle() is uniform", () => {
    const counts = new Uint32Array(52);
    const deck = new Deck({ rng: mulberry32(3) });
    for (let i = 0; i < 52000; i++) {
      deck.reset();
      deck.shuffle();
      const idx = cardIndex(deck.dealCards(1, false));
      counts[idx] = (counts[idx] ?? 0) + 1;
    }
    for (const c of counts) {
      expect(c).toBeGreaterThanOrEqual(800);
      expect(c).toBeLessThanOrEqual(1200);
    }
  });

  it("dealCards(n, true) calls rng exactly n times", () => {
    let calls = 0;
    const baseRng = mulberry32(123);
    const countingRng = (): number => {
      calls++;
      return baseRng();
    };

    const deck = new Deck({ rng: countingRng });
    deck.dealCards(7, true);
    expect(calls).toBe(7);

    deck.dealCards(5, false);
    expect(calls).toBe(7);
  });

  it("dealCards(n, false) deals in current deck order (2♣, 2♦, 2♥, ... on a fresh deck)", () => {
    const deck = new Deck();
    expect(deck.dealCards(1, false)).toBe(C2C.key);
    expect(deck.dealCards(3, false)).toBe(cardsMask([C2D, C2H, C2S]));
    expect(deck.dealCards(1, false)).toBe(C3C.key);
  });

  it("addCard is a no-op if already present and appends new cards to the end of the order", () => {
    const deck = new Deck({ cards: cardsMask([C2D, CTH, CAS]) });
    expect(deck.count()).toBe(3);

    deck.addCard(CTH.key);
    expect(deck.count()).toBe(3);

    // Deal 1 from the front (C2D), then add C2C (should go to the end after CAS)
    expect(deck.dealCards(1, false)).toBe(C2D.key);
    deck.addCard(C2C.key);
    deck.addCard(C2C.key);
    expect(deck.count()).toBe(3);

    expect(deck.dealCards(1, false)).toBe(CTH.key);
    expect(deck.dealCards(1, false)).toBe(CAS.key);
    expect(deck.dealCards(1, false)).toBe(C2C.key);
  });

  it("addCards adds only missing cards in ascending index order to the end", () => {
    const deck = new Deck({ cards: cardsMask([CAS, C2D]) });
    // Initial order from options.cards is ascending: [C2D, CAS]
    expect(deck.dealCards(1, false)).toBe(C2D.key);
    // Remaining is [CAS]; now add [C2C, CTC, CAS] -> missing are [C2C, CTC], added in ascending order after CAS
    deck.addCards(cardsMask([C2C, CTC, CAS]));
    expect(deck.count()).toBe(3);
    expect(deck.dealCards(1, false)).toBe(CAS.key);
    expect(deck.dealCards(1, false)).toBe(C2C.key);
    expect(deck.dealCards(1, false)).toBe(CTC.key);
  });

  it("removeCard and removeCards are no-ops for absent cards and preserve the order of the rest", () => {
    const highMask = cardsMask([CTC, CJC, CQD, CKS, CAS]);
    const deck = new Deck({ cards: highMask });

    // Removing absent cards is a no-op
    deck.removeCard(C2C.key);
    deck.removeCards(cardsMask([C2C, C2D]));
    expect(deck.count()).toBe(5);

    // Remove middle cards CJC and CKS, check order of remaining [CTC, CQD, CAS]
    deck.removeCard(CJC.key);
    deck.removeCards(cardsMask([C2C, CKS]));
    expect(deck.count()).toBe(3);
    expect(deck.dealCards(1, false)).toBe(CTC.key);
    expect(deck.dealCards(1, false)).toBe(CQD.key);
    expect(deck.dealCards(1, false)).toBe(CAS.key);
  });

  it("dealSpecificCards is atomic: changes nothing if any requested card is missing", () => {
    const initial = cardsMask([C2C, CTC, CAS]);
    const deck = new Deck({ cards: initial });

    expect(() => deck.dealSpecificCards(cardsMask([C2C, CKS, CAS]))).toThrow(
      new RangeError("Card not in deck"),
    );
    expect(deck.key).toBe(initial);
    expect(deck.count()).toBe(3);
    expect(deck.dealCards(1, false)).toBe(C2C.key);
    expect(deck.dealCards(1, false)).toBe(CTC.key);
    expect(deck.dealCards(1, false)).toBe(CAS.key);
  });

  it("clone() creates an independent copy with identical card set and order", () => {
    const deck = new Deck({ rng: mulberry32(11) });
    deck.shuffle();
    deck.dealCards(5, false);

    const copy = deck.clone();
    expect(copy.key).toBe(deck.key);
    expect(copy.count()).toBe(deck.count());

    // Dealing unshuffled from both yields the exact same order
    const fromOriginal = deck.dealCards(10, false);
    expect(copy.count()).toBe(47);
    const fromCopy = copy.dealCards(10, false);
    expect(fromCopy).toBe(fromOriginal);

    // Clearing copy does not affect original
    copy.clear();
    expect(copy.count()).toBe(0);
    expect(deck.count()).toBe(37);
  });

  it("handles cards above bit 32 across all operations", () => {
    const acesAndTens = cardsMask([CTC, CTH, CAC, CAD, CAH, CAS]);
    const deck = new Deck({ cards: acesAndTens });
    expect(deck.count()).toBe(6);
    expect(deck.contains(cardsMask([CTC, CAS]))).toBe(true);
    expect(deck.dealSpecificCard(CAS.key)).toBe(CAS.key);
    expect(deck.contains(CAS.key)).toBe(false);
    expect(deck.dealSpecificCards(cardsMask([CAC, CAD]))).toBe(cardsMask([CAC, CAD]));
    expect(deck.count()).toBe(3);
    expect(deck.getCards()).toEqual([CTC, CTH, CAH]);
    expect(ALL_CARDS[51]).toBe(CAS);
  });

  it("validates all invalid mask, key, and count arguments with RangeError", () => {
    expect(() => new Deck({ cards: -1 })).toThrow(new RangeError("Invalid card mask: -1"));
    expect(() => new Deck({ cards: 1.5 })).toThrow(new RangeError("Invalid card mask: 1.5"));
    expect(() => new Deck({ cards: FULL_DECK_MASK + 1 })).toThrow(
      new RangeError(`Invalid card mask: ${String(FULL_DECK_MASK + 1)}`),
    );

    const deck = new Deck();

    for (const badMask of [-1, 1.5, Number.NaN, FULL_DECK_MASK + 1]) {
      const expected = new RangeError(`Invalid card mask: ${String(badMask)}`);
      expect(() => deck.contains(badMask)).toThrow(expected);
      expect(() => {
        deck.addCards(badMask);
      }).toThrow(expected);
      expect(() => {
        deck.removeCards(badMask);
      }).toThrow(expected);
      expect(() => deck.dealSpecificCards(badMask)).toThrow(expected);
    }

    for (const badKey of [0, 3, -1, 1.5, Number.NaN, FULL_DECK_MASK]) {
      const expected = new RangeError(`Invalid card key: ${String(badKey)}`);
      expect(() => {
        deck.addCard(badKey);
      }).toThrow(expected);
      expect(() => {
        deck.removeCard(badKey);
      }).toThrow(expected);
      expect(() => deck.dealSpecificCard(badKey)).toThrow(expected);
    }

    for (const badCount of [1.5, -1.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => deck.dealCards(badCount)).toThrow(
        new RangeError(`Invalid card count: ${String(badCount)}`),
      );
    }
    expect(() => deck.dealCards("2" as unknown as number)).toThrow(
      new RangeError("Invalid card count: 2"),
    );
    expect(() => deck.dealCards(-5)).toThrow(
      new RangeError("Cannot draw a negative number of cards"),
    );
    expect(() => deck.dealCards(53)).toThrow(
      new RangeError("Only 52 cards remaining; cannot draw 53"),
    );
  });
});
