let template = [`
  <header [banner] id="banner-letdonationId" class="banner-letdonation auth size-font" role="navigation" style="position:fixed;">
      <div id="container-letsdonationId">
          <button class="close-letdonation" (click)="returnMessage()">
              <i class="fa fa-times fa-1"></i>
          </button>
          <div class="navbar-banner-header">
              <div class="navbar-brand">
                  <img src="/src/content/ts/templates/img/defaultAvatar.png" id="avatar-letsdonation" style="position:absolute; top:5px; left:0px;">
              </div>
              <div id="banner-letsdonation-content" style="text-align:center;">
                  Grazie per avermi installato! Posso indicarti in tempo reale quando poter effettuare le donazioni
                  <div *ngIf="Auth" id="login-letsdonation" style="margin-left:5%;">
                      <a target="_blank" style="color:black; background: none; text-decoration: underline;" [href]="LoginLetsDonationUrl">Login
                          <i class="fa fa-user"></i>
                      </a>
                  </div>
              </div>
          </div>
      </div>
  </header>
`].join('');

export default template;
