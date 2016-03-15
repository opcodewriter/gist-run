import {inject, bindable} from 'aurelia-framework';
import {DialogService} from 'aurelia-dialog';
import {User} from '../github/user';
import {OpenGist} from './open-gist';

@inject(User, DialogService)
export class Header {
    @bindable import;
    @bindable new;

    constructor(user, dialogService) {
        this.user = user;
        this.dialogService = dialogService;
    }

    openGist() {
        const importGist = this.import;
        this.dialogService.open({ viewModel: OpenGist }).then(response => {
            if (!response.wasCancelled) {
               importGist({ urlOrId: response.output.url });
            }
        });
    }
}