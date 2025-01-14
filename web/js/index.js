

let tickYarr = [];
let tickXarr = [];
let pointsarr = [];

let tickYbasis = 0;

let tickYincrement = 0.25;
let tickXincrement = 200;

let tickYbasis2 = 0;

let tickYincrement2 = 0.25;
let tickXincrement2 = 200;

function openprefs(){
    document.getElementById('preferences').style.display = 'block';
    document.getElementById('preferences').style.opacity = 1;
    document.getElementById('preferences').style.top = '25%';
}


function openel(el){
    document.getElementById(el).style.display = 'block';
    document.getElementById(el).style.opacity = 1;
    document.getElementById(el).style.top = '25%';
}

function toggletheme(override){
    var r = document.querySelector(':root');

    let endtime = new Date();
    var timediff = endtime - lasttoggle; 
    lasttoggle = endtime;

    if (timediff < 333 && !override){
        return;
    }

    console.log('changeing from  '+theme);
    if (theme == 'dark'){
        // make light
        theme = 'light';
        localStorage.setItem('bttheme','light');
        document.getElementById('theme').textContent = "Theme: (light)";
        r.style.setProperty('--bg', 'white');
        r.style.setProperty('--bgslight', 'rgba(255,255,255,0.6)');
        r.style.setProperty('--contrast', 'black');
        r.style.setProperty('--main', '#0d6efd');
        r.style.setProperty('--secondary', '#0a4bad');
        r.style.setProperty('--slight', 'rgb(220,220,220)');
    } else {
        // make dark
        theme = 'dark';
        localStorage.setItem('bttheme','dark');
        document.getElementById('theme').textContent = "Theme: (dark)";
        r.style.setProperty('--bgslight', 'rgba(30,30,30,0.6)');
        r.style.setProperty('--bg', 'black');
        r.style.setProperty('--contrast', 'white');
        r.style.setProperty('--main', '#0d6efd');
        r.style.setProperty('--secondary', '#0a4bad');
        r.style.setProperty('--slight', 'rgb(30, 30, 30)');
    }
}

function forcedark(){
    theme = 'dark';
    localStorage.setItem('bttheme','dark');
    document.getElementById('theme').textContent = "Theme: (dark)";
    
    var r = document.querySelector(':root');
    r.style.setProperty('--bgslight', 'rgba(30,30,30,0.6)');
    r.style.setProperty('--bg', 'black');
    r.style.setProperty('--contrast', 'white');
    r.style.setProperty('--main', '#0d6efd');
    r.style.setProperty('--secondary', '#0a4bad');
    r.style.setProperty('--slight', 'rgb(30, 30, 30)');
}

function closeprefs(){
    //document.getElementById('solutions').style.display = 'none';
    document.getElementById('preferences').style.opacity = 0;
    document.getElementById('preferences').style.top = '100%';
}

function closeel(el){
    //document.getElementById('solutions').style.display = 'none';
    document.getElementById(el).style.opacity = 0;
    document.getElementById(el).style.top = '100%';

}

function closesolutions(){
    //document.getElementById('solutions').style.display = 'none';
    document.getElementById('solutions').style.opacity = 0;
    document.getElementById('solutions').style.top = '100%';
}

function closeinstructions(){
    document.getElementById('instructions').style.top = '100%';
    document.getElementById('instructions').style.opacity = 0;
}
  

function enableanalysis(){
    document.getElementById("coolbutton").style.opacity = 1;
    document.getElementById("coolbutton").style.cursor = "pointer";
    proceedenabled = true;
}

function switchscreens(){
    if (!proceedenabled){
        return;
    }
    document.getElementById("screen1").style.display = "none";
    document.getElementById("screen2").style.display = "block";

    updateOptimalGraph();

    // the dict makedict returns is not important at this point
    makedict(phoneAccelerometerCSV, "PhoneAccel");
    makedict(phoneGyroscopeCSV, "PhoneGyro");
    makedict(phoneMagnetometerCSV, "PhoneMag");
}

function initDraw(){
    let i = 20;
    let n = 0;
    while (i <= 100){
      drawTickY(0,i,n);
      n += 1;
      i += 10*2;
    }
    i = 10;
    n = 0;
    while (i <= 100){
      drawTickX(i, n, 0);
      i += 10;
    }
  }
  

function goodNumber(num){
    if (num < 100){
        return "&nbsp&nbsp"+String(num);
    }

    return String(num);
}


async function growPoint(id){

    let obj = document.getElementById(id);

    let w = 1;
    while (w < 100){
    obj.style.width = (w/100)*2.8+"%";
    await sleep();
    w += (110-w)/20;
    }
} 
  
function drawPoint(x, y, n, grow) {
    const num = n;

    console.log("drawing point at untampered "+x+" "+y);


    [coordX, coordY] = getcoord(x,y);

    // console.log("drawing point at "+coordX+" "+coordY);
    plotgraph.innerHTML += `<div class=point style="left: ${coordX}px; top: ${coordY}px;"></div>`;

}


function graphString(source, feature) {

    let arr = source[feature];

    let endstr = ""

    let i = 0;
    while (i < arr.length){
        if (!isNaN(arr[i])){
            // point[0]/tickXincrement*10, point[1]/tickYincrement*10*2
            [coordX, coordY] = getcoord(i/tickXincrement*10, (arr[i]-tickYbasis)/tickYincrement*10*2);

            endstr += `<div class=point style="left: ${coordX}px; top: ${coordY}px;"></div>`;
        
        }
        i += 1;
    }

    return endstr;
}


function getcoord(percentX, percentY) {

    // let x = plotgraph.offsetLeft+percentX/100*plotgraph.offsetWidth+1.5;
    // let y = plotgraph.offsetTop+(1-(percentY/100))*plotgraph.offsetHeight+1.5;

    let x = percentX/100*plotgraph.offsetWidth;
    let y = (1-(percentY/100))*plotgraph.offsetHeight;

    return [x,y];
}

function tworound(num){
    return Math.round((num + Number.EPSILON) * 100) / 100
}

  
function drawTickX(x, y, i, push=true) {
    if (push){
        tickXarr.push([x, y]);
    }

    [coordX, coordY] = getcoord(x,y);

    plotgraph.innerHTML += `
    <div id="labelX${i}" class=tickLabel style="left: ${coordX-7.75-3}px; top: ${coordY}px;">${tworound(x*(tickXincrement/1000))}</div>
    <div id="tickX${i}" class=tickX style="left: ${coordX-3}px; top: ${coordY-0.017*plotgraph.offsetHeight}px;"></div>`;
}



function drawTickX2(x, y, i, push=true) {
    if (push){
        tickXarr.push([x, y]);
    }

    [coordX, coordY] = getcoord(x,y);

    plotgraph2.innerHTML += `
    <div id="labelX${i}" class=tickLabel style="left: ${coordX-7.75-3}px; top: ${coordY}px;">${tworound(x*(tickXincrement/1000))}</div>
    <div id="tickX${i}" class=tickX style="left: ${coordX-3}px; top: ${coordY-0.017*plotgraph.offsetHeight}px;"></div>`;
}


function drawTickY(x, y, num, push=true) {
    if (push){
        tickYarr.push([x, y]);
    }
  
    [coordX, coordY] = getcoord(x,y);

    // IMPORTANT: HALFS DISPLAY VALUE
  
    plotgraph.innerHTML += `
      <div id="labelY${num}" class=tickLabel style="left: ${coordX-0.04*window.innerWidth}px; top: ${coordY-9.75+2}px;">${goodNumber(tworound(y*(tickYincrement/10)/2+tickYbasis))}</div>
      <div id="tickY${num}" class=tickY style="left: ${coordX}px; top: ${coordY+2}px;"></div>`;
}

function drawTickY2(x, y, num, push=true) {
    if (push){
        tickYarr.push([x, y]);
    }
  
    [coordX, coordY] = getcoord(x,y);

    // IMPORTANT: HALFS DISPLAY VALUE
  
    plotgraph2.innerHTML += `
      <div id="labelY${num}" class=tickLabel style="left: ${coordX-0.04*window.innerWidth}px; top: ${coordY-9.75+2}px;">${goodNumber(tworound(y*(tickYincrement/10)/2+tickYbasis))}</div>
      <div id="tickY${num}" class=tickY style="left: ${coordX}px; top: ${coordY+2}px;"></div>`;
}

function drawResid(x, y, num){

    console.log("in resid");

    let [coordX, coordY] = getcoord(x,y);

    let resid = pointsarr[num][1] - ySolution(pointsarr[num][0]);

    const w = pointsarr[num][0]/tickXincrement*10+0.7+"%";
    let storeh = resid/tickYincrement*10+0.05;
    //const h = (resid/tickYincrement*10+0.05)+"%";

    // alert(storeh, resid);

    let offset;

    if (resid >= 0){
        offset = ySolution(pointsarr[num][0])/tickYincrement*10+"%";
    } else {
        storeh = -storeh;

        offset = pointsarr[num][1]/tickYincrement*10+"%";
    }

    storeh = storeh + "%";


    const h = storeh;

    const offsetuse = offset;

    console.log("middle of resid");

    residualArr.push(resid);


    plotgraph.innerHTML += `
    <div id="residualLine${num}" class=residualLine style="width: ${w}; height: ${h}; bottom: ${offsetuse}"></div>`;

}

function addpointmanual(x, y){

    let newpts = [x,y];
    pointsarr.push(newpts);

    lite();

    // in this case, not even needed since we pre-scale axes
    // monitorChange(x,y);
  }


// we dont actually care about this for this i think
function monitorChange(x,y){

    if (x <= tickXincrement*10 && y <= tickYincrement*5){
        return;
    }
  
    while (x > tickXincrement*10){
      tickXincrement = tickXincrement + 0.01;
    }
  
  
    while (y > tickYincrement*5){
      tickYincrement = tickYincrement + 0.01;
    }

    console.log("increments changed",tickXincrement, tickYincrement);

  
    redraw();
}


function predraw(feature){
    console.log('feature',feature);

    let label;

    if (feature == "PhoneAccelX"){
        tickYbasis = -1.25;
        tickYincrement = 0.25;
        label = "m/s²";
    } else if (feature == "PhoneAccelY"){
        tickYbasis = 0;
        tickYincrement = 0.25;
        label = "m/s²";
    } else if (feature == "PhoneAccelZ"){
        tickYbasis = -0.7;
        tickYincrement = 0.25;
        label = "m/s²";
    } else if (feature == "PhoneGyroX"){
        tickYbasis = -0.25;
        tickYincrement = 0.1;        
        label = "rad/s";
    } else if (feature == "PhoneGyroY"){
        tickYbasis = -0.5;
        tickYincrement = 0.1;
        label = "μT";
    } else if (feature == "PhoneGyroZ"){
        tickYbasis = -1.25;
        tickYincrement = 0.1;
        label = "μT";
    } else if (feature == "PhoneMagX"){
        tickYbasis = -2;
        tickYincrement = 1;
        label = "μT";
    } else if (feature == "PhoneMagY"){
        tickYbasis = -1.75;
        tickYincrement = 1;
        label = "μT";
    } else if (feature == "PhoneMagZ"){
        tickYbasis = -2;
        tickYincrement = 1;
        label = "μT";
    }

    plotgraph.innerHTML = ``;
  
    let i = tickYbasis;
    for (tick of tickYarr){
      drawTickY(tick[0], tick[1], i, false);
      i += tickYincrement;
    }

    [coordX, coordY] = getcoord(0,0);

    plotgraph.innerHTML += `
    <div class=tickLabel style="left: ${coordX-0.035*window.innerWidth}px; top: ${coordY-9.75+2}px;">${label}</div>`;

  
    i = 0;
    for (tick of tickXarr){
      drawTickX(tick[0], tick[1], i, false);
      i += 1;
    }
}


function predrawsecond(feature){
    console.log('feature',feature);

    let label;

    if (feature == "PhoneAccelX"){
        tickYbasis2 = -1.25;
        tickYincrement2 = 0.25;
        label = "m/s²";
    } else if (feature == "PhoneAccelY"){
        tickYbasis2 = 0;
        tickYincrement2 = 0.25;
        label = "m/s²";
    } else if (feature == "PhoneAccelZ"){
        tickYbasis2 = -0.7;
        tickYincrement2 = 0.25;
        label = "m/s²";
    } else if (feature == "PhoneGyroX"){
        tickYbasis2 = -0.25;
        tickYincrement2 = 0.1;        
        label = "rad/s";
    } else if (feature == "PhoneGyroY"){
        tickYbasis2 = -0.5;
        tickYincrement2 = 0.1;
        label = "μT";
    } else if (feature == "PhoneGyroZ"){
        tickYbasis2 = -1.25;
        tickYincrement2 = 0.1;
        label = "μT";
    } else if (feature == "PhoneMagX"){
        tickYbasis2 = -2;
        tickYincrement2 = 1;
        label = "μT";
    } else if (feature == "PhoneMagY"){
        tickYbasis2 = -1.75;
        tickYincrement2 = 1;
        label = "μT";
    } else if (feature == "PhoneMagZ"){
        tickYbasis2 = -2;
        tickYincrement2 = 1;
        label = "μT";
    }

    plotgraph2.innerHTML = ``;
  
    let i = tickYbasis;
    for (tick of tickYarr){
      drawTickY2(tick[0], tick[1], i, false);
      i += tickYincrement;
    }

    [coordX, coordY] = getcoord(0,0);

    plotgraph2.innerHTML += `
    <div class=tickLabel style="left: ${coordX-0.035*window.innerWidth}px; top: ${coordY-9.75+2}px;">${label}</div>`;

  
    i = 0;
    for (tick of tickXarr){
      drawTickX2(tick[0], tick[1], i, false);
      i += 1;
    }
}



function redraw(pointgrow = null){

    plotgraph.innerHTML = ``;
  
    let i = tickYbasis;
    for (tick of tickYarr){
      drawTickY(tick[0], tick[1], i, false);
      i += tickYincrement;
    }
  
    i = 0;
    for (tick of tickXarr){
      drawTickX(tick[0], tick[1], i, false);
      i += 1;
    }
  
    console.log(pointgrow)
  
    i = 0;
    for (point of pointsarr){
      drawPoint(point[0]/tickXincrement*10, (point[1]-tickYbasis)/tickYincrement*10*2, i, (pointgrow == i));
      i += 1;
    }
  
    // plotgraph.innerHTML += `<div id="tickedBox" class="tickedBox"></div>`;
  
}

// lite redraw
function redrawlite(){
  
    let i = pointsarr.length-1;
  
    // console.log("point "+i+" being drawn");
    point = pointsarr[i];
    drawPoint(point[0]/tickXincrement*10, (point[1]-tickYbasis)/tickYincrement*10*2, i, true)
}

function makedict(datastr, type){
    let spltup = datastr.split('\n');

    let enddict = {
        "time": [],
        "seconds_elapsed": [],
        "x": [],
        "y": [],
        "z": []
    };

    let i = 1;
    while (i < spltup.length){
        let line = spltup[i].split(',');
        enddict.time.push(parseInt(line[0]));
        enddict.seconds_elapsed.push(parseInt(line[1]));
        enddict.x.push(parseFloat(line[2]));
        enddict.y.push(parseFloat(line[3]));
        enddict.z.push(parseFloat(line[4]));
        i += 1;
    }

    if (type == "PhoneAccel"){
        sampleDict.PhoneAccelX = enddict.x;
        sampleDict.PhoneAccelY = enddict.y;
        sampleDict.PhoneAccelZ = enddict.z;
    } else if (type == "PhoneGyro"){
        sampleDict.PhoneGyroX = enddict.x;
        sampleDict.PhoneGyroY = enddict.y;
        sampleDict.PhoneGyroZ = enddict.z;
    } else if (type == "PhoneMag"){
        sampleDict.PhoneMagX = enddict.x;
        sampleDict.PhoneMagY = enddict.y;
        sampleDict.PhoneMagZ = enddict.z;
    }

    return enddict;
}


let phoneAccelerometerCSV;
let phoneGyroscopeCSV;
let phoneMagnetometerCSV;
let watchAccelerometerCSV;
let watchGyroscopeCSV;
let watchMagnetometerCSV;

let proceedenabled = false;

let i = 1;
while (i < 7){
    const j = i;
    document.getElementById('file-upload'+j).addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
    
            document.getElementById("upload"+j).innerHTML = `
            <div class="upload-text" style="width: 50%; text-align: right; float: left;">Uploaded</div>
            <img src="./assets/greencheck.png" alt="checkmark" style="margin-left: 5%; margin-top: 2%; width: 10%; float: left;">
            `;
    
            document.getElementById('file-upload'+j).disabled = true;
            document.getElementById('upload'+j).style.cursor = "not-allowed";
            document.getElementById('file-upload'+j).style.cursor = "not-allowed";
    
    
    
            const reader = new FileReader();
            reader.onload = function(e) {
                const content = e.target.result;
                // document.getElementById('output').innerText = content;
                if (j == 1){
                    phoneAccelerometerCSV = content;
                } else if (j == 2){
                    phoneGyroscopeCSV = content;
                } else if (j == 3){
                    phoneMagnetometerCSV = content;
                } else if (j == 4){
                    watchAccelerometerCSV = content;
                } else if (j == 5){
                    watchGyroscopeCSV = content;
                } else if (j == 6){
                    watchMagnetometerCSV = content;
                }
                console.log(content);
    
                if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && watchAccelerometerCSV != null && watchGyroscopeCSV != null && watchMagnetometerCSV != null){
                    enableanalysis();
                }
            };
            reader.readAsText(file);
        }
    });
    i += 1;
}

initDraw();



function makesampledict(datastr){
    let spltup = datastr.split('\n');

    let enddict = {
        "PhoneAccelX": [],
        "PhoneAccelY": [],
        "PhoneAccelZ": [],
        "PhoneGyroX": [],
        "PhoneGyroY": [],
        "PhoneGyroZ": [],
        "PhoneMagX": [],
        "PhoneMagY": [],
        "PhoneMagZ": []
    };

    let i = 1;
    while (i < spltup.length){
        let line = spltup[i].split(',');
        enddict.PhoneAccelZ.push(parseFloat(line[3]));
        enddict.PhoneAccelY.push(parseFloat(line[4]));
        enddict.PhoneAccelX.push(parseFloat(line[5]));

        enddict.PhoneGyroZ.push(parseFloat(line[6]));
        enddict.PhoneGyroY.push(parseFloat(line[7]));
        enddict.PhoneGyroX.push(parseFloat(line[8]));

        enddict.PhoneMagZ.push(parseFloat(line[9]));
        enddict.PhoneMagY.push(parseFloat(line[10]));
        enddict.PhoneMagX.push(parseFloat(line[11]));
        i += 1;
    }

    return enddict;
}

let optimaldata;


function plotOptimalFeature(feature){
    predraw(feature);
    plotgraph.innerHTML += graphString(optimaldata, feature);

    predrawsecond(feature);
    plotgraph2.innerHTML += graphString(sampleDict, feature);

    // CAREFUL: Not stored in pointsarr
}

function updateOptimalGraph(){
    let feature = document.getElementById('feature').value;
    pointsarr = [];
    redraw();
    plotOptimalFeature(feature);
}

async function fetchCSV(url) {
    try {
        const response = await fetch(url);
        const data = await response.text();
        console.log(data);
        optimaldata = makesampledict(data);
        console.log(optimaldata);
        updateOptimalGraph();
    } catch (error) {
        console.error('Error fetching CSV:', error);
    }
}


let sampleDict = {
    "PhoneAccelX": [],
    "PhoneAccelY": [],
    "PhoneAccelZ": [],
    "PhoneGyroX": [],
    "PhoneGyroY": [],
    "PhoneGyroZ": [],
    "PhoneMagX": [],
    "PhoneMagY": [],
    "PhoneMagZ": []
};


fetchCSV('https://concretecanoe.skparab1.com/web/assets/Anthony_Optimal_Split_Forweb.csv');

// load the settings from localstorage
let theme = localStorage.getItem('bttheme');
let angle = localStorage.getItem('btangle');
let demospeed = localStorage.getItem('btspeed');

let lasttoggle = new Date();


if (theme == null){
    localStorage.setItem("bttheme",'dark');
    theme = 'dark';
    forcedark();
} else if (theme == 'dark'){
    forcedark();
}

const sleep = ms => new Promise(res => setTimeout(res, ms));