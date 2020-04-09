import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController } from '@ionic/angular';

import { Settings } from '../settings/settings.page'

interface party{
  teamNumber:number,
  points:number
}

interface words{
  mime: string[],
  explain: string[],
  draw: string[]
}

@Component({
  selector: 'app-game',
  templateUrl: './game.page.html',
  styleUrls: ['./game.page.scss'],
})
export class GamePage implements OnInit {

  settings: Settings;

  time: number = 0;
  rerolls: number = 0;
  roundCounter: number = 0;
  currentTeam: number = 1;

  partys: party[];
  wordsSave: any = require('../../assets/json/wordstest.json');
  words: words = null;
  skipCounter: number = 0;

  currentPresentationtype: string = '';
  currentWord: string = '';

  showWordsResetButton: boolean = false;

  constructor(private alertCtrl: AlertController, private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe(params => {
      this.settings = this.router.getCurrentNavigation().extras.state.settings;
      this.partys = new Array(this.settings.partynumber);
      for(let i:number = 0; i < this.partys.length; i++){
        this.partys[i] = {teamNumber:i, points:0};
      }
      this.resetWords();
    });
  }

  ngOnInit() {
  }

  gotoHome(){
    this.router.navigate(["home"], {state: {settings: this.settings}});
  }

  resetWords(){
    this.words = JSON.parse(JSON.stringify(this.wordsSave));
    this.showWordsResetButton = false;
    if(this.time > 0){
      this.newCombination(this.randomNumber(0,2));
    }
  }

  startRound(){
    this.time = this.settings.time;
    this.skipCounter = 0;
    this.timerTick();
    this.newCombination(this.randomNumber(0,2));

    if(this.currentTeam == 1){
      this.roundCounter++;
    }
  }

  timerTick(){
    setTimeout(() => {
      this.time--;
      if(this.time == 10){
        var tenSecLeftAudio = new Audio("../../assets/audio/10secleft.wav");
        tenSecLeftAudio.play();
      }
      if(this.time == 0){
        var tenSecLeftAudio = new Audio("../../assets/audio/timesup.wav");
        tenSecLeftAudio.play();
      }
      if (this.time > 0) {
        this.timerTick();
      }
      else {
        if(this.currentTeam == this.settings.partynumber && this.roundCounter == this.settings.maxRounds){
          this.victoryAlert();
        }
        if(this.currentTeam == this.settings.partynumber){
          this.currentTeam = 1;
        }
        else {
          this.currentTeam++;
        }
      }
    }, 1000);
  }

  correct(){
    this.partys[this.currentTeam-1].points++;
    this.newCombination(this.randomNumber(0,2));
  }

  skipWord(random: number){
    if(this.skipCounter < this.settings.rerolls || this.settings.rerolls == -1){
      this.skipCounter++;
      switch(this.currentPresentationtype){
        case 'mime':
          if(this.words.mime.length > 0){
            this.newWord(this.words.mime);
          } else{
            this.newCombination(this.randomNumber(1,2));
          }
          break;
        case 'explain':
          if(this.words.explain.length > 0){
            this.newWord(this.words.explain);
          } else{
            this.newCombination(this.randomNumberException(0,2,1));
          }
          break;
        case 'draw':
          if(this.words.draw.length > 0){
            this.newWord(this.words.draw);
          } else{
            this.newCombination(this.randomNumber(0,1));
          }
          break;
        default:
          console.log('unexpected currentPresentationtype ' + this.currentPresentationtype);
          this.currentPresentationtype = 'unexpected currentPresentationtype ' + this.currentPresentationtype;
      }
    }
  }

  newCombination(random: number){
    if(this.words.mime.length == 0 && this.words.draw.length == 0 && this.words.explain.length == 0){
      this.currentWord = 'keine Wörter mehr da';
      this.currentPresentationtype = 'noWords';
      this.showWordsResetButton = true;
      return;
    }
    switch(random){
      case 0:
        if(this.words.mime.length > 0){
          this.currentPresentationtype = 'mime';
          this.newWord(this.words.mime);
        } else {
          this.newCombination(this.randomNumber(1,2));
        }
        break;
      case 1:
        if(this.words.explain.length > 0){
          this.currentPresentationtype = 'explain';
          this.newWord(this.words.explain);
        } else {
          this.newCombination(this.randomNumberException(0,2,1));
        }
        break;
      case 2:
        if(this.words.draw.length > 0){
          this.currentPresentationtype = 'draw';
          this.newWord(this.words.draw);
        } else {
          this.newCombination(this.randomNumber(0,1));
        }
        break;
      default:
        console.log('unexpected random Number: ' + random);
        this.currentPresentationtype = 'unexpected random Number: ' + random;
    }
  }

  newWord(wordArray: string[]){
    let random: number = this.randomNumber(0, wordArray.length-1);
    this.currentWord = wordArray[random];
    let index: number = wordArray.indexOf(this.currentWord, 0);
    if (index > -1) {
      wordArray.splice(index, 1);
    }
  }

  randomNumber(min: number, max: number): number {
    return Math.floor(Math.random()*(max-min+1)+min)
  }

  randomNumberException(min: number, max: number, exception: number): number {
    let random: number = this.randomNumber(min, max);
    if(random == exception){
      return this.randomNumberException(min, max, exception);
    }
    return random;
  }

  async victoryAlert(){
    let winnerTeams: party[] = [{teamNumber: 0, points: -1}];
    for(let party of this.partys){
      if(party.points >= winnerTeams[0].points){
        if(party.points > winnerTeams[0].points){
          winnerTeams = [];
        }
        winnerTeams.push(party);
      }
    }

    let message: string = 'Team ' + (winnerTeams[0].teamNumber+1) +
     ' hat mit ' + winnerTeams[0].points + ' Punkt/en in ' +
      this.settings.maxRounds + ' Runden gewonnen! Herzlichen Glückwunsch.';
    let title: string = 'Gewonnen!'
    if(winnerTeams.length > 1){
      title = 'Unentschieden!'
      let teamNumbers: string = '';
      for(let team of winnerTeams){
        teamNumbers += (team.teamNumber+1) + ' ';
      }
      message = ' Die Teams: ' + teamNumbers + ' haben alle ' +
       winnerTeams[0].points + ' Punkte in ' + this.settings.maxRounds + ' Runden erreicht!'
    }

    const alert = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: [
      {
        text: 'Weiter spielen',
        role: 'cancel',
        handler: () => {
          this.settings.maxRounds = -1;
        }
      },
      {
        text: 'Beenden',
        handler: () => {
          this.router.navigate(['home']);
        }
      }
    ]
    });

    await alert.present();
  }
}
