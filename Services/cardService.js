import { getAllCards } from "../Repositories/cardRepository";
import { decrypt } from "../utils/encryptDecrypt";

async function getAllCardsService() {
    const cards = await getAllCards();
    return cards.map((card) => {
        ...card,
        cardTitle : decrypt(card.cardTitle),
        cardLongin : decrypt(card.cardLogin),
        cardPassword : decrypt(card.cardPassword),
        cardUrl : decrypt(card.cardUrl)
    });
    }