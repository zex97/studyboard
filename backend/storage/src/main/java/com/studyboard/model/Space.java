package com.studyboard.model;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
public class Space {
    @Column(name="sb_space_id")
    private long id;
    private String name;
    @OnDelete(action = OnDeleteAction.CASCADE)
    private List<Document> documents;
    private User user;
    private String description;
    private LocalDate creationDate;
    private boolean favorite;

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE)
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    @Column(name = "description")
    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    @Column(nullable = false, name = "creationDate")
    public LocalDate getCreationDate() {
        return this.creationDate;
    }

    public void setCreationDate(LocalDate creationDate) {
        this.creationDate = creationDate;
    }

    @Column(nullable = true, name = "favorite")
    public boolean isFavorite() { return this.favorite; }

    public void setFavorite(boolean favorite) {
        this.favorite = favorite;
    }

    @OneToMany(mappedBy = "space", cascade = CascadeType.ALL, fetch = FetchType.EAGER)
    public List<Document> getDocuments() {
        if (documents == null) {
            documents = new ArrayList<>();
        }
        return documents;
    }

    public void setDocuments(List<Document> documents) {
        this.documents = documents;
    }

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sb_user_id")
    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Space space = (Space) o;
        return id == space.id;
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, documents);
    }

    public void removeDocument(Document document) {
        documents.removeIf(storedDocument -> storedDocument.getId() == document.getId());
    }

    public Space () {}

    public Space (String name, User user) {
        this.name = name;
        this.user = user;
    }

    public Space (String name, LocalDate creationDate, User user) {
        this.name = name;
        this.creationDate = creationDate;
        this.user = user;
    }

    public Space (String name, String description, User user) {
        this.name = name;
        this.user = user;
        this.description = description;
    }
}
