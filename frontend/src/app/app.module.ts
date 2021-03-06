import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HomeComponent} from './components/home/home.component';
import {FooterComponent} from './components/footer/footer.component';
import {LoginComponent} from './components/login/login.component';
import {MessageComponent} from './components/message/message.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {httpInterceptorProviders} from './interceptors';
import {Globals} from './global/globals';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {RegisterComponent} from './components/register/register.component';
import {FlashcardManagerComponent} from './components/flashcard-manager/flashcard-manager.component';
import {DocumentSpaceComponent} from './components/space-document-slide-panel/document-space/document-space.component';
import {DocumentComponent} from './components/space-document-slide-panel/document/document.component';
import {TagBarComponent } from './components/tag-bar/tag-bar.component';
import {BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatListModule} from '@angular/material/list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatInputModule} from '@angular/material/input';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatChipsModule} from '@angular/material/chips';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {VimeModule} from '@vime/angular';
import {ConfirmDialogComponent} from './components/confirm-dialog/confirm-dialog.component';
import {SpaceDocumentSlidePanelComponent} from './components/space-document-slide-panel/space-document-slide-panel.component';
import {DocumentDialogComponent} from './components/document-dialog/document-dialog.component';
import {MatTreeModule} from '@angular/material/tree';
import {ProfileWidgetComponent } from './components/profile-widget/profile-widget.component';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { PasswordResetComponent } from './components/password-reset/password-reset.component';
import { ChangePasswordComponent } from './components/change-password/change-password.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    FooterComponent,
    LoginComponent,
    MessageComponent,
    PageNotFoundComponent,
    RegisterComponent,
    FlashcardManagerComponent,
    DocumentSpaceComponent,
    DocumentComponent,
    ConfirmDialogComponent,
    SpaceDocumentSlidePanelComponent,
    DocumentDialogComponent,
    TagBarComponent,
    ProfileWidgetComponent,
    PasswordResetComponent,
    ChangePasswordComponent
  ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        HttpClientModule,
        NgbModule,
        FormsModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatSnackBarModule,
        MatSelectModule,
        MatCardModule,
        MatToolbarModule,
        MatSidenavModule,
        MatButtonToggleModule,
        MatExpansionModule,
        MatDividerModule,
        MatListModule,
        MatCheckboxModule,
        MatInputModule,
        MatDialogModule,
        MatRadioModule,
        MatTooltipModule,
        PdfViewerModule,
        VimeModule,
        MatTreeModule,
        MatChipsModule,
        MatProgressBarModule,
        MatAutocompleteModule
    ],
  providers: [httpInterceptorProviders, Globals],
  bootstrap: [AppComponent]
})
export class AppModule {
}
