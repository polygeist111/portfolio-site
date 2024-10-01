/**************
 * NOTES:
 * Only use canvasX, canvasY, canvasCenterX for DOM elements, not canvas local elements
 * 
**************/

var panelW = 3;
var panelH = 2;

//const socket = io('http://localhost:8086');
var canvas;
var aspectWidth = 300;
var aspectHeight = (aspectWidth / 3) * 2;
var cwidth = 738;
var cheight = 662;

//var regFont;

var imgHolder;
var imgSelected = false;
var selectedImg;

//Canvas info
var thisCanvas;
var canvasRect;
var canvasX;
var canvasY;

var canvasCenterX;

//State bools (all need reset)
  //State of start menu
var startScreen = false;
  //State of start screen after naming file
var startScreenNamed = false;
  //State of MaxMSP selection screen
var maxScreen = false;
  //State of MaxMSP connection
var maxConnected = false;
  //State to confirm guide
var confirmingGuide = false;
  //State to confirm instructions
var confirmingInstructions = false;
  //State to confirm whiteouts
var confirmingWhiteouts = false;

//inputs and buttons
  //name input
let inp0;
  //
let inp1;
  //
let inp2;
  //model name submit button
let button0;
  //input from max
let button1;
  //file uplaod
let button2;
  //MaxMSP page back button
let button3;
  //Take photo button
let button12;
  //MaxMSP page photo confirm button
let button4;
var button3n12n4;
  //confirm guide, rogress to instructions previews
let button5;
var button3n5;
  //confirm instructions previews, progress to whiteout previews
let button6;
  //scroll left (viewing instructions)
let button7;
  //scroll right (viewing instructions)
let button8;
var button6n7n8;
  //confirm whiteouts, download all graphics
let button9;
  //scroll left (viewing whiteouts)
let button10;
  //scroll right (viewing whiteouts)
let button11;
var button9n10n11;

//preview page indices
let pageNum = 0;
let whiteoutNum = 0;

//Acceptable indices
//let colorIndexes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60];
let colorIndexes = [];
let reducedColorIndexes = [];

var table;
var sortedColors = [37,57,51,33,34,30,28,13,32,11,22,52,36,4,16,38,5,31,29,39,23,10,2,18,12,20,17,25,3,8,21,35,26,9,1,19,27,24,14,6,15,7,40,41,42,43,44,45,46,47,48,49,50,53,54,55,56,58,59,60];
var rgb = ["(3,10,25)", "(49,80,195)", "(93,161,70)", "(149,198,234)", "(243,192,64)", "(252,252,62)", "(229,177,207)", "(236,117,119)", "(77,152,222)", "(25,45,87)", "(105,108,101)", "(60,36,3)", "(34,65,45)", "(159,82,22)", "(194,110,162)", "(102,4,12)", "(147,138,113)", "(61,130,142)", "(59,120,57)", "(234,221,249)", "(201,229,225)", "(163,167,171)", "(249,223,184)", "(199,244,29)", "(136,53,118)", "(106,199,229)", "(109,158,216)", "(168,118,190)", "(196,110,45)", "(248,255,44)", "(204,146,103)", "(155,156,87)", "(238,139,38)", "(189,26,26)", "(77,37,13)", "(91,110,130)", "(233,212,161)", "(255,255,255)", "(246,212,59)", "(234,250,169)", "", "", "", "", "", "", "", "", "", "", "", "(127,124,124)", "(190,147,43)", "", "", "", "", "(243,243,243)", "", "", ""];
var rgb3 = ["(14,27,37)", "(10,93,197)", "(83,166,82)", "(141,199,231)", "(254,193,69)", "(255,246,66)", "(234,180,206)", "(255,125,125)", "(28,159,221)", "(21,58,98)", "(115,117,111)", "(77,49,9)", "(32,78,58)", "(175,92,10)", "(206,119,167)", "(121,22,23)", "(156,145,122)", "(9,138,150)", "(45,129,70)", "(231,219,242)", "(195,226,222)", "(166,171,175)", "(251,221,185)", "(193,238,19)", "(152,65,127)", "(69,200,227)", "(99,163,215)", "(178,127,192)", "(210,119,50)", "(243,255,42)", "(213,151,111)", "(161,160,97)", "(255,144,32)", "(207,34,17)", "(95,50,26)", "(96,120,138)", "(233,211,164)", "(255,255,255)", "(247,210,62)", "(228,243,171)", "", "", "", "", "", "", "", "", "", "", "", "(136,133,134)", "(194,150,47)", "", "", "", "", "(244,244,244)", "", "", ""];
var HSL = [];

//Graphics holders
var guide;
var pin1;
var pin2;
var modelIcon;
var gridded = [];
var whiteouts = [];
var allPages = [];

var modelName = "";

function preload() {
  table = loadTable("LEGO 1x1 Tile Colors - Sheet1.csv", "csv", "header");
}

function setup() {
  canvas = createCanvas(cwidth, cheight, SVG);
  //createCanvas(100, 100, SVG);
  background('#222a30');
  
  //console.log(io);
  //console.log(socket);

  HSL = table.getColumn("HSL");

  //Server message recievers

  //socket.on('mousePos', newDrawing); //Event handler for mousePos message from server
  //socket.on('bang', receiveBang); //Event handler for bang message from server
  //socket.on('image', receivedServerImage);
  //socket.on('sendMaxStatus', receiveMaxStatus);
  //socket.on('receiveColorFrequency', reduceColorsPart2);

  locateElements();
  startScreen = true;

  //Inputs
    //Model name
  inp0 = createInput().attribute('placeholder', "Model Name");
  
  //Buttons
    //Startup page (Default)
  button0 = createButton('Submit');
  button0.mousePressed(submitName);

    //Startup page (Named)
  button1 = createButton('Camera Capture');
  button1.position(canvasCenterX - button1.width / 2, canvasY + 0.4 * canvas.height);
  button1.mousePressed(selectCamera);

  //button2 = createButton('File Upload');
  button2 = createFileInput(handleFile).attribute('id','userImg').attribute('accept',".png, .jpg, .jpeg");
  button2.position(canvasCenterX - button2.width / 2, canvasY + 0.5 * canvas.height);
  button2.mousePressed(buttonTest);

  //MaxMSP page
  button12 = createButton('Take Photo');
  button12.position(canvasCenterX - button12.width / 2, canvasY + 0.5 * canvas.height); 
  button12.mousePressed(receivedLocalImage);
  button12.id('PhotoButton');

  button3 = createButton('Exit');
  button3.position(canvasCenterX - button3.width * 2, canvasY + 0.5 * canvas.height);
  button3.mousePressed(backToHome);

  button4 = createButton('Confirm');
  button4.position(canvasCenterX + button3.width, canvasY + 0.75 * canvas.height);
  button4.mousePressed(renderGuide);

    //Guide preview page
  button5 = createButton('Confirm Guide');
  button5.position(canvasCenterX - button5.width / 2, canvasY + 0.9 * canvas.height);
  button5.mousePressed(iterateGrid);

    //Instructions preview page
  button6 = createButton("Confirm instructions");
  button6.position(width / 2 - button6.width / 2, canvasY + 0.9 * canvas.height);
  button6.mousePressed(showWhiteout);

  button7 = createButton("Backward");
  button7.position(width / 2 - button3.width - button7.width, canvasY + 0.9 * canvas.height);
  button7.mousePressed(backPage1);
  
  button8 = createButton("Forward");
  button8.position(width / 2 + button3.width, canvasY + 0.9 * canvas.height);
  button8.mousePressed(forwardPage1);
  
    //Whiteouts preview page
  button9 = createButton("Confirm whiteouts and download all");
  button9.position(width / 2 - button9.width / 2, canvasY + 0.9 * canvas.height);
  button9.mousePressed(pages);

  button10 = createButton("Backward");
  button10.position(width / 2 - button3.width - button10.width, canvasY + 0.9 * canvas.height);
  button10.mousePressed(backPage2);
  
  button11 = createButton("Forward");
  button11.position(width / 2 + button3.width, canvasY + 0.9 * canvas.height);
  button11.mousePressed(forwardPage2);

  /*
  button12 = createButton("Confirm whiteouts and download all");
  button12.position(width / 2 - button12.width / 2, height - height / 9);
  button12.mousePressed(pages);
  */
    
  inp0nButton0 = inp0.width + button0.width + 10;
  button3n12n4 = button3.width + button12.width + button4.width + 10;
  button3n5 = button3.width + button5.width + 10;
  button6n7n8 = button6.width + button7.width + button8.width + 20;
  button9n10n11 = button9.width + button10.width + button11.width + 20;


  //Initial html element states
  inp0.show()
  button0.show();
  button1.hide();
  button2.hide();
  button3.hide();
  button4.hide();
  button5.hide();
  button6.hide();
  button7.hide();
  button8.hide();
  button9.hide();
  button10.hide();
  button11.hide();
  button12.hide();

  inp0.position(canvasCenterX - inp0nButton0 * 0.5, canvasY + 0.4 * canvas.height);
  button0.position(inp0.x + inp0.width + 10, canvasY + 0.4 * canvas.height);

  //create pin graphics
  pin1 = createGraphics(30, 20, SVG)
  createPin1();
  pin2 = createGraphics(20, 30, SVG);
  createPin2();
}

function buttonTest() {
  console.log("button clicked");
}

function locateElements() {
  thisCanvas = document.getElementById('defaultCanvas0');
  canvasRect = thisCanvas.getBoundingClientRect();
  canvasX = canvasRect.left + window.scrollX;
  canvasY = canvasRect.top + window.scrollY;

  canvasCenterX = canvasX + canvas.width / 2;
}

function draw() {
  clear();
  background('#222a30');
  textFont('Roboto');
  
  /*
  //Test draw image reception
  if (imgHolder != null) {
    console.log("drawing image");
    //drawPic();
    imgHolder = resizeToPrint(imgHolder);
    image(imgHolder, 0, 0);
  }*/
  //True default landing page
  if (startScreen) {    
    noStroke();
    fill('#dddbff');
    textAlign(CENTER);
    textSize(24);
    text("Welcome to the Mosaic Generator using LEGO® Bricks!", canvas.width * 0.5, canvas.height * 0.25);

    textSize(20);
    text("Please name your model", canvas.width * 0.5, canvas.height * 0.3);

    push();
      textSize(16);
      //textAlign(CENTER);
      text("Turn your 3:2 aspect photos into mosaics\n in the style of LEGO® Art Sets! \n\nSimply upload your photo, and the program will generate all the graphics you need to finish polished instructions in the Studio Instruction Maker", canvas.width * 0.23, canvas.height * 0.5, 400);
    pop();

    text("Made by Thalia Wood", canvas.width * 0.5, canvas.height * 0.8);
  }

  //Default landing page after naming
  if (startScreenNamed) {
    noStroke();
    textAlign(CENTER);
    textSize(24);
    text("Welcome to the Mosaic Generator using LEGO® Bricks!", canvas.width * 0.5, canvas.height * 0.25);

    textSize(20);
    text("Please select your input type", canvas.width * 0.5, canvas.height * 0.3);
    text("Local file support is live but WIP", canvas.width * 0.5, canvas.height * 0.6);

    text("Made by Thalia Wood", canvas.width * 0.5, canvas.height * 0.8);
  }

  noStroke();
  textAlign(CENTER);
  textSize(24);

  //Select photo from MaxMSP
  if (maxScreen) {
    if (/*maxConnected || */(imgHolder != null)) {
      //console.log("max connected");
      //Currently only supports 3x2 images
      imageMode(CENTER);

      //Renders provided image
      if (imgHolder != null) {
        imgHolder = resizeToPrint(imgHolder);
        if (!imgSelected) {
          image(imgHolder, canvas.width / 2, canvas.height / 2);
        } else {
          image(selectedImg, canvas.width / 2, canvas.height / 2);
        }
      
        renderPanelPreview();
        /*
        if (maxConnected) {
          text("Would you like to use this photo?\nIf not, simply take another to update it", canvas.width * 0.5, canvas.height * 0.25);
        } else {
          text("Would you like to use this photo?\nIf not, reconnect Max then take another to update it", canvas.width * 0.5, canvas.height * 0.25);
        }*/

      } else {
        noStroke();
        text("Take a photo", canvas.width * 0.5, canvas.height * 0.45);
      }
      

    } else {
      //text("Please connect visual input", canvas.width * 0.5, canvas.height * 0.45);
      if (selectedImg) {
        selectedImg.resize(300, 200);
        imageMode(CENTER);
        image(selectedImg, canvas.width / 2, canvas.height / 2);
        renderPanelPreview();
      } else {
        text("Please exit and try again", canvas.width * 0.5, canvas.height * 0.45);
      }
    }
  }
  
  //Confirm rendered guide
  if (confirmingGuide) {
    imageMode(CENTER);
    image(guide, canvas.width * 0.5, canvas.height * 0.45, 0.666 * guide.width, 0.666 * guide.height);
  }

  if (confirmingInstructions) {
    image(gridded[pageNum], canvas.width * 0.5, canvas.height * 0.45);
  }

  if (confirmingWhiteouts) {
    image(whiteouts[whiteoutNum], canvas.width * 0.5, canvas.height * 0.45);
  }


}

function renderPanelPreview() {
  stroke('#dddbff');
  strokeWeight(1);
  //Renders panel gridlines
  for (let row = 0; row <= 2; row++) {
    //line(currentImg.x - 5, currentImg.y + (currentImg.height / 2) * row, currentImg.x + currentImg.width, currentImg.y + (currentImg.height / 2) * row);      
    line(canvas.width * 0.5 - aspectWidth * 0.5 - 5, canvas.height * 0.5 + (aspectHeight * 0.5) * (row - 1), canvas.width * 0.5 + aspectWidth * 0.5, canvas.height * 0.5 + (aspectHeight * 0.5) * (row - 1));          
  }
  for (let col = 0; col <= 3; col++) {
    line(canvas.width * 0.5 - aspectWidth * 0.5 + (aspectWidth / 3) * col, canvas.height * 0.5 - aspectHeight * 0.5 - 5, canvas.width * 0.5 - aspectWidth * 0.5 + (aspectWidth / 3) * col, canvas.height * 0.5 + aspectHeight * 0.5);
  }

  noStroke();
  text("Would you like to use this photo?\nIf not, simply take another to update it", canvas.width * 0.5, canvas.height * 0.25);
}

/**************
 * 
 * NETWORK FUNCTIONS
 * 
**************/

/* //Demonstrates cross-sketch networking
function mouseDragged() {
  console.log("sending: " + mouseX + ", " + mouseY);

  var data = {
    x: mouseX,
    y: mouseY
  }
  socket.emit('mousePos', data); //Sents mousePos message to server

  noStroke();
  fill(255);
  ellipse(mouseX, mouseY, 36, 36);
}*/

/*
function newDrawing(data) {
  noStroke();
  fill(255, 0, 100);
  ellipse(data.x, data.y, 36, 36);
  console.log('drawing other circle at: ' + data.x + ", " + data.y);
}*/

function receiveBang() {
  console.log("received bang from server");
  //img = null;
  //loadImage('thisPic.png', imageLoaded, imageLoadFailed);
  //image(img, 10, 10);
}

/*
function imageLoaded(loadedImage) {
  console.log("loaded new image");
  img = loadedImage;
  image(loadedImage, 25, 15);
  //image(img, 15, 15);
}

function imageLoadFailed(event) {
  console.warn("image load failed", event);
}*/

//not used
function receivedServerImage(info) {
  if (info.image && maxScreen) {
    //var img = new Image();
    //img.src = 'data:image/jpeg;base64,' + info.buffer;
    imgHolder = loadImage('data:image/jpeg;base64,' + info.buffer);
    imgHolder = resizeToPrint(imgHolder);
    console.log("received img: " + imgHolder);
    if (maxConnected && maxScreen) { 
      button4.show();
      button3.position(canvasCenterX - button3n12n4 / 2, canvasY + 0.75 * canvas.height);
      button4.position(button3.x + button3.width + 10, canvasY + 0.75 * canvas.height);
    }
    //image(img, 10, 10);
    //document.body.appendChild(img);
    //canvas.drawImage(img, 0, 0);
    //ctx.drawImage(img, 0, 0);
  }
}

//take video capture
function receivedLocalImage() {
  if (imgHolder.loadedmetadata) { // I've added this check. Only shoot pics if the camera is ready.
    var thisBut = document.getElementById('PhotoButton');
    //console.log(thisBut);
    if (!imgSelected) {
      selectedImg = resizeToPrint(imgHolder.get(0, 0, 600, 400));
      imgSelected = true;
      thisBut.innerHTML = "Retake Photo";
       //innerHTML("Retake Photo");
    } else {
      selectedImg = null;
      imgSelected = false;
      thisBut.innerHTML = "Take Photo";
    }
    let width12 = thisBut.getBoundingClientRect().width;
    console.log(width12);
    button3n12n4 = button3.width + width12 + button4.width + 10;
    button3.position(canvasCenterX - button3n12n4 / 2, canvasY + 0.75 * canvas.height);
    button12.position(button3.x + button3.width + 10, canvasY + 0.75 * canvas.height);
    button4.position(button12.x + width12 + 10, canvasY + 0.75 * canvas.height);
  }
}

//not used
function receiveMaxStatus(maxStatus) {
  console.log("max connection status: " + maxStatus);
  maxConnected = maxStatus;
  if (!maxConnected && maxScreen && imgHolder == null) {
    button4.hide();
    button3.position(canvasCenterX - button3.width / 2, canvasY + 0.5 * canvas.height);
  }
}

function reduceColorsPart2(colorFreqs) {
  console.log("received color frequencies");
  console.log(colorFreqs);
  console.log(colorFreqs.length);
  while(colorFreqs.length > 16) { colorFreqs.pop() };
  console.log(colorFreqs.length);
  var topColors = [];
  for (let i = 0; i < colorFreqs.length; i++) {
    append(topColors, colorFreqs[i][0]);
  }
  console.log("top colors: " + topColors);
  sortGradient(topColors);
  
}

/**************
 * 
 * INPUT FUNCTIONS
 * 
**************/

//helps process user image input
//borrowed from https://stackoverflow.com/questions/65858566/need-to-upload-users-image-input-p5-javascript-library
function handleFile(file) {
  if (file.type === 'image') {
    let userImage;
    userImage = createImg(file.data, '');
    userImage.hide();

    const selectedFile = document.getElementById('userImg');
    const myImageFile = selectedFile.files[0];
    let urlOfImageFile = URL.createObjectURL(myImageFile);
    let imgLoaded = false;
    selectedImg = loadImage(urlOfImageFile, a => {
      imgLoaded = true;
    });

    selectedImg.loadPixels();

    startScreenNamed = false;
    maxScreen = true;

    button1.hide();
    button2.hide();
    button3.show();
    button4.show();
    //button12.show();
    
    button3.position(canvasCenterX - button3n12n4 / 2, canvasY + 0.75 * canvas.height);
    button12.position(button3.x + button3.width + 10, canvasY + 0.75 * canvas.height);
    button4.position(button12.x + button12.width + 10, canvasY + 0.75 * canvas.height);
      
  } else {
    userImage = null;
  }
}

//Returns to landing menu
function backToHome() {
  console.log("back to home");
  window.location.reload();

  /*
  startScreen = true;
  startScreenNamed = false;
  maxScreen = false;
  confirmingGuide = false;
  confirmingInstructions = false;
  confirmingWhiteouts = false;

  inp0.show()
  button0.show();
  button1.hide();
  button2.hide();
  button3.hide();
  button3.position(canvasCenterX - button3.width / 2, canvasY + 0.5 * canvas.height);
  button4.hide();
  button5.hide();
  button6.hide();
  button7.hide();
  button8.hide();
  button9.hide();
  button10.hide();
  button11.hide();
  button12.hide();

  imgHolder = null;
  selectedImg = null;

  pageNum = 0;
  whiteoutNum = 0;

  reducedColorIndexes = [];
  gridded = [];
  whiteouts = [];
  allPages = [];

  modelName = "";

  guide = null;
  modelIcon = null;
  */
}

//Locks in model name
function submitName() {
  if (inp0.value() == "") {
    console.log("no name submitted");
    return;
  }
  modelName = inp0.value();
  inp0.value('');

  inp0.hide();
  button0.hide();

  startScreen = false;
  startScreenNamed = true;

  button1.show();
  button2.show();

}

//Enters photo input screen
function selectCamera() {
  console.log("selected camera");
  //socket.emit('requestMaxStatus');
  imgHolder = createCapture(VIDEO);
  imgHolder.size(600, 400);
  imgHolder.hide();

  startScreenNamed = false;
  maxScreen = true;

  button1.hide();
  button2.hide();
  button3.show();
  button4.show();
  button12.show();
  
  button3.position(canvasCenterX - button3n12n4 / 2, canvasY + 0.75 * canvas.height);
  button12.position(button3.x + button3.width + 10, canvasY + 0.75 * canvas.height);
  button4.position(button12.x + button12.width + 10, canvasY + 0.75 * canvas.height);
}

function renderGuide() {
  if (selectedImg == null) {
    console.log("no img selected");
    return;
  }
  //background(150);
  console.log("rendering guide");

  maxScreen = false;

  //selectedImg = imgHolder;
  imgHolder = null;

  button3.hide();
  button3.position(canvasCenterX - button3.width / 2, canvasY + 0.5 * canvas.height);
  button4.hide();
  button12.hide();

  reduceColorsPart1();
}

//grids out image by stated dimensions (currently only 3x2), uses nested for loop to call one function for graying (using raw image) and one function for instruction generating (generated image)
//advances previews to instruction panels
function iterateGrid() {
  confirmingGuide = false;
  confirmingInstructions = true;

  button5.hide();
  button3.position(canvasCenterX - button3.width / 2, canvasY + 0.95 * canvas.height);

  button6.show();
  button7.show();
  button8.show();

  button7.position(canvasCenterX - button6n7n8 * 0.5, canvasY + 0.9 * canvas.height);
  button6.position(button7.x + button7.width + 10, canvasY + 0.9 * canvas.height);
  button8.position(button6.x + button6.width + 10, canvasY + 0.9 * canvas.height);
  
  modelIconRender();

  //traverses top to bottom
  for (let col = 0; col < panelW; col++) {
    //traverses top to bottom
    for (let row = 0; row < panelH; row++) {
      whiteout(row, col, false, false, false);
      instructions(row, col);
    }
    //send col to whiteout function, which generates widening unwhited space left to right (assembly of row)
    //whiteout function then whites out only areas not yet covered
    whiteout(0, col, false, true, false);
  }
  
}

//advances previews to whiteouts
function showWhiteout() {
  confirmingInstructions = false;
  confirmingWhiteouts = true;

  button6.hide();
  button7.hide();
  button8.hide();

  button3.position(canvasCenterX - button3.width / 2, canvasY + 0.95 * canvas.height);

  button9.show();
  button10.show();
  button11.show();

  button10.position(canvasCenterX - button9n10n11 * 0.5, canvasY + 0.9 * canvas.height);
  button9.position(button10.x + button10.width + 10, canvasY + 0.9 * canvas.height);
  button11.position(button9.x + button9.width + 10, canvasY + 0.9 * canvas.height);
}

//assembles individual panel instructions with color guide
function pages() {
  button9.hide();
  button10.hide();
  button11.hide();

  for (let i = 0; i < gridded.length; i++) {
    let page = createGraphics(738, 662, SVG);

    page.background(0,0,0,0);
    //page.background(50);
    page.imageMode(CORNER);

    page.image(guide, 45, 88, 0.666 * guide.width, 0.666 * guide.height);
    page.image(gridded[i], 63 + 0.666 * guide.width, 88);

    append(allPages, page);
  }

  //Edit this later
  console.log("whiteouts length: " + whiteouts.length);
  download();

}

//advances instructions preview a page
function forwardPage1() {
  if (pageNum != gridded.length - 1) {
    pageNum++;
  } else {
    pageNum = 0;
  }
}

//sends instructions preview back a page
function backPage1() {
  if (pageNum != 0) {
    pageNum--;
  } else {
    pageNum = gridded.length - 1;
  }
}

//advances whiteout preview a page
function forwardPage2() {
  if (whiteoutNum != whiteouts.length - 1) {
    whiteoutNum++;
  } else {
    whiteoutNum = 0;
  }
}

//sends whiteout preview back a page
function backPage2() {
  if (whiteoutNum != 0) {
    whiteoutNum--;
  } else {
    whiteoutNum = whiteouts.length - 1;
  }
}

/**************
 * 
 * GENERAL FUNCTIONS
 * 
**************/

//Resizes image to print window dimensions
function resizeToPrint(imgIn) {
  imgIn.width = aspectWidth;
  imgIn.height = aspectHeight;
  return imgIn;
}

//Identifies 16 most common colors, uses them to produce guide
function reduceColorsPart1() {
  let foundColors = [];
  //Hardcoded for 3x2
  selectedImg.resize(aspectWidth, aspectHeight);
  var pixelSpace = selectedImg.width / (panelW * 16);
  console.log(selectedImg.width + " " + selectedImg.height + " " + pixelSpace);
  for (let row = 0; row < panelH * 16; row++) {
    for (let col = 0; col < panelW * 16; col++) {
      let rawColor = selectedImg.get(pixelSpace * 0.5 + pixelSpace * col, pixelSpace * 0.5 + pixelSpace * row);
      let thisColor = whatColor(rawColor, sortedColors)
      append(foundColors, thisColor);
      
      /*
      rectMode(CORNER);
      noStroke();
      
      
      let colorFormatted = rgb[thisColor].substring(1, rgb[thisColor].length - 1);
      let r = colorFormatted.substring(0, colorFormatted.indexOf(","));
      colorFormatted = colorFormatted.substring(colorFormatted.indexOf(",") + 1);
      let g = colorFormatted.substring(0, colorFormatted.indexOf(","));
      colorFormatted = colorFormatted.substring(colorFormatted.indexOf(",") + 1);
      let b = colorFormatted;
      //colorFormatted = colorFormatted.substring(colorFormatted.indexOf(",") + 1);
      console.log(r + " " + g + " " + b);
      console.log(thisColor + " " + rgb[thisColor] + " " + rawColor + " " + colorFormatted);
      fill(r, g, b);
      rect(canvas.width * 0.5 - aspectWidth * 0.5 + pixelSpace * col, canvas.height * 0.5 - aspectHeight * 0.5 + pixelSpace * row, pixelSpace, pixelSpace);
      
      //console.log(rawColor);
      */
    }
  }
  console.log(foundColors);
  countFrequencies(foundColors);
  //socket.emit("countColorFrequencies", foundColors);
}

//counts frequency of each color in array
function countFrequencies(foundColors) {
  let countedFreqs = [];
  for (let color of foundColors) {
    if (countedFreqs[color]) {
      countedFreqs[color][1]++;
    } else {
      countedFreqs[color] = [color, 1];
    }
  }
  let shortenedFreqs = [];
  for (let color of countedFreqs) {
    if (color != null) {
      shortenedFreqs.push(color);
    }
  }
  shortenedFreqs = shortenedFreqs.sort(sortFunction);
  console.log(shortenedFreqs);
  reduceColorsPart2(shortenedFreqs);
}

function sortFunction(a, b) {
    if (a[1] === b[1]) {
        return 0;
    }
    else {
        return (a[1] > b[1]) ? -1 : 1;
    }
}


//Compares color from tile in image to list of sorted colors to identify it, in liue of reading IO file
function whatColor(color, colorArray) {
  //let adjust = -10;
  let distances = [];
  let redDist;
  let greenDist;
  let blueDist;
  let avgDist;
  
  for (let i = 0; i < colorArray.length; i++) {
    let rgbSplit = rgb[colorArray[i]].replace("(", "").replace(")", "").split(",");
    //let HSLSplit = HSL[colorArray[i]].replace("(", "").replace(")", "").split(",");
    //let rgb2Split = rgb2[colorArray[i]].replace("(", "").replace(")", "").split(",");
    let rgb3Split = rgb3[colorArray[i]].replace("(", "").replace(")", "").split(",");
  
    redDist = 0;
    greenDist = 0;
    blueDist = 0;
    avgDist = 0;
      
    redDist = abs(color[0] - rgb3Split[0]);
    if (color[0] == 81 || color[0] == 82 || color[0] == 83) {
      redDist = abs(28 - rgbSplit[0])
    }
    greenDist = abs(color[1] - rgb3Split[1]);
    blueDist = abs(color[2] - rgb3Split[2]);
    avgDist = parseInt(abs((redDist + greenDist + blueDist) / 3));
      
    append(distances, avgDist);
  }
  let close = distances[0];
  let lowInd = 0;
  for (let ind = 0; ind < distances.length; ind++) {
    if (distances[ind] < close) {
      close = distances[ind]
      lowInd = ind;
    }
  }
  return(colorArray[lowInd]);
}

//Sorts topColor array based on order of sortedColors array
function sortGradient(topColors) {
  console.log(topColors);
  for (var i = 0; i < sortedColors.length; i++) {
    if (topColors.includes(sortedColors[i])) {
      append(reducedColorIndexes, sortedColors[i]);
    }
  }
  console.log(reducedColorIndexes);
  createGuide();
}

//saves guide, all instruction images, and all whiteouts
async function download() {
  var dlCount = 0;
  //check bug report for download issues
  console.log("whiteouts length: " + whiteouts.length);
  //saves color guide
  save(guide, modelName + "_guide.svg");
  dlCount++;

  //saves instruction pages
  for (let page = 0; page < allPages.length; page++) {
    save(allPages[page], modelName + "_instructions_" + page + ".svg");
    dlCount++;
    if (dlCount % 10 == 0) {
      await pause(1000);
    }
  }

  console.log("whiteouts length: " + whiteouts.length);
  //saves whiteout pages

  for (let white = 0; white < whiteouts.length; white++) {
    console.log("whiteoutNum: " + white);
    save(whiteouts[white], modelName + "_whiteout_" + white + ".svg");
    dlCount++;
    if (dlCount % 10 == 0) {
      await pause(1000);
    }
  }
  
  backToHome();
}


//Waits 1 second between every 10th dowload to get around chrome restrictions
function pause(msec) {
  return new Promise(
      (resolve, reject) => {
          setTimeout(resolve, msec || 1000);
      }
  );
}

/**************
 * 
 * GRAPHICS FUNCTIONS
 * 
**************/

//assigns all relevant primitives to horizontal pin object
function createPin1() {
  pin1.stroke(255);
  pin1.fill(32,32,32);
  pin1.strokeWeight(1);
  pin1.rectMode(CORNER);

  pin1.rect(0,1,30,8);
  pin1.rect(0,11,30,8);

  pin1.noStroke();
  pin1.rect(0,7,14,6);

  pin1.stroke(255);
  pin1.rect(0,0,4,20);
  pin1.rect(27,0,4,9);
  pin1.rect(27,11,4,9);
}

//assigns all relevant primitives to vertical pin object
function createPin2() {
  pin2.stroke(255);
  pin2.fill(32,32,32);
  pin2.strokeWeight(1);
  pin2.rectMode(CORNER);

  pin2.rect(1,0,8,30);
  pin2.rect(11,0,8,30);

  pin2.noStroke();
  pin2.rect(7,17,6,14);

  pin2.stroke(255);
  pin2.rect(0,0,9,4);
  pin2.rect(11,0,9,4);
  pin2.rect(0,27,20,4);
}

//creates color guide layout and assigns to "guide" graphic object
function createGuide() {
  console.log("creating guide");
  //creates graphic objects
  guide = createGraphics(140, 27 + 48 * (reducedColorIndexes.length - 1) + 29, SVG);

  guide.rectMode(CENTER);
  guide.noFill();
  guide.strokeWeight(3);
  guide.translate(1,1);

    //frame
  guide.stroke(255);
  guide.line(0, 0, 138, 0);
  guide.line(138, 0, 138, guide.height);
  guide.line(138, guide.height - 2, 0, guide.height - 2);

  guide.line(0, guide.height, 0, 0);
  
  //rows of colors
  guide.strokeWeight(2);
  for (let i = 0; i < reducedColorIndexes.length; i++) {
    //arrows
    guide.fill(255);
    guide.stroke(255);
    guide.line(guide.width / 2 - 21, 27 + 48 * i, guide.width / 2 + 7, 27 + 48 * i);
    guide.triangle(guide.width / 2 - 5, 24 + 48 * i, guide.width / 2 - 5, 27 + 48 * i, guide.width / 2 + 3, 26 + 48 * i);
    guide.triangle(guide.width / 2 - 5, 30 + 48 * i, guide.width / 2 - 5, 27 + 48 * i, guide.width / 2 + 3, 28 + 48 * i);
    //numbered circle at right
    if (rgb[reducedColorIndexes[i]] == "(3,10,25)") {
      guide.stroke(255);
    } else {
      guide.stroke(0);
    }
    let rgbSplit = rgb[reducedColorIndexes[i]].replace("(", "").replace(")", "").split(",");
    guide.fill(rgbSplit[0], rgbSplit[1], rgbSplit[2]);
    guide.circle(guide.width / 2 + 37,27 + 48 * i, 36);
      //numbering in circles
      guide.textAlign(CENTER, CENTER);
      guide.fill(0);
      guide.textStyle(NORMAL);
      guide.strokeWeight(1);
      guide.textFont("Noto Sans");
    let hslSplit = HSL[reducedColorIndexes[i]].replace("(", "").replace(")", "").split(",");
    if (hslSplit[2] < 30) {
      guide.fill(255);
      guide.stroke(255);
      guide.text(i + 1 + "", guide.width / 2 + 37, 27 + 48 * i);
      guide.fill(0);
      guide.stroke(0);
    } else {
      guide.text(i + 1 + "", guide.width / 2 + 37,27 + 48 * i);
    }
    guide.textFont("Verdana");
    guide.strokeWeight(2);
    //tile icon at left
    if (rgb[reducedColorIndexes[i]] == "(3,10,25)") {
      guide.stroke(255);
    } else {
      guide.stroke(0);
    }
    guide.fill(rgbSplit[0], rgbSplit[1], rgbSplit[2]);
    guide.ellipse(guide.width / 2 - 43, 30 + 48 * i, 21, 14);
    guide.strokeWeight(1);
    guide.line(guide.width / 2 - 54, 32 + 48 * i, guide.width / 2 - 54, 26 + 48 * i)
    guide.line(guide.width / 2 - 32, 32 + 48 * i, guide.width / 2 - 32, 26 + 48 * i)
    guide.strokeWeight(2);
    guide.ellipse(guide.width / 2 - 43, 25 + 48 * i, 21, 14);
  }
  confirmingGuide = true;
  button3.show();
  button3.position(canvasCenterX - button3n5 / 2, canvasY + 0.9 * canvas.height);
  button5.show();
  button5.position(button3.x + button3.width + 10, canvasY + 0.9 * canvas.height);
} 

function instructions(row, col) {
  let gridInst = createGraphics(520, 520, SVG)

  let diam = 30.4;
  gridInst.background(0,0,0,0);
  
  //handles all things to do with the pins
    //horizontal pins
  if (col != 0) {
    for (let r = 0; r < 3; r++) {
      gridInst.imageMode(CENTER);
      gridInst.image(pin1, 14, 93 + 152 * r);
    }
  }
    //vertical pins
  if (row != panelH - 1) {
    for (let c = 0; c < 3; c++) {
      gridInst.imageMode(CENTER);
      gridInst.image(pin2, 122 + 152 * c, gridInst.width - 14);
    }
  }
  
  //draws backing panel
  gridInst.strokeWeight(1);
  gridInst.fill(0);
  gridInst.stroke(255);
  gridInst.rectMode(CORNER);
  gridInst.rect(gridInst.width - 491, 1, 490, 490);

  let offset = 214; //originally 228
  
  //draws tiles and whatnot
  /*
  for (pixCol = 0; pixCol < 16; pixCol++) {
    for (pixRow = 0; pixRow < 16; pixRow++) {
      let rawColor = selectedImg.get(((userImage.width / panelW) * col) + ((userImage.width / panelW) / 32) + ((userImage.width / panelW) / 16 * pixCol), ((userImage.height / panelH) * row) + ((userImage.height / panelH) / 32) + ((userImage.height / panelH) / 16 * pixRow));
      //function that uses averaging to determine which of sortedColors is closest to color
      let filteredColor = whatColor(rawColor);

      //draws circle in position on grid, matching key circles, in determined color
      //numbered circle at right
      if (rgb[filteredColor] == "(3,10,25)") {
        gridInst.stroke(255);
      } else {
        gridInst.stroke(0);
      }
      let rgbSplit = rgb[filteredColor].replace("(", "").replace(")", "").split(",");
      gridInst.fill(rgbSplit[0], rgbSplit[1], rgbSplit[2]);
      gridInst.circle(gridInst.width / 2 - offset + (pixCol * diam), gridInst.height / 2 - offset - 28 + (pixRow * diam), diam);
        //numbering in circles
        gridInst.textAlign(CENTER, CENTER);
        gridInst.textStyle(NORMAL);
        gridInst.strokeWeight(1);
        gridInst.textFont("Noto Sans");
      let hslSplit = HSL[filteredColor].replace("(", "").replace(")", "").split(",");
      if (hslSplit[2] < 30) {
        gridInst.fill(255);
        gridInst.stroke(255);
      } else {
        gridInst.fill(0);
        gridInst.stroke(0);
      }
      gridInst.text(sortedColors.indexOf(filteredColor) + 1 + "", gridInst.width / 2 - offset + (pixCol * diam), 19 + (pixRow * diam));
    }
  }*/
  selectedImg.resize(aspectWidth, aspectHeight);
  //var pixelSpace = selectedImg.width / (panelW * 16);
  /*
  var pixelSpace = selectedImg.width / (panelW * 16);
  for (let row = 0; row < panelH * 16; row++) {
    for (let col = 0; col < panelW * 16; col++) {
      let rawColor = selectedImg.get(pixelSpace * 0.5 + pixelSpace * col, pixelSpace * 0.5 + pixelSpace * row);*/
  for (pixCol = 0; pixCol < 16; pixCol++) {
    for (pixRow = 0; pixRow < 16; pixRow++) {
      //let rawColor = selectedImg.get(pixelSpace * 0.5 + pixelSpace * col, pixelSpace * 0.5 + pixelSpace * row);
      let rawColor = selectedImg.get(((selectedImg.width / panelW) * col) + ((selectedImg.width / panelW) / 32) + ((selectedImg.width / panelW) / 16 * pixCol), ((selectedImg.height / panelH) * row) + ((selectedImg.height / panelH) / 32) + ((selectedImg.height / panelH) / 16 * pixRow));
      let filteredColor = whatColor(rawColor, reducedColorIndexes);
      //draws circle in position on grid, matching key circles, in determined color
      //numbered circle at right
      if (rgb[filteredColor] == "(3,10,25)") {
        gridInst.stroke(255);
      } else {
        gridInst.stroke(0);
      }
      let rgbSplit = rgb[filteredColor].replace("(", "").replace(")", "").split(",");
      gridInst.fill(rgbSplit[0], rgbSplit[1], rgbSplit[2]);
      gridInst.circle(gridInst.width / 2 - offset + (pixCol * diam), gridInst.height / 2 - offset - 28 + (pixRow * diam), diam);
        //numbering in circles
        gridInst.textAlign(CENTER, CENTER);
        gridInst.textStyle(NORMAL);
        gridInst.strokeWeight(1);
        gridInst.textFont("Noto Sans");
      let hslSplit = HSL[filteredColor].replace("(", "").replace(")", "").split(",");
      if (hslSplit[2] < 30) {
        gridInst.fill(255);
        gridInst.stroke(255);
      } else {
        gridInst.fill(0);
        gridInst.stroke(0);
      }
      gridInst.text(reducedColorIndexes.indexOf(filteredColor) + 1 + "", gridInst.width / 2 - offset + (pixCol * diam), 18 + (pixRow * diam));
    }
  }
  append(gridded, gridInst);
}

//takes given gridspace and whites out all else
function whiteout(row, col, endRow, endCol, complete) {
  let ratio = 120; //default 60
  //default buffer 11, not 22
  let whiteoutInst = createGraphics(22 + panelW * ratio, 22 + panelH * ratio, SVG); 
  whiteoutInst.translate(11,11);
  whiteoutInst.background(0,0,0,0);
  whiteoutInst.noStroke();
  whiteoutInst.imageMode(CORNER);
  whiteoutInst.rectMode(CORNER);

  whiteoutInst.fill(255,255,255,150);

  //whiteoutInst.image(selectedImg, 0, 0, panelW * 60, panelH * 60);
  whiteoutInst.image(modelIcon, -0.01, -0.1, panelW * ratio, panelH * ratio);

  //normal whiteout (all but one)
  if (endRow == false && endCol == false && complete == false) {
    for (let r = 0; r < panelH; r++) {
      for (let c = 0; c < panelW; c++) {
        if (r != row || c != col) {
          whiteoutInst.rect(c * ratio, r * ratio, ratio, ratio);
        }
      }
    }
    append(whiteouts, whiteoutInst);
  } else if (endRow == true) {
    //end of row whiteouts
    if (complete == false) {
      for (let r = 0; r < panelH; r++) {
        for (let c = 0; c < panelW; c++) {
          if (r != row) {
            whiteoutInst.rect(c * ratio, r * ratio, ratio, ratio);
          }
        }
      }
      append(whiteouts, whiteoutInst);
      whiteout(row, col, true, false, true);
    } else {
      for (let r = 0; r < panelH; r++) {
        for (let c = 0; c < panelW; c++) {
          if (r > row) {
            whiteoutInst.rect(c * ratio, r * ratio, ratio, ratio);
          }
        }
      }
      append(whiteouts, whiteoutInst);
    }
  } else {
    //end of col whiteouts
    if (complete == false) {
      for (let r = 0; r < panelH; r++) {
        for (let c = 0; c < panelW; c++) {
          if (c != col) {
            whiteoutInst.rect(c * ratio, r * ratio, ratio, ratio);
          }
        }
      }
      append(whiteouts, whiteoutInst);
      whiteout(row, col, false, true, true);
    } else {
      for (let r = 0; r < panelH; r++) {
        for (let c = 0; c < panelW; c++) {
          if (c > col) {
            whiteoutInst.rect(c * ratio, r * ratio, ratio, ratio);
          }
        }
      }
      append(whiteouts, whiteoutInst);
    }
  }
}

//Creates model icon used in whiteout
function modelIconRender() {
  let gridInst = createGraphics(1200, 800, SVG)

  let diam = 25;
  gridInst.background(0);
  
 
  
  //draws backing panel
  gridInst.strokeWeight(1);
  gridInst.fill(0);
  gridInst.stroke(255);
  gridInst.rectMode(CORNER);
  //gridInst.rect(gridInst.width - 491, 1, 490, 490);

  //let offset = 214; //originally 228

  selectedImg.resize(aspectWidth, aspectHeight);
  var pixelSpace = selectedImg.width / (panelW * 16);
  /*
  var pixelSpace = selectedImg.width / (panelW * 16);
  for (let row = 0; row < panelH * 16; row++) {
    for (let col = 0; col < panelW * 16; col++) {
      let rawColor = selectedImg.get(pixelSpace * 0.5 + pixelSpace * col, pixelSpace * 0.5 + pixelSpace * row);*/
  for (pixCol = 0; pixCol < panelW * 16; pixCol++) {
    for (pixRow = 0; pixRow < panelH * 16; pixRow++) {
      //let rawColor = selectedImg.get(pixelSpace * 0.5 + pixelSpace * col, pixelSpace * 0.5 + pixelSpace * row);
      //let rawColor = selectedImg.get(((selectedImg.width / panelW) * col) + ((selectedImg.width / panelW) / 32) + ((selectedImg.width / panelW) / 16 * pixCol), ((selectedImg.height / panelH) * row) + ((selectedImg.height / panelH) / 32) + ((selectedImg.height / panelH) / 16 * pixRow));
      let rawColor = selectedImg.get(pixelSpace * 0.5 + pixelSpace * pixCol, pixelSpace * 0.5 + pixelSpace * pixRow);
      let filteredColor = whatColor(rawColor, reducedColorIndexes);
      //draws circle in position on grid, matching key circles, in determined color
      //numbered circle at right
      if (rgb[filteredColor] == "(3,10,25)") {
        gridInst.stroke(255);
      } else {
        gridInst.stroke(0);
      }
      let rgbSplit = rgb[filteredColor].replace("(", "").replace(")", "").split(",");
      gridInst.fill(rgbSplit[0], rgbSplit[1], rgbSplit[2]);
      gridInst.circle((diam * 0.5) + pixCol * diam, (diam * 0.51) + pixRow * diam, diam);
        //numbering in circles
        /*
        gridInst.textAlign(CENTER, CENTER);
        gridInst.textStyle(NORMAL);
        gridInst.strokeWeight(1);
        gridInst.textFont("Noto Sans");
      let hslSplit = HSL[filteredColor].replace("(", "").replace(")", "").split(",");
      if (hslSplit[2] < 30) {
        gridInst.fill(255);
        gridInst.stroke(255);
      } else {
        gridInst.fill(0);
        gridInst.stroke(0);
      }*/
      //gridInst.text(reducedColorIndexes.indexOf(filteredColor) + 1 + "", gridInst.width / 2 - offset + (pixCol * diam), 18 + (pixRow * diam));
    }
  }
  //gridInst.resize(aspectWidth, aspectHeight);
  modelIcon = gridInst;
}


/**************
 * 
 * FUTURE WANTS
 * 
**************/
//Custom file upload
//Cropping/resizing
//Custom whiteout background
//3D support

/**************
 * 
 * BUG LIST
 * 
**************/

//when downloading, chrome only downloads first ten filesS - currently avoided by async waiting 1 sec every 10 dls