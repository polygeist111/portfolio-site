let xPos = 0;
let yPos = 0;

//graphics and objects
let guide;
let gridded = []; 
let whiteouts = [];
let pin1;
let pin2;
let allPages = [];
let img;

//general
const width = 600;
const height = 2 * width;

const fontSize = (width - 2 * (width / 9)) * 0.0875;

let rgb = [];
let HSL = [];
let blName = [];
let LEGOName = [];
let rgb2 = [];
let colorInd = [];
let rgb3 = [];

let colorIndexes = [33,1,37,18,2,3,4,5,6,7,8,9,10,11,12,0];
//haystack
//let colorIndexes = [26,37,20,3,21,8,1,0,9,35,10,16,12,22];
//pride flag
//let colorIndexes = [34,6,37,3,0,24,33,1,32,17,4,2,38];
//todd's car
//let colorIndexes = [37,30,28,11,4,16,31,10,2,18,12,20,21,35,0,19];
//all
//let colorIndexes = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,57,58,59,60];
//let colorIndexes = [];
//red 33
//blue 1
//white 37
//green 18
let sortedColors = [];
let sortedColorNames = [];

//stores non-image user inputs
let addedColors = "";
let modelName = "";

let panelW = 0;
let panelH = 0;

//inputs and buttons
  //color input
let inp1;
  //name input
let inp2;
  //dimensions input (WxH)
let inp3;
  //color submit
let button1;
  //name submit
let button2;
  //render color guide
let button3;
  //advances to next panel
let button4;
  //dimensions submit
let button5;
  //progress to instructions previews
let button6;
  //scroll left (viewing instructions)
let button7;
  //scroll right (viewing instructions)
let button8;
  //progress to whiteout previews
let button9;
  //scroll left (viewing whiteouts)
let button10;
  //scroll right (viewing whiteouts)
let button11;
  //confirm all and download
let button12;

//assorted program logic conditionals
let badColor = false;
let guideRendered = false;
let colorsAddedCount = 0;
let overColorCount = false;
let picReady = false;

//image input stuff
let imgInput;
let userImage;
let imgLoaded = false;

let pageNum = 0;
let whiteoutNum = 0;



let whiteoutReady = false;

let downloadReady = false;

let shell;


//loads 1x1 tile colors csv
function preload() {
  console.log("Mosaic Generator: Loading Color Data");
  //table = loadTable("MosaicGenerator/LEGO 1x1 Tile Colors - Sheet1.csv", "csv", "header");
  table = loadTable("LEGO 1x1 Tile Colors - Sheet1.csv", "csv", "header");

}



//reads data from csv and puts in arrays, creates input box and submit button
function setup() {
  createCanvas(width, height);
  //shell = document.getElementById("mosaicProj");
  //shell.appendChild(document.getElementById("defaultCanvas0"));

  rgb = table.getColumn("RGB");
  HSL = table.getColumn("HSL");
  blName = table.getColumn("Name (BL)");
  LEGOName = table.getColumn("Name (LEGO)");
  rgb2 = table.getColumn("RGB (In Renders)");
  colorInd = table.getColumn("Color Index");
  rgb3 = table.getColumn("RGB (In Stud.io Raw)");
  console.log(rgb);
  console.log(rgb3);

  //color guide
  inp1 = createInput().attribute('placeholder', "Color");
  inp1.position(width / 9, 2 * height / 9 + height / 24 + (((2 / 3) * height) / 16));
  //shell.appendChild(inp1);

  inp2 = createInput().attribute('placeholder', "Model Name");
  inp2.position(width / 9, 2 * height / 9);
  //shell.appendChild(inp2);


  button1 = createButton('submit');
  button1.position(inp1.x + inp1.width + 10, inp1.y);
  button1.mousePressed(addColor);
  //shell.appendChild(button1);

  button2 = createButton('submit');
  button2.position(inp2.x + inp2.width + 10, inp2.y);
  button2.mousePressed(printName);
  //shell.appendChild(button2);

  button3 = createButton("render guide");
  button3.position(width / 2 - button3.width / 2, height - height / 9);
  button3.mousePressed(sortGradient);
  //shell.appendChild(button3);

  //passes to other graphics
  button4 = createButton("confirm guide");
  button4.position(width / 2 - button4.width / 2, height - height / 22);
  button4.mousePressed(passToImage);
  //shell.appendChild(button4);

  //instructions graphics
  inp3 = createInput().attribute('placeholder', 'Dimensions (WxH)');
  inp3.position(width / 9, 2 * height / 9);
  //shell.appendChild(inp3);

  button5 = createButton("submit");
  button5.position(inp3.x + inp3.width + 10, inp3.y);
  button5.mousePressed(takeDims);
  //shell.appendChild(button5);


  imgInput = createFileInput(handleFile).attribute('id','userImg').attribute('accept',".png, .jpg, .jpeg");
  imgInput.position(width / 9, 2 * height / 9 + height / 24 + (((2 / 3) * height) / 16));
  //shell.appendChild(imgInput);

  
  button6 = createButton("render instructions");
  button6.position(width / 2 - button6.width / 2, height - height / 9);
  button6.mousePressed(iterateGrid);
  //shell.appendChild(button6);


  //scroller buttonsv for graphics (out of order for .width)
  button9 = createButton("render whiteouts");
  button9.position(width / 2 - button9.width / 2, height - height / 9);
  button9.mousePressed(showWhiteout);
  //shell.appendChild(button9);

  button7 = createButton("backward");
  button7.position(width / 2 - button3.width - button7.width, height - height / 9);
  button7.mousePressed(backPage1);
  //shell.appendChild(button7);

  button8 = createButton("forward");
  button8.position(width / 2 + button3.width, height - height / 9);
  button8.mousePressed(forwardPage1);
  //shell.appendChild(button8);

  //whiteout graphics (out of order for .width)
  button12 = createButton("confirm all and download");
  button12.position(width / 2 - button12.width / 2, height - height / 9);
  button12.mousePressed(pages);
  //shell.appendChild(button12);

  button10 = createButton("backward");
  button10.position(width / 2 - button3.width - button10.width, height - height / 9);
  button10.mousePressed(backPage2);
  //shell.appendChild(button10);

  button11 = createButton("forward");
  button11.position(width / 2 + button3.width, height - height / 9);
  button11.mousePressed(forwardPage2);
  //shell.appendChild(button11);





  //initial element states
  button3.hide();
  inp3.hide();
  button4.hide();
  button5.hide();
  imgInput.hide();
  button6.hide();
  button7.hide();
  button8.hide();
  button9.hide();
  button10.hide();
  button11.hide();
  button12.hide();

  //create pin graphic
  pin1 = createGraphics(30,20)
  createPin1();
  pin2 = createGraphics(20,30);
  createPin2();
}



//handles visual updates
function draw() {
  background(220);

  xPos = mouseX;
  yPos = mouseY;

  //locateCoord();
  
  noStroke();
  fill(0);
  textFont("Verdana");

  //prints error message for faulty color name
  if (badColor == true) {
    textAlign(LEFT, TOP);
    text("Please try again", button1.x + button1.width + 10, button1.y);
  }
  //prints error message for excessive colors added
  if (overColorCount == true) {
    textAlign(LEFT, TOP);
    text("Max colors added", button1.x + button1.width + 10, button1.y);
  }

  if (downloadReady == true) {
    //imageMode(CENTER);
    //image(allPages[0], width / 2, height / 2);
  } else if (whiteoutReady == true) {
    imageMode(CENTER);
    image(whiteouts[whiteoutNum], width / 2, height / 2);
  } else if (picReady == true) {
    imageMode(CENTER);
    image(gridded[pageNum], width / 2, height / 2);
  } else if (guideRendered == true) {
    textSize(25);
    textAlign(CENTER, TOP);
    text("Enter model info below", width/ 2, height / 9);
    if (panelW != 0) {
      textAlign(LEFT, TOP);
      textSize(15);
      text("W: " + panelW + " H: " + panelH, inp3.x, inp3.y + height / 21);
      if (imgLoaded != false) {
        button6.show();
      }
    }
    if (userImage != null && panelW != 0) {
      stroke(0);
      strokeWeight(1);
      imageMode(CENTER);
      image(img, width / 2, (imgInput.y + imgInput.height) + (button6.y - (imgInput.y + imgInput.height)) / 2, resize("x"), resize("y"));
      for (let row = 0; row <= panelH; row++) {
        line(width / 2 - resize("x") / 2 - 5, (imgInput.y + imgInput.height) + (button6.y - (imgInput.y + imgInput.height)) / 2 - resize("y") / 2 + (resize("y") / panelH) * row, width / 2 + resize("x") / 2,  (imgInput.y + imgInput.height) + (button6.y - (imgInput.y + imgInput.height)) / 2 - resize("y") / 2 + (resize("y") / panelH) * row);
      }
      for (let col = 0; col <= panelW; col++) {
        line(width / 2 - resize("x") / 2 + (resize("x") / panelW) * col, (imgInput.y + imgInput.height) + (button6.y - (imgInput.y + imgInput.height)) / 2 - resize("y") / 2 - 5, width / 2  - resize("x") / 2 + (resize("x") / panelW) * col, (imgInput.y + imgInput.height) + (button6.y - (imgInput.y + imgInput.height)) / 2 + resize("y") / 2);
      }
    }
  } else if (sortedColors != 0) {
    imageMode(CENTER);
    image(guide, width / 2, height / 2);
    button4.show();
  } else {
    textSize(25);
    textAlign(CENTER, TOP);
    text("Enter model info below", width/ 2, height / 9);
    textSize(15);
    text(addedColors, width / 2, inp1.y + height / 20);
    textAlign(LEFT, TOP);
    text(modelName, inp2.x, inp2.y + height / 21);
    //comment out for deployment
    //button3.show();
    //comment out for testing
    
    if (colorIndexes.length != 0 && modelName != 0) {
      button3.show();
    }
  }
}



//saves guide, all instruction images, and all whiteout
function download() {
  //saves color guide
  
  save(guide, modelName + "_guide.png");
  for (let page = 0; page < allPages.length; page++) {
    save(allPages[page], modelName + "_instructions_" + page + ".png");
  }
  for (let white = 0; white < whiteouts.length; white++) {
    save(whiteouts[white], modelName + "_whiteout_" + white + ".png");
  }
}



//assembles individual panel instructions with color guide
function pages() {
  button10.hide();
  button11.hide();
  button12.hide();

  for (let i = 0; i < gridded.length; i++) {
    let page = createGraphics(738, 662);

    page.background(0,0,0,0);
    //page.background(50);
    page.imageMode(CORNER);

    page.image(guide, 45, 88, 0.666 * guide.width, 0.666 * guide.height);
    page.image(gridded[i], 63 + 0.666 * guide.width, 88);

    append(allPages, page);
  }

  downloadReady = true;

  download();
}



//advances previews to whiteouts
function showWhiteout() {
  whiteoutReady = true;

  button7.hide();
  button8.hide();
  button9.hide();

  button10.show();
  button11.show();
  button12.show();
}



//grids out image by stated dimensions, uses nested for loop to call one function for graying (using raw image) and one function for instruction generating (generated image)
function iterateGrid() {
  picReady = true;

  inp3.hide();
  button5.hide();
  imgInput.hide();
  button6.hide();

  button7.show();
  button8.show();
  button9.show();
  
  let longDim = "";

  if (panelW <= panelH) {
    longDim = "width";
  } else {
    longDim = "height";
  }
  if (longDim == "width") {
    //traverses top to bottom
    for (let row = 0; row < panelH; row++) {
      //traverses left to right
      for (let col = 0; col < panelW; col++) {
        whiteout(row, col, false, false, false);
        instructions(row, col);
      }
      //send row to whiteout function, which generates widening unwhited space left to right (assembly of row)
      //whiteout function then whites out only areas not yet covered
      whiteout(row, 0, true, false, false);
    }
    //special whiteout tbd for final build
  } else {
    //traverses left to right
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
    //special whiteout tbd for final build
  }
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



//takes down panel dimensions of submitted image
function takeDims() {
  panelW = inp3.value().substring(0,inp3.value().indexOf("x"));
  panelH = inp3.value().substring(inp3.value().indexOf("x") + 1);
  inp3.value('');
}



//advances to screen to take image input and panel dimensions
function passToImage() {
  guideRendered = true;

  button4.hide();
  inp3.show();
  button5.show();
  imgInput.show();
}



//handles model name submit buttons
function printName() {
  modelName = inp2.value();
  inp2.value('');
}



//maybe remove / add to checkName?
function addColor() {
  mousePressed = false;

  const name = inp1.value();
  checkName(name);
  inp1.value('');
}



//handles logic and outcomes of checking entered color name against bl and LEGO name lists
function checkName(name) {
  let color = checkColor(name);
  if (color !== false && colorsAddedCount < 16) {
    badColor = false;
    overColorCount = false;
    colorsAddedCount++;
    append(colorIndexes, color);
    console.log (color + " " + blName[color]);
    addedColors += blName[color] + "\n";
  } else if (colorsAddedCount < 16) {
    console.log("not a valid color");
    badColor = true;
  } else {
    console.log("too many colors");
    overColorCount = true;
  }
}



//checks if entered color name is in either bricklink names list or lego names list for 1x1 round tile colors
function checkColor(colorName) {
  //console.log(blName[3].toLowerCase() + " " + colorName);
  for (let colorNum = 0; colorNum < blName.length; colorNum++) {
    if ((colorName.toLowerCase() == blName[colorNum].toLowerCase() || (colorName.toLowerCase() == LEGOName[colorNum].toLowerCase() || colorName == colorNum) && LEGOName[colorNum] != "")) {
      for (var i = 0; i < colorIndexes.length; i++) {
        if (colorIndexes[i] == colorNum) {
          return false;
        }
      }
      return colorNum;
    }
  }
  return false;
}



//Uses colorIndexes to resort colors by hue (0 --> 360), where colors with matching hues are then sorted by lightness (100 --> 0). Also removes objects from screen
function sortGradient() {
  if (colorIndexes.length != 0) {
    button1.hide();
    button2.hide();
    button3.hide()
    inp1.hide();
    inp2.hide();
  
    overColorCount = false;

    let tempColorList = [];
    let outerLength;
    let brightHue = 361;
    let brightInd = 0;
  
    for (let i = 0; i < colorIndexes.length; i++) {
      append(tempColorList, colorIndexes[i]);
    } 
    outerLength = tempColorList.length;
    for (let outerL = 0; outerL < outerLength; outerL++) {
      for (let tempI = 0; tempI < tempColorList.length; tempI++) {
        if (parseInt(HSL[tempColorList[tempI]].substring(1, HSL[tempColorList[tempI]].indexOf(","))) <= brightHue) {
          if (HSL[tempColorList[tempI]].substring(1, HSL[tempColorList[tempI]].indexOf(",")) == brightHue) {
            if (parseInt(HSL[tempColorList[tempI]].substring(HSL[tempColorList[tempI]].indexOf(",", HSL[tempColorList[tempI]].indexOf(",") + 1) + 1, HSL[tempColorList[tempI]].indexOf(")"))) > parseInt(HSL[tempColorList[brightInd]].substring(HSL[tempColorList[brightInd]].indexOf(",", HSL[tempColorList[brightInd]].indexOf(",") + 1) + 1, HSL[tempColorList[brightInd]].indexOf(")")))) {
              brightHue = HSL[tempColorList[tempI]].substring(1, HSL[tempColorList[tempI]].indexOf(","));
              brightInd = tempI;
            }
          } else {
            brightHue = HSL[tempColorList[tempI]].substring(1, HSL[tempColorList[tempI]].indexOf(","));
            brightInd = tempI;
          }
        }
      }
    
      append(sortedColors, tempColorList[brightInd]);
      append(sortedColorNames, blName[tempColorList[brightInd]]);
      tempColorList.splice(brightInd, 1);
      console.log("sorted colors by index: " + sortedColors);
      brightInd = 0;
      brightHue = 361;
    }
    let sortedHues = "";
    let sortedNames = "";
    for (let s = 0; s < sortedColors.length; s++) {
      sortedHues += HSL[sortedColors[s]].substring(1, HSL[sortedColors[s]].indexOf(",")) + ",";
      sortedNames += blName[sortedColors[s]] + ",";
    }

    console.log("sorted hues: " + sortedHues);
    console.log("sorted names: " + sortedNames);

  createGuide();
  }
}



//takes given gridspace and renders instructions for it
/*
function instructions(row, col) {
  let gridInst = createGraphics(width,width)

  let diam = canvas.width * 0.050667;
  gridInst.background(0,0,0,0);

  //handles all things to do with the pins
    //horizontal pins
  if (col != 0) {
    gridInst.translate(15,0);
    if (row == panelH - 1) {
      gridInst.translate(0,15);
    }
    for (let r = 0; r < 3; r++) {
      gridInst.imageMode(CENTER);
      gridInst.image(pin1, 40, 133 + 152 * r);
    }
    if (row == panelH - 1) {
      gridInst.translate(0,-15);
    }
  }
    //vertical pins
  if (row != panelH - 1) {
    gridInst.translate(0,-15);
    gridInst.translate(-15,0);
    for (let c = 0; c < 3; c++) {
      gridInst.imageMode(CENTER);
      gridInst.image(pin2, 163 + 152 * c, gridInst.width - 40);
    }
    gridInst.translate(15,0);
  }

  //draws backing panel
  gridInst.strokeWeight(1);
  gridInst.fill(0);
  gridInst.stroke(255);
  gridInst.rectMode(CENTER);
  gridInst.rect(gridInst.width / 2, gridInst.height / 2, 490, 490);
  
  //draws tiles and whatnot
  for (pixCol = 0; pixCol < 16; pixCol++) {
    for (pixRow = 0; pixRow < 16; pixRow++) {
      let rawColor = img.get(((userImage.width / panelW) * col) + ((userImage.width / panelW) / 32) + ((userImage.width / panelW) / 16 * pixCol), ((userImage.height / panelH) * row) + ((userImage.height / panelH) / 32) + ((userImage.height / panelH) / 16 * pixRow));
      let rawCol = hue(rawColor);
      if (pixCol == 1 && pixRow == 1) {
        //console.log(rawColor);
      }
      //function that uses averaging to determine which of sortedColors is closest to color
      //let filteredColor = whatColor(rawCol);
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
      gridInst.circle(gridInst.width / 2 - 228 + (pixCol * diam), gridInst.height / 2 - 228 + (pixRow * diam), diam);
        //numbering in circles
        gridInst.textAlign(CENTER, CENTER);
        gridInst.fill(0);
        gridInst.textStyle(NORMAL);
        gridInst.strokeWeight(1);
        gridInst.textFont("Noto Sans");
      let hslSplit = HSL[filteredColor].replace("(", "").replace(")", "").split(",");
      if (hslSplit[2] < 30) {
        gridInst.fill(255);
        gridInst.stroke(255);
        gridInst.text(sortedColors.indexOf(filteredColor) + 1 + "", gridInst.width / 2 - 228 + (pixCol * diam), gridInst.height / 2 - 228 + (pixRow * diam));
        gridInst.fill(0);
        gridInst.stroke(0);
      } else {
        gridInst.text(sortedColors.indexOf(filteredColor) + 1 + "", gridInst.width / 2 - 228 + (pixCol * diam), gridInst.height / 2 - 228 + (pixRow * diam));
      }
    }
  }
  //add in friction pins as needed
  append(gridded, gridInst);

  if (col != 0) {
    gridInst.translate(-15,0);
  }
  if (row != panelH - 1) {
    gridInst.translate(0,15);
  }
  //console.log(sortedColorNames);
}
*/

function instructions(row, col) {
  let gridInst = createGraphics(520,520)

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
  for (pixCol = 0; pixCol < 16; pixCol++) {
    for (pixRow = 0; pixRow < 16; pixRow++) {
      let rawColor = img.get(((userImage.width / panelW) * col) + ((userImage.width / panelW) / 32) + ((userImage.width / panelW) / 16 * pixCol), ((userImage.height / panelH) * row) + ((userImage.height / panelH) / 32) + ((userImage.height / panelH) / 16 * pixRow));
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
      gridInst.text(sortedColors.indexOf(filteredColor) + 1 + "", gridInst.width / 2 - offset + (pixCol * diam), 18 + (pixRow * diam));
    }
  }
  append(gridded, gridInst);
}



//takes given gridspace and whites out all else
function whiteout(row, col, endRow, endCol, complete) {
  let whiteoutInst = createGraphics(11 + panelW * 60, 11 + panelH * 60); 
  whiteoutInst.translate(11,11);
  whiteoutInst.background(0,0,0,0);
  whiteoutInst.noStroke();
  whiteoutInst.imageMode(CORNER);
  whiteoutInst.rectMode(CORNER);

  whiteoutInst.fill(255,255,255,150);

  whiteoutInst.image(img, 0, 0, panelW * 60, panelH * 60);

  //normal whiteout (all but one)
  if (endRow == false && endCol == false && complete == false) {
    for (let r = 0; r < panelH; r++) {
      for (let c = 0; c < panelW; c++) {
        if (r != row || c != col) {
          whiteoutInst.rect(c * 60, r * 60, 60, 60);
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
            whiteoutInst.rect(c * 60, r * 60, 60, 60);
          }
        }
      }
      append(whiteouts, whiteoutInst);
      whiteout(row, col, true, false, true);
    } else {
      for (let r = 0; r < panelH; r++) {
        for (let c = 0; c < panelW; c++) {
          if (r > row) {
            whiteoutInst.rect(c * 60, r * 60, 60, 60);
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
            whiteoutInst.rect(c * 60, r * 60, 60, 60);
          }
        }
      }
      append(whiteouts, whiteoutInst);
      whiteout(row, col, false, true, true);
    } else {
      for (let r = 0; r < panelH; r++) {
        for (let c = 0; c < panelW; c++) {
          if (c > col) {
            whiteoutInst.rect(c * 60, r * 60, 60, 60);
          }
        }
      }
      append(whiteouts, whiteoutInst);
    }
  }
}



//Compares color from tile in image to list of sorted colors to identify it, in liue of reading IO file
function whatColor(color) {
  let adjust = -10;
  let distances = [];
  let redDist;
  let greenDist;
  let blueDist;
  let avgDist;

  for (let i = 0; i < sortedColors.length; i++) {
    let rgbSplit = rgb[sortedColors[i]].replace("(", "").replace(")", "").split(",");
    let HSLSplit = HSL[sortedColors[i]].replace("(", "").replace(")", "").split(",");
    let rgb2Split = rgb2[sortedColors[i]].replace("(", "").replace(")", "").split(",");
    let rgb3Split = rgb3[sortedColors[i]].replace("(", "").replace(")", "").split(",");

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
  return(sortedColors[lowInd]);
}



//helps process user image input
//borrowed from https://stackoverflow.com/questions/65858566/need-to-upload-users-image-input-p5-javascript-library
function handleFile(file) {
  if (file.type === 'image') {

    userImage = createImg(file.data, '');
    userImage.hide();

    const selectedFile = document.getElementById('userImg');
    const myImageFile = selectedFile.files[0];
    let urlOfImageFile = URL.createObjectURL(myImageFile);
    img = loadImage(urlOfImageFile, a => {
      imgLoaded = true;
    });

    img.loadPixels();
    
  } else {
    userImage = null;
  }
}



//resizes submitted image to thumbnail on second input screen
function resize(dimName) {
  let largeDimNum = 0;
  let conversionRatio = 0;
  if (userImage.width >= userImage.height) {
    largeDimNum = userImage.width;
  } else {
    largeDimNum = userImage.height;
  }
  conversionRatio = (7 * width / 9) / largeDimNum;
  if (dimName == "x") {
    return userImage.width * conversionRatio;
  } else if (dimName == "y") {
    return userImage.height * conversionRatio;
  } else if (dimName == null) {
    return conversionRatio;
  }
}



//resets all changed global variables to default initial states
function resetToDefault() {
  modelName = "";
  addedColors = "";
  colorIndexes = [];
  badColor = false;
  mousePressed = false;
  sortedColors = [];
  guideRendered = false;
  colorsAddedCount = 0;
  overColorCount = false;
  picReady = false;
  userImage = null;
  img = null;
  imgLoaded = false;
}



//creates color guide layout and assigns to "guide" graphic object
function createGuide() {
  print("hi");
  //creates graphic objects
  guide = createGraphics(140, 27 + 48 * (sortedColors.length - 1) + 29);

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
  for (let i = 0; i < sortedColors.length; i++) {
    //arrows
    guide.fill(255);
    guide.stroke(255);
    guide.line(guide.width / 2 - 21, 27 + 48 * i, guide.width / 2 + 7, 27 + 48 * i);
    guide.triangle(guide.width / 2 - 5, 24 + 48 * i, guide.width / 2 - 5, 27 + 48 * i, guide.width / 2 + 3, 26 + 48 * i);
    guide.triangle(guide.width / 2 - 5, 30 + 48 * i, guide.width / 2 - 5, 27 + 48 * i, guide.width / 2 + 3, 28 + 48 * i);
    //numbered circle at right
    if (rgb[sortedColors[i]] == "(3,10,25)") {
      guide.stroke(255);
    } else {
      guide.stroke(0);
    }
    let rgbSplit = rgb[sortedColors[i]].replace("(", "").replace(")", "").split(",");
    guide.fill(rgbSplit[0], rgbSplit[1], rgbSplit[2]);
    guide.circle(guide.width / 2 + 37,27 + 48 * i, 36);
      //numbering in circles
      guide.textAlign(CENTER, CENTER);
      guide.fill(0);
      guide.textStyle(NORMAL);
      guide.strokeWeight(1);
      guide.textFont("Noto Sans");
    let hslSplit = HSL[sortedColors[i]].replace("(", "").replace(")", "").split(",");
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
    if (rgb[sortedColors[i]] == "(3,10,25)") {
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
}



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

//prints mouse coordinates to screen for dev use
function locateCoord() {
  noStroke();
  fill(0);
  textFont("Verdana");
  textSize(20);
  textAlign(CENTER, CENTER);
  text(("(" + xPos + "," + yPos + ")"), width / 2, height - 15);
}



/* NOTES
dimensions button needs to check for submission validity ( >0, int)
add a glint in guide for flat silver and pearl gold
one panel space = 60x60 pixels for whiteout

line 261 calls instruction generator

//convert every color cell to object, click each to open color dropdown, have option for select all with same color
dark azure rgb reads red wrong

guide inputs --> guide render --> image inputs --> scrollable gray-outs --> scrollable panel color-by-numbers
once all else is working, figure out how to save transparent pngs (createGraphic, assign drawings to graphic)
*/