package com.studyboard.service.implementation;

import com.studyboard.exception.DocumentDoesNotExistException;
import com.studyboard.exception.IllegalTagException;
import com.studyboard.exception.TagDoesNotExistException;
import com.studyboard.model.Deck;
import com.studyboard.repository.DocumentRepository;
import com.studyboard.repository.UserRepository;
import com.studyboard.service.UserSpaceService;
import com.studyboard.exception.SpaceDoesNotExist;
import com.studyboard.model.Document;
import com.studyboard.model.Space;
import com.studyboard.repository.SpaceRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/** Service used to manage user spaces. Performs space creation, getting and adding/removing documents to/from it */
@Service
public class SimpleUserSpaceService implements UserSpaceService {

    private final Logger logger = LoggerFactory.getLogger(UserSpaceService.class);

    @Autowired
    private SpaceRepository spaceRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private DocumentRepository documentRepository;

    @Override
    public List<Space> getUserSpaces(String username) {
        logger.info("Getting all user spaces for user with username " + username);
        List<Space> spaces = new ArrayList<>();
        for (Space space : spaceRepository.findByUserUsernameOrderByCreationDateDesc(username)) {
            if(space.isFavorite()) {
                spaces.add(space);
            }
        }
        for (Space space : spaceRepository.findByUserUsernameOrderByCreationDateDesc(username)) {
            if(!space.isFavorite()) {
                spaces.add(space);
            }
        }
        return spaces;
    }

    @Override
    public void addSpace(Space space) {
        logger.info("Created new user space with name " + space.getName() + " and description " + space.getDescription());
        spaceRepository.save(space);
    }

    @Override
    public void removeSpace(long spaceId) {

        Space space = spaceRepository.findSpaceById(spaceId);
        List<Document> documents = getAllDocumentsFromSpace(spaceId);
        for(Document document: documents) {
            removeDocumentFromSpace(spaceId, document.getId());
            documentRepository.deleteById(document.getId());
        }
        logger.info("Delete space with name " + space.getName());
        spaceRepository.deleteById(spaceId);
    }

    @Override
    public Space updateSpace(Space space) {
        Space storedSpace = findSpaceById(space.getId());
        if (storedSpace.isFavorite() == space.isFavorite()) {
            logger.info(
                "Changed the space name: from " + storedSpace.getName()
                + " to: " + space.getName() + " space description from "
                + storedSpace.getDescription() + " to: " + space.getDescription());
        } else {
            logger.info("Changed the space name: from " + storedSpace.getName()
                    + " to: " + space.getName() + " space description from "
                    + storedSpace.getDescription() + " to: " + space.getDescription()
                    + "and changed the preference - is favorite or not");
        }
        storedSpace.setName(space.getName());
        storedSpace.setDescription(space.getDescription());
        storedSpace.setFavorite(space.isFavorite());
        return spaceRepository.save(storedSpace);
    }

    @Override
    public List<Document> getAllDocumentsFromSpace(long spaceId) {
        Space space = findSpaceById(spaceId);
        logger.info("Getting all documents of space with name " + space.getName());
        return space.getDocuments();
    }

    @Override
    public void addDocumentToSpace(long spaceId, Document document) {
        Space space = findSpaceById(spaceId);
        space.getDocuments().add(document);
        logger.info("Add document with name " + document.getName() + " to space with name " + space.getName());
        spaceRepository.save(space);
    }

    @Override
    public void removeDocumentFromSpace(long spaceId, long documentId) {
        Space space = findSpaceById(spaceId);
        List<Document> documents = space.getDocuments().stream().filter(d -> d.getId() != documentId).collect(Collectors.toList());
        space.setDocuments(documents);
        logger.info("Remove document from space with name " + space.getName());
        spaceRepository.save(space);
    }

    @Override
    public void addTagToDocument(long documentId, String tag) {
        Document document = findDocumentById(documentId);
        checkNewTag(tag, document);
        document.getTags().add(tag);
        logger.info("Add tag [{}] to document with name {}.", tag, document.getName());
        documentRepository.save(document);
    }

    @Override
    public void removeTagFromDocument(long documentId, String tag) {
        Document document = findDocumentById(documentId);
        checkExistingTag(tag, document);
        document.getTags().remove(tag);
        logger.info("Remove tag [{}] from document with name {}.", tag, document.getName());
        documentRepository.save(document);
    }

    public void editTranscription(Document document) {
        Document storedDocument = documentRepository.findDocumentById(document.getId());
        storedDocument.setTranscription(document.getTranscription());
        logger.info("Edited the transcription of document " + storedDocument.getName());
        documentRepository.save(storedDocument);
    }

    private Space findSpaceById(long spaceId) {
        Space space = spaceRepository.findWithTagsById(spaceId).orElseThrow(SpaceDoesNotExist::new);
        return space;
    }

    private Document findDocumentById(long documentId) {
        Document document = documentRepository.findById(documentId).orElseThrow(DocumentDoesNotExistException::new);
        return document;
    }

    private void checkNewTag(String tag, Document document){
        if (tag == null || tag.matches("\\s*") || document.getTags().contains(tag)) {
            throw new IllegalTagException("Tag should not be NULL, empty or already exist for the document.");
        }
    }

    private void checkExistingTag(String tag, Document document){
        if(!document.getTags().contains(tag)){
            throw new TagDoesNotExistException();
        }
    }

    @Override
    public List<Space> getSpacesByName(String username, String searchParam) {
        logger.info("Getting all spaces containing " + searchParam + " in the name that belong to user: " + username);
        return spaceRepository.findByUserUsernameAndNameContainingOrderByCreationDateDesc(username, searchParam);
    }

    public List<Document> getDocumentsByName(long spaceId, String searchParam) {
        logger.info("Getting all documents containing " + searchParam + " in the name that belong to space: " + spaceId);
        return documentRepository.findBySpaceIdAndNameContaining(spaceId, searchParam);
    }
}
