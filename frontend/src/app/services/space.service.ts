import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Globals} from '../global/globals';
import {AuthService} from './auth.service';
import {Space} from '../dtos/space';
import { Tag } from '../dtos/tag';
import {Document} from '../dtos/document';
import { tap } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class SpaceService {
  private documents = new Map<number, Document[]>();
  private spaces = new Map<string, Space[]>();

  constructor(private httpClient: HttpClient, private globals: Globals, private authService: AuthService) {
  }

  private spaceBaseUri: string = this.globals.backendUri + '/api/space';

  /**
   * Loads all spaces from the backend
   */
  getSpaces(username: string): Observable<Space[]> {
    console.log('Searching for spaces.');
    return this.httpClient.get<Space[]>(this.spaceBaseUri + '/search/' + username).pipe(
      tap( (s: Space[]) => {
        this.spaces.set(username, [...s]);
      }));
  }

  /**
   * Persists space to the backend
   * @param space to persist
   */
  createSpace(space: Space): Observable<Space> {
    console.log('Create space with name ' + space.name);
    return this.httpClient.post<Space>(this.spaceBaseUri, space);
  }

  /**
   * Delete space from backend
   * @param id of the space to delete
   */
  deleteSpace(id: number): Observable<Space> {
    console.log('Delete a space');
    return this.httpClient.delete<Space>(this.spaceBaseUri + '/' + id);
  }

  /**
   * Edit space in the backend
   * @param space to make changes to
   */
  editSpace(space: Space): Observable<Space> {
    console.log('Edit the space' + space.name);
    return this.httpClient.put<Space>(this.spaceBaseUri, space);
  }

  /**
   * Load all documents for a given user space
   * @param userName name of the current user
   * @param spaceId whose documents the user wants to see
   * */
  getAllDocuments(userName: string, spaceId: number): Observable<Object> {
    console.log('Getting all the documents for space ' + spaceId);
    return this.httpClient.get<Document[]>(this.spaceBaseUri + '/' + userName + '/' + spaceId).pipe(
      tap( (r: Document[]) => {
        this.documents.set(spaceId, [...r]);
      }));
  }

  /**
   * Delete a single document from a given user space
   * @param space where we want to delete a document
   * @param documentId id of the exact document we want to delete
   * */
  deleteDocument(space: Space, documentId: number): Observable<Object> {
    console.log('Deleting document ' + documentId + ' for space ' + space.name);
    // this.httpClient.delete(this.spaceBaseUri);
    return this.httpClient.delete(this.spaceBaseUri + '/' + space.id + '/' + documentId);
  }

  /**
   * Edit transcription of a document
   * @param document to make changes to
   */
  editTranscription(document: Document): Observable<Document> {
    console.log('Edit transcription - document ' + document.name);
    return this.httpClient.put<Document>(this.spaceBaseUri + '/document' + document.id, document);
  }

  /**
   * Add a single tag to a given document
   * @param tag tag to be added
   * @param documentId id of the exact document we want to add it to
   * */
  addTag(tag: Tag, documentId: number): Observable<Object> {
    console.log('Adding tag ' + tag + ' to document ' + documentId);
    return this.httpClient.post(this.spaceBaseUri + '/' + documentId, tag);
  }

  /**
   * Delete a single tag from a given document
   * @param tag tag to be deleted
   * @param documentId id of the exact document we want to delete it from
   * */
  deleteTag(tag: string, documentId: number): Observable<Object> {
    console.log('Deleting tag ' + tag + ' from document ' + documentId);
    return this.httpClient.delete(this.spaceBaseUri + '/' + documentId + '/tag=' + tag);
  }

  /**
   * Loads all spaces with specific name
   * @param username of the space owner
   * @param searchParam name of the spaces to search for
   */
  getSpacesByName(username: string, searchParam: string): Space[] {
    console.log('Searching for spaces by name.');
    return this.spaces.get(username).filter((s: Space) => s.name.includes(searchParam));

  }

  /**
   * Load all documents for a given user space
   * @param username name of the current user
   * @param spaceId whose documents the user wants to see
   * @param searchParam name of the documents to search for
   * */
  getDocumentsByName(spaceId: number, searchParam: string): Document[] {
    console.log('Getting specific documents for space ' + spaceId);
    return this.documents.get(spaceId).filter(d => d.name.includes(searchParam));
  }

  /**
   * Load all documents for a given user space
   * @param username name of the current user
   * @param spaceId whose documents the user wants to see
   * @param searchParam name or tag of the documents to search for
   * */
  getDocumentsByNameAndTags(spaceId: number, searchParam: string): Document[] {
    console.log('Getting specific documents for space ' + spaceId);
    let filteredDocs = new Set<Document>([
      ...this.documents.get(spaceId).filter(d => d.name.includes(searchParam)),
      ...this.documents.get(spaceId).filter(d => 
                     d.tags.filter(t => t.includes(searchParam)).length > 0)
      ]);

    return [...filteredDocs];
  }
}
