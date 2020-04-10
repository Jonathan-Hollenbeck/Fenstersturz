import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router } from '@angular/router';

export interface Settings{
  time: number;
  partynumber: number;
  rerolls: number;
  maxRounds: number;
  words: string;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {

  settings: Settings = {time: 60, partynumber: 2, rerolls: 1, maxRounds: -1, words: 'wordstest'};

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.settings = this.router.getCurrentNavigation().extras.state.settings;
      }
    });
  }

  ngOnInit() {
  }

  gotoHome(){
    this.router.navigate(["home"], {state: {settings: this.settings}});
  }

}
