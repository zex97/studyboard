package com.studyboard.dto;


import com.studyboard.model.Flashcard;

public class FlashcardDTO {

    private Long id;
    private String question;
    private String answer;
    private int confidence_level;
    private DeckDTO deckDTO;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getQuestion() {
        return question;
    }

    public void setQuestion(String question) {
        this.question = question;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public int getConfidence_level() {
        return confidence_level;
    }

    public void setConfidence_level(int confidence_level) {
        this.confidence_level = confidence_level;
    }

    public DeckDTO getDeckDTO() {
        return deckDTO;
    }

    public void setDeckDTO(DeckDTO deckDTO) {
        this.deckDTO = deckDTO;
    }

    public Flashcard FlashcardFromFlashcardDTO() {
        Flashcard flashcard = new Flashcard();
        flashcard.setId(this.id);
        flashcard.setQuestion(this.question);
        flashcard.setAnswer(this.answer);
        flashcard.setConfidence_level(this.confidence_level);
        if (this.deckDTO != null) {
            flashcard.setDeck(this.deckDTO.toDeck());
        }
        return flashcard;
    }

    public static FlashcardDTO FlashcardDTOFromFlashcard(Flashcard flashcard) {
        FlashcardDTO flashcardDTO = new FlashcardDTO();
        flashcardDTO.setId(flashcard.getId());
        flashcardDTO.setQuestion(flashcard.getQuestion());
        flashcardDTO.setAnswer(flashcard.getAnswer());
        flashcardDTO.setConfidence_level(flashcard.getConfidence_level());
        flashcardDTO.setDeckDTO(DeckDTO.of(flashcard.getDeck()));
        return flashcardDTO;
    }

    @Override
    public String toString() {
        return "FlashcardDTO{" +
                "id=" + id +
                ", question='" + question + '\'' +
                ", answer='" + answer + '\'' +
                ", confidenceLevel=" + confidence_level +
                (deckDTO == null ? ", deckDTO=null" : ", deckDTO=" + deckDTO.toString()) +
                '}';
    }

}