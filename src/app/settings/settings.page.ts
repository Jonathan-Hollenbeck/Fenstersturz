import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

export interface Settings{
  time: number;
  partynumber: number;
  rerolls: number;
  maxRounds: number;
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})

export class SettingsPage implements OnInit {

  settings: Settings = {time: 60, partynumber: 2, rerolls: 1, maxRounds: -1};

  constructor(private router: Router) { }

  ngOnInit() {
  }

  gotoHome(){
    this.router.navigate(["home"], {state: {settings: this.settings}});
  }

}
