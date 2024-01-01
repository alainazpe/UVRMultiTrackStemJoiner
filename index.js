const fs = require('fs');
const path = require('path');

var instrumental = '_(Instrumental)';
var vocals = '_(Vocals)';
 // process.argv[2]
 
var dirPath = path.dirname(__filename);
var videoFile = path.dirname(__filename) + "\\sample.png";

var fileList;
var availableInstrumentalsStr = '';
var fullScript = 'chcp 65001\r\n';
var availableInstrumentals = [];

generateScript = function(parameters){

  dirPath = parameters.dirPath;
  actualSong = parameters.actualSong;
  instrumental = parameters.instrumental;
  vocals = parameters.vocals;
  fileExt = parameters.fileExt;
  videoFile = parameters.videoFile;

return `ffmpeg -hide_banner` +
` -i "${dirPath}${actualSong}${instrumental}${fileExt}"` + 
` -i "${dirPath}${actualSong}${vocals}${fileExt}"` + 
` -i "${videoFile}" -map "0:0" "-c:0" copy -map "1:0" "-c:1" copy -map "2:0" "-c:2" copy -map_metadata 0 -movflags "+faststart" -default_mode infer_no_subs -ignore_unknown -strict experimental -f mp4` + 
` -y "${dirPath}${actualSong}.mp4"\r\n`;
}


mainFunc = function(){

fileList;
availableInstrumentalsStr = '';
fullScript = 'chcp 65001\r\n';
availableInstrumentals = [];

try {
  fileList = fs.readdirSync(dirPath); 
} catch (err) {
  console.error(`Directory not found: ${dirPath}`);
  process.exit(1);
}

for (const fileName of fileList) {
  
  fileExt = path.extname(fileName);
  fileExtUpper = fileExt.toUpperCase();

  if (fileExtUpper == '.FLAC' || fileExtUpper == '.WAV' || fileExtUpper == '.MP3') {

  if (fileName.endsWith(instrumental + fileExt)){
    actualSong = fileName.substring(0, fileName.length - fileExt.length - instrumental.length);
	  availableInstrumentals.push(actualSong);
    availableInstrumentalsStr += actualSong + '\r\n';
    
    parameters = {
      dirPath: dirPath,
      actualSong: actualSong,
      instrumental: instrumental,
      vocals: vocals,
      fileExt: fileExt,
      videoFile: videoFile
    };
    fullScript += generateScript(parameters);
  }
  
  if (fileName.endsWith(vocals + fileExt)){
  //  actualSong = fileName.substring(0, fileName.length - fileExt.length - vocals.length);
	//  availableInstrumentals.push(actualSong);
  }

 
}

}

console.log(fullScript);

label2.setText(availableInstrumentalsStr);

label3.setText(fullScript);

label2.adjustSize()
label3.adjustSize()

fs.writeFile(process.env.USERPROFILE + '\\Desktop\\Script.bat', fullScript, err => {
  if (err) {
    console.error(err);
  }
  // file written successfully
  
  messageBox.exec();

});

}

const { QLabel, QMainWindow, QPushButton,FlexLayout, QWidget,QScrollArea,QFileDialog,QComboBox, QMessageBox, ButtonRole } = require("@nodegui/nodegui");

const win = new QMainWindow();
win.setMinimumSize(800, 450);

const rootView = new QWidget();
rootView.setObjectName("rootView");
win.setCentralWidget(rootView);
const rootStyleSheet = `
*{
  background-color:#1f1f1f;
  color:powderblue;
}

QScrollArea QLabel{
  background-color:#1B1B1B;
  color:white;
}

QPushButton {
  background: #FD8D0E;
  
}


QScrollArea{
  flex: 1;
   background-color:#1B1B1B;
}

  `;


rootView.setStyleSheet(rootStyleSheet);
const rootViewFlexLayout = new FlexLayout();
rootViewFlexLayout.setFlexNode(rootView.getFlexNode());
rootView.setLayout(rootViewFlexLayout);

const label = new QLabel();

localizableES = {
  txt1:"Carpeta con ficheros de audio MultiPista de Ultimate Vocal Remover:",
  txt2:"Examinar...",
  txt3:"¡Script creado! Ejecuta Script.bat, guardado en el escritorio."
}

localizableEN = {
  txt1:"Folder with UltimateVocalRemover MultiTrack Audio Files:",
  txt2:"Browse...",
  txt3:"Script created! Run Script.bat, saved in the desktop."
}


localizableEU = {
  txt1:"Ultimate Vocal Remover-ek sorturiko geruza ezberdingo audioen direktorioa:",
  txt2:"Aukeratu...",
  txt3:"Script-a sortu da! Exekutatu Script.bat-a, mahaigainean gordea."
}

localizable = localizableEN;


label.setText(localizable.txt1);
label.setInlineStyle("margin-left:20px;width:650px;  padding-top:15px;");

const fileDialog = new QFileDialog();
fileDialog.setFileMode(2);

fileDialog.setWindowTitle(localizable.txt1)

const button = new QPushButton();
button.setText(localizable.txt2 + "         ");
button.addEventListener('clicked', () => {
  fileDialog.exec();

  parts = fileDialog.selectedFiles().toString();
  dirPath = parts.replace(/\//g, "\\") + '\\';

  label1.setText(dirPath);
  mainFunc();
});
button.setInlineStyle("margin-left:20px;margin-right:20px;text-align:right;margin-bottom:20px;height:50px;background-color:gray;color:black;");


const label1 = new QLabel(button);
label1.setText(dirPath);


label1.setInlineStyle("margin-left:20px;padding-top:6px;min-width:610px;padding-bottom:7px;background-color:white;color:black;");


const scrollArea2 = new QScrollArea();
const label2 = new QLabel();
label2.setText(availableInstrumentalsStr);

const scrollArea3 = new QScrollArea();
const label3 = new QLabel();
label3.setText(fullScript);

rootViewFlexLayout.addWidget(label, label.getFlexNode());
rootViewFlexLayout.addWidget(button, button.getFlexNode());

refreshLoc = function(){
  label.setText(localizable.txt1);
  button.setText(localizable.txt2 + "         ");
  fileDialog.setWindowTitle(localizable.txt1);
}
const comboBox = new QComboBox();
comboBox.addItem(undefined, 'EN');
comboBox.addItem(undefined, 'ES');
comboBox.addItem(undefined, 'EU');
rootViewFlexLayout.addWidget(comboBox, comboBox.getFlexNode());
comboBox.setInlineStyle("width:50px");


comboBox.addEventListener('currentTextChanged', (text) => {
  if (text == "ES") {
    localizable = localizableES;
    refreshLoc();
  }
  if (text == "EN") {
    localizable = localizableEN;
    refreshLoc();
  }
  if (text == "EU") {
    localizable = localizableEU;
    refreshLoc();
  }
});

scrollArea2.setWidget(label2, label2.getFlexNode());
scrollArea3.setWidget(label3, label3.getFlexNode());
rootViewFlexLayout.addWidget(scrollArea2, scrollArea2.getFlexNode());
rootViewFlexLayout.addWidget(scrollArea3, scrollArea3.getFlexNode());

scrollArea2.alignment(32)
scrollArea3.alignment(32)
label2.adjustSize()
label3.adjustSize()

const messageBox = new QMessageBox();
messageBox.setText(localizable.txt3);
  
messageBox.setWindowTitle(' ');
const accept = new QPushButton();
accept.setText('OK');
messageBox.addButton(accept, ButtonRole.AcceptRole);
win.setWindowTitle('UVR MultiTrack Stem Joiner');
win.show();
global.win = win;
