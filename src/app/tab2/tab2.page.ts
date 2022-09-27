import { Component, OnInit } from '@angular/core';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { RecordingData, VoiceRecorder } from 'capacitor-voice-recorder';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit{

  recording = false;
  storedFileNames = [];
  audioName = "";

  constructor(private alertController: AlertController) {}

  ngOnInit(){
    this.loadFiles();
    VoiceRecorder.requestAudioRecordingPermission();
  }

  //loads files
  async loadFiles(){
    Filesystem.readdir({
      path: '',
      directory: Directory.Data
    }).then(result =>{
      this.storedFileNames = result.files;
    });
  }

  //starts recording
  startRecording(){
    if (this.recording){
      return;
    }
    this.recording = true;
    this.presentAlert("name", "");
  }


  //creates different alert popups
  async presentAlert(alertType, fileName) {
    const alert = await this.alertController.create({
      header: 'Name your recording',
      inputs: [
        {
          name: 'input',
          placeholder: '(max 50 characters)',
          attributes: {
            maxlength: 50,
          },
        }
      ],
      buttons: [
        {
            text: 'Cancel',
            role: 'cancel',
            cssClass: 'secondary',
            handler: () => {
                this.recording = false;
            }
        }, 
        {
            text: 'Ok',
            handler: (alertData) => {
                this.audioName = alertData.input;
                VoiceRecorder.startRecording();
            }
        }
    ]
    });
    const alert2 = await this.alertController.create({
      header: 'Alert!',
      message: 'Are you sure you want to delete this audio?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
          },
        },
        {
          text: 'OK',
          role: 'confirm',
          handler: () => {
            this.removeFile(fileName);
          },
        },
      ],
    });
    if(alertType === "name"){
      await alert.present();
    } else if (alertType === "remove"){
      await alert2.present();
    }
  }


  getName(){
    return this.audioName;
  }

  //stops the recording
  stopRecording(){
    if (!this.recording){
      return;
    }
    VoiceRecorder.stopRecording().then(async (result: RecordingData) => {
      if(result.value && result.value.recordDataBase64){
        const recordData = result.value.recordDataBase64;
        await Filesystem.writeFile({
          path: this.getName(),
          directory: Directory.Data,
          data: recordData
        });
        this.loadFiles();
        this.recording = false;
      }
    })
  }

  //plays files
  async playFile(fileName){
    const audioFile = await Filesystem.readFile({
      path: fileName,
      directory: Directory.Data
    });
    const base64Sound = audioFile.data;
    const audioRef = new Audio("data:audio/wav;base64," + base64Sound);
    audioRef.oncanplaythrough = () => audioRef.play();
    audioRef.load();
  }

  //removes files
  async removeFile(fileName){
      await Filesystem.deleteFile({
        path: fileName,
        directory: Directory.Data
      });
    this.loadFiles();
  }

  publishAudio(){
    return;
  }

}
