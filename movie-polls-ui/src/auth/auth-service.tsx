import {User as OidcUser, UserManager, UserManagerSettings} from 'oidc-client';

export default class AuthService {
  private static _instance: AuthService;
  private _userManager: UserManager;
  
  private constructor() {
    const userManagementSettings: UserManagerSettings = {
      authority: process.env.REACT_APP_HYDRA_PUBLIC,
      client_id: process.env.REACT_APP_CLIENT_ID,
      redirect_uri: process.env.REACT_APP_REDIRECT_URI,
      response_type: 'code',
      scope: process.env.REACT_APP_CLIENT_SCOPES,
      post_logout_redirect_uri: process.env.REACT_APP_POST_LOGOUT_REDIRECT 
    }

    this._userManager = new UserManager(userManagementSettings);
  }

  public static getInstance() {
    if (this._instance)
      return this._instance;

    return new AuthService();
  }

  public getUser(): Promise<OidcUser | null> {
    return this._userManager.getUser();
  }

  public startAuthentication(): Promise<void> {
    // here may be a catch clause if there is an error connecting.
    return this._userManager.signinRedirect()
  }

  public async completeAuthentication(): Promise<OidcUser | void> {
    return this._userManager.signinRedirectCallback();
  }

  // ...
}