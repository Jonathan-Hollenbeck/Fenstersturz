import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Settings } from '../settings/settings.page'

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  settings: Settings = {time: 60, partynumber: 2, rerolls: 1, maxRounds: -1};

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      if (this.router.getCurrentNavigation().extras.state) {
        this.settings = this.router.getCurrentNavigation().extras.state.settings;
      }
    });
  }

  ngOnInit() {
  }

  gotoGame(){
    this.router.navigate(['game'], {state: {settings: this.settings}});
  }

  gotoSettings(){
    this.router.navigate(['settings'])
  }

}
