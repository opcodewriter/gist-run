import {inject, computedFrom} from 'aurelia-framework';
import {DialogController} from 'aurelia-dialog';
import {Gists} from '../github/gists';

@inject(Gists, DialogController)
export class OpenGist {
    gistsService;
    gists = [];
    loading = true;
    currentGist = null;

    constructor(gistsService, controller) {
        this.controller = controller;
        this.gistsService = gistsService;
    }

    activate() {
        this.loading = true;
        this.gistsService
            .list()
            .then(this.load.bind(this))
            .then(() => this.loading = false);
    }

    load(gists) {
        gists.forEach(gist => {
            gist.fileItems = Object.keys(gist.files).map((file) => gist.files[file]);
            gist.dateCreated = new Date(gist.created_at);
            gist.dateUpdated = new Date(gist.updated_at);
        });

        this.gists = gists;
        this.allGists = gists.slice();
    }

    select(gist) {
        if (this.selectedGist) {
            this.selectedGist.isSelected = null;
        }

        this.selectedGist = gist;
        gist.isSelected = 'selected';
    }

    _keyword = null;
    @computedFrom('_keyword')
    get keyword() {
        return this._keyword;
    }
    set keyword(keyword) {
        if (keyword) {
            keyword = keyword.trim().toLowerCase();
        }

        if (keyword.length == 0) {
            keyword = null;
        }

        if (this._keyword != keyword) {
            this.currentGist = null;
            this._keyword = keyword;
            this.updateGists();
        }
    }

    _sortBy = "dateCreated,desc";
    @computedFrom('_sortBy')
    get sortBy() {
        return this._sortBy;
    }
    set sortBy(sortBy) {
        this.currentGist = null;
        this._sortBy = sortBy;
        this.updateGists();
    }

    _privacyState = "3";
    @computedFrom('_privacyState')
    get privacyState() {
        return this._privacyState;
    }
    set privacyState(privacyState) {
        this.currentGist = null;
        this._privacyState = privacyState;
        this.updateGists();
    }

    sort(gists) {
        const params = this.sortBy.split(',');
        let propertyName = params[0];
        let direction = (params[1] === "desc" ? 1 : -1);

        return gists.sort(function(g1, g2) {
            return (g1[propertyName] < g2[propertyName] ? 1 : -1) * direction;
        });
    }
    
    filterByPrivacy(gists) {
        let selectedPrivacyState = parseInt(this._privacyState);

        return gists.filter((gist) => {
            const privacyState = gist.public ? 2 : 1;
            return ((privacyState & selectedPrivacyState) === privacyState);
        });
    }
    
    filterByKeyword() {
        if (!this.keyword) {
            return this.allGists.slice();
        }
        else {
            return this.allGists.filter((gist) => gist.description && gist.description.toLowerCase().indexOf(this._keyword) >= 0);
        }
    }
    
    updateGists()
    {
        let gists = this.filterByKeyword();
        gists = this.filterByPrivacy(gists);
        gists = this.sort(gists);
        this.gists = gists;
    }
}