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

    // the dict makedict returns is not important at this point
    makedict(phoneAccelerometerCSV, "PhoneAccel");
    makedict(phoneGyroscopeCSV, "PhoneGyro");
    makedict(phoneMagnetometerCSV, "PhoneMag");

    makedict(LeftWatchCSV, "LeftWatch");
    makedict(RightWatchCSV, "RightWatch");
    
    splitdata();

    updateOptimalGraph();
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
        if (!isNaN(arr[i]) && arr[i] != null){
            // point[0]/tickXincrement*10, point[1]/tickYincrement*10*2
            if (source == optimaldata){
                [coordX, coordY] = getcoord(i/tickXincrement*10, (arr[i]-tickYbasis)/tickYincrement*10*2);
                endstr += `<div class=point style="left: ${coordX}px; top: ${coordY}px;"></div>`;
            } else {
                [coordX, coordY] = getcoord(i/tickXincrement*10, (arr[i]-tickYbasis2)/tickYincrement2*10*2);
                endstr += `<div class=point style="left: ${coordX}px; top: ${coordY}px;"></div>`;
            }

        
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
      <div id="labelY${num}" class=tickLabel style="left: ${coordX-0.04*window.innerWidth}px; top: ${coordY-9.75+2}px;">${goodNumber(tworound(y*(tickYincrement2/10)/2+tickYbasis2))}</div>
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
        tickYbasis = -2;
        tickYincrement = 1;        
        label = "rad/s";
    } else if (feature == "PhoneGyroY"){
        tickYbasis = -2;
        tickYincrement = 1;
        label = "μT";
    } else if (feature == "PhoneGyroZ"){
        tickYbasis = -2;
        tickYincrement = 1;
        label = "μT";
    } else if (feature == "PhoneMagX"){
        tickYbasis = -140;
        tickYincrement = 10;
        label = "μT";
    } else if (feature == "PhoneMagY"){
        tickYbasis = -60;
        tickYincrement = 10;
        label = "μT";
    } else if (feature == "PhoneMagZ"){
        tickYbasis = -320;
        tickYincrement = 10;
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

    // DONT manually put these in, they should be automatically calculated after trimming and whatnot
    if (feature == "PhoneAccelX"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneAccelX);
        label = "m/s²";
    } else if (feature == "PhoneAccelY"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneAccelY);
        label = "m/s²";
    } else if (feature == "PhoneAccelZ"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneAccelZ);
        label = "m/s²";
    } else if (feature == "PhoneGyroX"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneGyroX);      
        label = "rad/s";
    } else if (feature == "PhoneGyroY"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneGyroY);
        label = "μT";
    } else if (feature == "PhoneGyroZ"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneGyroZ);
        label = "μT";
    } else if (feature == "PhoneMagX"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneMagX);
        label = "μT";
    } else if (feature == "PhoneMagY"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneMagY);
        label = "μT";
    } else if (feature == "PhoneMagZ"){
        [tickYbasis2, tickYincrement2] = setplotparams(sampleDict.PhoneMagZ);
        label = "μT";
    }

    plotgraph2.innerHTML = ``;
  
    let i = tickYbasis2;
    for (tick of tickYarr){
      drawTickY2(tick[0], tick[1], i, false);
      i += tickYincrement2;
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

    if (type.includes("Phone")){
        // no changes needed to this

        let i = 1;
        while (i < spltup.length){
            let line = spltup[i].split(',');
            enddict.time.push(parseInt(line[0]));
            enddict.seconds_elapsed.push(parseInt(line[1]));
            enddict.x.push(parseFloat(line[4]));
            enddict.y.push(parseFloat(line[3]));
            enddict.z.push(parseFloat(line[2]));
            i += 1;
        }

        console.log(type,enddict);


        if (type == "PhoneAccel"){
            sampleDict.PhoneTimes = enddict.time;
            sampleDict.PhoneAccelX = enddict.x;
            console.log("READINGGG", sampleDict.PhoneAccelX);
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
        } else if (type == "WatchAccel"){
            sampleDict.WatchTimess = enddict.time;
            sampleDict.WatchAccelX = enddict.x;
            sampleDict.WatchAccelY = enddict.y;
            sampleDict.WatchAccelZ = enddict.z;
        } else if (type == "WatchGyro"){
            sampleDict.WatchGyroX = enddict.x;
            sampleDict.WatchGyroY = enddict.y;
            sampleDict.WatchGyroZ = enddict.z;
        } else if (type == "WatchMag"){
            sampleDict.WatchMagX = enddict.x;
            sampleDict.WatchMagY = enddict.y;
            sampleDict.WatchMagZ = enddict.z;
        }
    } else {
        // now the new stuff
        // only for watch though, everything else should be handled

        enddict = {
            "LeftWatchTimes": [],
            "RightWatchTimes": [],

            "LeftWatchRoll": [],
            "LeftWatchPitch": [],
            "LeftWatchYaw": [],

            "LeftWatchRotX": [],
            "LeftWatchRotY": [],
            "LeftWatchRotZ": [],

            "LeftWatchGravX": [],
            "LeftWatchGravY": [],
            "LeftWatchGravZ": [],
            
            "LeftWatchDMUAccelX": [],
            "LeftWatchDMUAccelY": [],
            "LeftWatchDMUAccelZ": [],
            
            "LeftWatchQuatW": [],
            "LeftWatchQuatX": [],
            "LeftWatchQuatY": [],
            "LeftWatchQuatZ": [],

            "LeftWatchAccelX": [],
            "LeftWatchAccelY": [],
            "LeftWatchAccelZ": [],
            
            "RightWatchRoll": [],
            "RightWatchPitch": [],
            "RightWatchYaw": [],

            "RightWatchRotX": [],
            "RightWatchRotY": [],
            "RightWatchRotZ": [],

            "RightWatchGravX": [],
            "RightWatchGravY": [],
            "RightWatchGravZ": [],
            
            "RightWatchDMUAccelX": [],
            "RightWatchDMUAccelY": [],
            "RightWatchDMUAccelZ": [],
            
            "RightWatchQuatW": [],
            "RightWatchQuatX": [],
            "RightWatchQuatY": [],
            "RightWatchQuatZ": [],

            "RightWatchAccelX": [],
            "RightWatchAccelY": [],
            "RightWatchAccelZ": []
        };

        let i = 1;
        while (i < spltup.length){
            let line = spltup[i].split(',');
            enddict[type+"Times"].push(parseInt(line[2])*1000000); // multiply by 10^6 because hemiphisio is in nanoseconds

            enddict[type+"Roll"].push(parseFloat(line[11]));
            enddict[type+"Pitch"].push(parseFloat(line[12]));
            enddict[type+"Yaw"].push(parseFloat(line[13]));

            enddict[type+"RotX"].push(parseFloat(line[14]));
            enddict[type+"RotY"].push(parseFloat(line[15]));
            enddict[type+"RotZ"].push(parseFloat(line[16]));

            enddict[type+"GravX"].push(parseFloat(line[17]));
            enddict[type+"GravY"].push(parseFloat(line[18]));
            enddict[type+"GravZ"].push(parseFloat(line[19]));

            enddict[type+"DMUAccelX"].push(parseFloat(line[20]));
            enddict[type+"DMUAccelY"].push(parseFloat(line[21]));
            enddict[type+"DMUAccelZ"].push(parseFloat(line[22]));

            // enddict[type+"QuatW"].push(parseFloat(line[23]));
            // enddict[type+"QuatX"].push(parseFloat(line[24]));
            // enddict[type+"QuatY"].push(parseFloat(line[25]));
            // enddict[type+"QuatZ"].push(parseFloat(line[26]));

            // might have finally fixed this bug
            enddict[type+"QuatW"].push(parseFloat(line[25]));
            enddict[type+"QuatX"].push(parseFloat(line[23]));
            enddict[type+"QuatY"].push(parseFloat(line[24]));
            enddict[type+"QuatZ"].push(parseFloat(line[26]));

            enddict[type+"AccelX"].push(parseFloat(line[27]));
            enddict[type+"AccelY"].push(parseFloat(line[28]));
            enddict[type+"AccelZ"].push(parseFloat(line[29]));
            i += 1;
        }

        let attributes = ["Times","Roll", "Pitch", "Yaw", "RotX", "RotY", "RotZ", "GravX", "GravY", "GravZ", "DMUAccelX", "DMUAccelY", "DMUAccelZ", "QuatW", "QuatX", "QuatY", "QuatZ", "AccelX", "AccelY", "AccelZ"];

        for (attr of attributes){
            sampleDict[type+attr] = enddict[type+attr];
        }
    }

    return enddict;
}


let phoneAccelerometerCSV;
let phoneGyroscopeCSV;
let phoneMagnetometerCSV;
let LeftWatchCSV;
let RightWatchCSV;

let proceedenabled = false;

function gettp(nm){
    if (nm.includes("Accelerometer")){
        return "Accelerometer";
    } else if (nm.includes("Gyroscope")){
        return "Gyroscope";
    } else if (nm.includes("Magnetometer")){
        return "Magnetometer";
    }     
}

let i = 1;
while (i < 4){
    const j = i;
    document.getElementById('file-upload'+j).addEventListener('change', function(event) {
        if (event.target.files.length != 3 && j == 1){
            alert("You must upload three files");
        } else {

            if (j == 1){
                // this should require no change really

                const file1 = event.target.files[0];
                const file2 = event.target.files[1];
                const file3 = event.target.files[2];
        
                // check all three valid files
                if ((file1.name.includes("Accelerometer") || file1.name.includes("Gyroscope") || file1.name.includes("Magnetometer")) && 
                    (file2.name.includes("Accelerometer") || file2.name.includes("Gyroscope") || file2.name.includes("Magnetometer")) &&
                    (file3.name.includes("Accelerometer") || file3.name.includes("Gyroscope") || file3.name.includes("Magnetometer"))){
                    document.getElementById("upload"+j).innerHTML = `
                    <div class="upload-text" style="width: 50%; text-align: right; float: left;">Uploaded</div>
                    <img src="./assets/greencheck.png" alt="checkmark" style="margin-left: 5%; margin-top: 2%; width: 10%; float: left;">
                    `;
            
                    document.getElementById('file-upload'+j).disabled = true;
                    document.getElementById('upload'+j).style.cursor = "not-allowed";
                    document.getElementById('file-upload'+j).style.cursor = "not-allowed";

            
                    let tp;
            
                    const readeraccel = new FileReader();
                    readeraccel.onload = function(e) {
                        const content = e.target.result;
                        console.log(e);
                        phoneAccelerometerCSV = content;
                        console.log(content);
            
                        if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && RightWatchCSV != null && LeftWatchCSV != null){
                            enableanalysis();
                        }
                    };

                    const readergyro = new FileReader();
                    readergyro.onload = function(e) {
                        const content = e.target.result;
                        console.log(e);
                        // document.getElementById('output').innerText = content;
                        phoneGyroscopeCSV = content;
                        console.log(content);
            
                        if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && RightWatchCSV != null && LeftWatchCSV != null){
                            enableanalysis();
                        }
                    };

                    const readermag = new FileReader();
                    readermag.onload = function(e) {
                        const content = e.target.result;
                        console.log(e);
                        // document.getElementById('output').innerText = content;
                        phoneMagnetometerCSV = content;
                        console.log(content);
            
                        if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && RightWatchCSV != null && LeftWatchCSV != null){
                            enableanalysis();
                        }
                    };

                    let fls = [file1, file2, file3];
                    
                    for (fl of fls){
                        if (fl.name.includes("Accelerometer")){
                            readeraccel.readAsText(fl);
                        } else if (fl.name.includes("Gyroscope")){
                            readergyro.readAsText(fl);
                        } else if (fl.name.includes("Magnetometer")){
                            readermag.readAsText(fl);
                        }   
                    }
                }
            } else {
                // the thing with only one file
                const file1 = event.target.files[0];

                document.getElementById("upload"+j).innerHTML = `
                <div class="upload-text" style="width: 50%; text-align: right; float: left;">Uploaded</div>
                <img src="./assets/greencheck.png" alt="checkmark" style="margin-left: 5%; margin-top: 2%; width: 10%; float: left;">
                `;
        
                document.getElementById('file-upload'+j).disabled = true;
                document.getElementById('upload'+j).style.cursor = "not-allowed";
                document.getElementById('file-upload'+j).style.cursor = "not-allowed"; 

                // for now, assign all the content to one thing. we will deal with the rest later.

                const reader = new FileReader();
                    reader.onload = function(e) {
                        const content = e.target.result;
                        console.log(e);

                        if (j == 2){
                            LeftWatchCSV = content;
                        } else {
                            RightWatchCSV = content;
                        }
                    
                        console.log(content);
            
                        if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && RightWatchCSV != null && LeftWatchCSV != null){
                            enableanalysis();
                        }
                    };

                reader.readAsText(file1);
            }
        }
    });
    i += 1;
}


function clipArray(attribute, clipLen){
    sampleDict[attribute] = sampleDict[attribute].slice(clipLen);
}


function addReading(newDict, oldDict, pindex, wlindex, wrindex){
    let attributes = ["PhoneTimes", "PhoneAccelX", "PhoneAccelY", "PhoneAccelZ", "PhoneGyroX",
        "PhoneGyroY", "PhoneGyroZ", "PhoneMagX", "PhoneMagY", "PhoneMagZ", "LeftWatchTimes", 
        "LeftWatchRoll", "LeftWatchPitch", "LeftWatchYaw","LeftWatchRotX", 
        "LeftWatchRotY", "LeftWatchRotZ", "LeftWatchGravX", "LeftWatchGravY", "LeftWatchGravZ", 
        "LeftWatchDMUAccelX", "LeftWatchDMUAccelY", "LeftWatchDMUAccelZ", "LeftWatchQuatW",
        "LeftWatchQuatX", "LeftWatchQuatY", "LeftWatchQuatZ", "LeftWatchAccelX",
        "LeftWatchAccelY", "LeftWatchAccelZ", "RightWatchTimes", "RightWatchRoll", 
        "RightWatchPitch", "RightWatchYaw", "RightWatchRotX", 
        "RightWatchRotY", "RightWatchRotZ", "RightWatchGravX", "RightWatchGravY",
        "RightWatchGravZ", "RightWatchDMUAccelX", "RightWatchDMUAccelY", "RightWatchDMUAccelZ",
        "RightWatchQuatW", "RightWatchQuatX", "RightWatchQuatY", "RightWatchQuatZ",
        "RightWatchAccelX", "RightWatchAccelY", "RightWatchAccelZ"];
        
    for (const i of attributes){
        let index = "";
        if (i.includes("Phone")){
            index = pindex
        } else if (i.includes("LeftWatch")){
            index = wlindex
        } else {
            index = wrindex
        }

        
        if (newDict[i] != null){
            if (oldDict == null){
                newDict[i].push(null);
            } else {
                newDict[i].push(oldDict[i][index]);
            }
        } else {
            if (oldDict == null){
                newDict[i] = [null];
            } else {
                newDict[i] = [oldDict[i][index]];
            }
        }
    }
}


function continuouslyupwards(arr, startIndex, wantlength){
    let checked = startIndex-wantlength;
    
    let anomalies = 0;
    while (checked < startIndex){
        
        try {
            
            if (checked < 0 || checked > arr.length-1){
                return false;
            }
            if (arr[checked] > arr[checked+1]){
                anomalies += 1;
            }
    
        } catch (e) {
            return false;
        }
        
        checked += 1;
    }
    
    return anomalies <= 3;
}

function continuouslydownward(arr, startIndex, wantlength){
    let checked = startIndex;
    
    let anomalies = 0;
    while (checked < startIndex+wantlength){
        
        if (arr.length <= startIndex+wantlength){
            return false;
        }
        if (arr[checked] < arr[checked+1]){
            anomalies += 1;
        }
        
        checked += 1;
    }
    
    return anomalies <= 3;
}
    

function splitIntoParts(currentDict){
    
    //currentDict is a dict with attributes of arrays

    let strokearr = [];
    
    let splitalready = false;
    let secondsplitalready = false;
    
    let last = 0;

    let currentstroke = {};

    let i = 0;
    while (i < currentDict["PhoneAccelX"].length && i < currentDict["LeftWatchRoll"].length
          && i < currentDict["RightWatchRoll"].length){
                
        // i want to see if its increasing consistently
        if ((!splitalready) && 
            continuouslyupwards(currentDict["LeftWatchGravY"], i, 40) && last-i < 40){
            
            //print("first split out, at index", i)

            if (currentstroke != {}){
                strokearr.push(currentstroke);
                
                splitalready = true;

                currentstroke = {};
            }
        }
               
                
        // now i want to see if its decreasing consistently
        if ((splitalready) && (!secondsplitalready) &&
                continuouslydownward(currentDict["LeftWatchGravY"], i, 8) && last-i < 8){
            //print("second split out, at index", i)
            
            if (currentstroke != {}){
                strokearr.push(currentstroke);
                
                secondsplitalready = true;

                currentstroke = {};
            }
        }
    
    
        addReading(currentstroke, currentDict, i, i, i);

        i += 1;
        last = i;
    }

    if (currentstroke != {}){
        strokearr.push(currentstroke);
    }

    return strokearr;
}

function getSummaryStats(arr){
    // console.log(arr);

    var stats = new Statistics({id: 1, age: 23});

    let retarr = [
        stats.arithmeticMean(arr),
        stats.skewness(arr), 
        stats.standardDeviation(arr),
        stats.minimum(arr),
        stats.maximum(arr),
        stats.range(arr),
        stats.quartiles(arr)[0],
        stats.quartiles(arr)[1]];
    
    let k = 0;
    while (k < retarr.length){
        if (isNaN(retarr[k])){
            retarr[k] = 0;
        }
        k += 1;
    }

    let retstr = "";

    k = 0;
    while (k < retarr.length){
        retstr += retarr[k];
        if (k != retarr.length-1){
            retstr += ",";
        }
        k += 1
    }


    return retarr;
}

function convertToSummary(dct){
    let attributes = ["PhoneAccelX", "PhoneAccelY", "PhoneAccelZ", "PhoneGyroX",
                   "PhoneGyroY", "PhoneGyroZ", "PhoneMagX", "PhoneMagY", "PhoneMagZ", 
                   "LeftWatchRoll", "LeftWatchPitch", "LeftWatchYaw","LeftWatchRotX", 
                   "LeftWatchRotY", "LeftWatchRotZ", "LeftWatchGravX", "LeftWatchGravY", "LeftWatchGravZ", 
                   "LeftWatchDMUAccelX", "LeftWatchDMUAccelY", "LeftWatchDMUAccelZ", "LeftWatchQuatW",
                   "LeftWatchQuatX", "LeftWatchQuatY", "LeftWatchQuatZ", "LeftWatchAccelX",
                   "LeftWatchAccelY", "LeftWatchAccelZ", "RightWatchRoll", 
                   "RightWatchPitch", "RightWatchYaw", "RightWatchRotX", 
                   "RightWatchRotY", "RightWatchRotZ", "RightWatchGravX", "RightWatchGravY",
                   "RightWatchGravZ", "RightWatchDMUAccelX", "RightWatchDMUAccelY", "RightWatchDMUAccelZ",
                   "RightWatchQuatW", "RightWatchQuatX", "RightWatchQuatY", "RightWatchQuatZ",
                   "RightWatchAccelX", "RightWatchAccelY", "RightWatchAccelZ"];
    
    let endstr = "";

    // let totlen = 0;
    
    for (feature of attributes){
        endstr += "&"+feature+"=";
        endstr += getSummaryStats(dct[feature]);
        // totlen += 8;
    }

    // console.log("TOTLEN", totlen);

    return endstr;
}


async function splitdata(){
    // this splits sampleDict

    loadingmotion();

    analysisdisplay.innerHTML = "<h2>Splitting strokes...</h2>";


    let currentPhoneTimes = sampleDict["PhoneTimes"][0];
    let currentLeftWatchTimes = sampleDict["LeftWatchTimes"][0];
    let currentRightWatchTimes = sampleDict["RightWatchTimes"][0];
    
    let holdMetric;
    
    if (currentPhoneTimes >= currentLeftWatchTimes && currentPhoneTimes >= currentRightWatchTimes){
        holdMetric = "currentPhoneTimes";
    } else if (currentLeftWatchTimes >= currentPhoneTimes && currentLeftWatchTimes >= currentRightWatchTimes){
        holdMetric = "currentLeftWatchTimes";
    } else {
        holdMetric = "currentRightWatchTimes";
    }

    // console.log(sampleDict.PhoneAccelX);
    
    let pindex = 0;
    let wlindex = 0;
    let wrindex = 0;
    while (true){
        currentPhoneTimes = sampleDict["PhoneTimes"][pindex];
        currentLeftWatchTimes = sampleDict["LeftWatchTimes"][wlindex];
        currentRightWatchTimes = sampleDict["RightWatchTimes"][wrindex];
        
        if (holdMetric == "currentPhoneTimes"){
            if (currentLeftWatchTimes < currentPhoneTimes && currentRightWatchTimes < currentPhoneTimes){
                wlindex += 1;
                wrindex += 1;
            } else if (currentLeftWatchTimes < currentPhoneTimes){
                wlindex += 1;
            } else if (currentRightWatchTimes < currentPhoneTimes){
                wrindex += 1;
            } else {
                break
            }

        } else if (holdMetric == "currentLeftWatchTimes"){
            if (currentPhoneTimes < currentLeftWatchTimes && currentRightWatchTimes < currentLeftWatchTimes){
                pindex += 1;
                wrindex += 1;
            } else if (currentPhoneTimes < currentLeftWatchTimes) {
                pindex += 1;
            } else if (currentRightWatchTimes < currentLeftWatchTimes){
                wrindex += 1;
            } else {
                break
            }

        } else {
            if (currentPhoneTimes < currentRightWatchTimes && currentLeftWatchTimes < currentRightWatchTimes){
                pindex += 1;
                wlindex += 1;
            } else if (currentPhoneTimes < currentRightWatchTimes) {
                pindex += 1;
            } else if (currentLeftWatchTimes < currentRightWatchTimes) {
                wlindex += 1;
            } else {
                break
            }
        }
    }

    console.log("delta is", (sampleDict["PhoneTimes"][pindex]-sampleDict["LeftWatchTimes"][wlindex]*1000000)/(1000000000));
    console.log("delta is", (sampleDict["PhoneTimes"][pindex]-sampleDict["RightWatchTimes"][wrindex]*1000000)/(1000000000));


    PhoneAttributes = ["PhoneTimes", "PhoneAccelX", "PhoneAccelY", "PhoneAccelZ", "PhoneGyroX",
                       "PhoneGyroY", "PhoneGyroZ", "PhoneMagX", "PhoneMagY", "PhoneMagZ"]
                       
    LeftWatchAttributes = ["LeftWatchTimes", "LeftWatchRoll", "LeftWatchPitch", "LeftWatchYaw","LeftWatchRotX", 
                           "LeftWatchRotY", "LeftWatchRotZ", "LeftWatchGravX", "LeftWatchGravY", "LeftWatchGravZ", 
                           "LeftWatchDMUAccelX", "LeftWatchDMUAccelY", "LeftWatchDMUAccelZ", "LeftWatchQuatW",
                           "LeftWatchQuatX", "LeftWatchQuatY", "LeftWatchQuatZ", "LeftWatchAccelX",
                           "LeftWatchAccelY", "LeftWatchAccelZ"]
    RightWatchAttributes = ["RightWatchTimes", "RightWatchRoll", "RightWatchPitch", "RightWatchYaw", "RightWatchRotX", 
                            "RightWatchRotY", "RightWatchRotZ", "RightWatchGravX", "RightWatchGravY",
                            "RightWatchGravZ", "RightWatchDMUAccelX", "RightWatchDMUAccelY", "RightWatchDMUAccelZ",
                            "RightWatchQuatW", "RightWatchQuatX", "RightWatchQuatY", "RightWatchQuatZ",
                            "RightWatchAccelX", "RightWatchAccelY", "RightWatchAccelZ"]


    console.log(pindex, wlindex, wrindex);

    // YOU DONT DO THIS.
    // CLIPPING IS TAKEN CARE OF BY THE LOOP DOWN THERE (STARTING LATER in the arr)

    // for (const i of PhoneAttributes){
    //     clipArray(i, pindex);
    // }
    
    // for (const i of LeftWatchAttributes){
    //     clipArray(i, wlindex);
    // } 

    // for (const i of RightWatchAttributes){
    //     clipArray(i, wrindex);
    // }

    // console.log("SAMPLE 0.5, after alignment", sampleDict);


    // first thing: 
    // where is the last seen match? sample 0. after that something must happen
    // rewrite from there down






    let streaks = [];

    let strokearr = [];

    let currentstroke = {};

    let pstart = pindex;
    let wlstart = wlindex;
    let wrstart = wrindex;

    // console.log("Sample 0", (sampleDict["LeftWatchRoll"].length), (sampleDict["PhoneAccelX"].length));
    console.log("Sample 0 data", sampleDict);


    let i = 0;
    let last = 0;
    while (pstart < sampleDict["PhoneAccelX"].length && wlstart < sampleDict["LeftWatchRoll"].length
          && wrstart < sampleDict["RightWatchRoll"].length){
        // console.log("wlstart currently ", wlstart, "value ", sampleDict["LeftWatchQuatX"][wlstart]);
        //cut it off as a stroke
        if (continuouslyupwards(sampleDict["LeftWatchQuatX"], wlstart, 20)
            && i-last > 150){

            // console.log("CUT");


            strokearr.push(currentstroke);

            currentstroke = {}

            streaks.push(i-last); // will usually be around the threshold

            last = i;
        }

        // if (i-last < 155){
            
            addReading(currentstroke, sampleDict, pstart, wlstart, wrstart);

        // }

        i += 1;
        pstart += 1
        wlstart += 1
        wrstart += 1
    }



    console.log("SAMPLER", strokearr[0]["LeftWatchAccelX"]);
    console.log("SAMPLER1 len", strokearr[0]["LeftWatchAccelX"].length);



    analysisdisplay.innerHTML = `
    <h2 style='color: var(--main);'>Strokes found: ${strokearr.length}</h2>
    <h2>Analyzing strokes for consistency...</h2>`;


    console.log(streaks);

    // noew find out the differences
    let differences = [];
    i = 1;
    while (i < streaks.length){
        differences.push(streaks[i]-streaks[i-1]);
        i += 1
    }

    console.log(differences);


    // now i want to find the longest streak for which the absolute value of difference is less than 60
    let starts = [];
    let lns = [];

    let currentstart = 0;
    let currentlen = 0;
    i = 0;
    while (i < differences.length){
        if (differences[i] < 70 && differences[i] > -70){
            // within regulation, len goes up
            currentlen += 1;
        } else {
            // out of regulation, cut it off
            lns.push(currentlen);
            starts.push(currentstart);

            currentlen = 0;
            currentstart = i+1;
        }

        // check if thats the end
        if (i == differences.length-1){
            lns.push(currentlen);
            starts.push(currentstart);
    
            currentlen = 0;
            currentstart = i+1;
        }

        i += 1;
    }

    console.log(starts);
    console.log(lns);

    // lets look at the max length
    let mxlen = lns.reduce((a, b) => Math.max(a, b), -Infinity);
    let mxlenind = lns.indexOf(mxlen);

    let takestartindex = starts[mxlenind];
    let takelen = Math.min(mxlen, 8);

    console.log(takestartindex);
    console.log(takelen);


    // now create the data to plot
    // do it again, but this time dont push it if its not in the range


    newdict = {};

    i = 0;
    pstart = pindex;
    wlstart = wlindex;
    wrstart = wrindex;
    last = 0;
    let strokesgone = 0;

    while (pstart < sampleDict["PhoneAccelX"].length && wlstart < sampleDict["LeftWatchRoll"].length
        && wrstart < sampleDict["RightWatchRoll"].length){
        let subj = sampleDict.PhoneGyroX[i];

        if (i < sampleDict.PhoneGyroX.length-4 && subj > sampleDict.PhoneGyroX[i+1] && sampleDict.PhoneGyroX[i+1] > sampleDict.PhoneGyroX[i+2] && sampleDict.PhoneGyroX[i+3] > sampleDict.PhoneGyroX[i+4] && i-last > 100 && subj > 0.8){
            //insert spaces
            let j = 0;
            while (j < 100 && strokesgone >= takestartindex && strokesgone < takestartindex+takelen){
                
                addReading(newdict, null, pstart, wlstart, wrstart);

                j += 1;
            }

            strokesgone += 1;

            console.log(strokesgone);

            last = i;
        }

        if (strokesgone >= takestartindex && strokesgone < takestartindex+takelen){
            addReading(newdict, sampleDict, pstart, wlstart, wrstart);
        }


        i += 1;
        pstart += 1
        wlstart += 1
        wrstart += 1
    }

    sampleDict = newdict;


    // now process senddata, split into strokes and call the model for each one
    // not too hard
    // make an array of strokes
    let strokearray = [];
    // only take the ones that were approved by the automation
    console.log(starts);
    console.log(lns);

    console.log(strokearr);

    // send any set of strokes larger than 2 for evaluation




    i = 0;
    while (i < starts.length){
        if (lns[i] > 2){
            // actually do the thing

            let j = starts[i];
            while (j < starts[i]+lns[i]){
                strokearray.push(strokearr[j]);
                j += 1;
            }
        }
        // else skip over it
        i += 1;
    }

    console.log(strokearray);



    analysisdisplay.innerHTML = `
    <h2 style='color: var(--main);'>Strokes found: ${strokearr.length}</h2>
    <h2 style='color: var(--main);'>Consistent strokes found: ${strokearray.length}</h2>
    <h2>Analyzing stroke 0 of ${strokearray.length}</h2>`;

    sendData = strokearray;

    console.log("SAMPLER2 len", sendData[0]["LeftWatchAccelX"].length);
    console.log("Sampler 2 phone", sendData[0]["PhoneAccelX"])
    console.log("Sampler 2 leftwatch", sendData[0]["LeftWatchAccelX"])
    console.log("Sampler 2 rightwatch", sendData[0]["RightWatchAccelX"])

    i = 2;
    while (i < sendData.length - 2){

        let spr = splitIntoParts(strokearray[i]);

        // console.log("First spliFt PL", spr);

        if (spr.length == 3 && Object.keys(spr[0]).length != 0 && Object.keys(spr[1]).length != 0 && Object.keys(spr[2]).length != 0){
            let catchSummary = convertToSummary(spr[0]);
            let pullSummary = convertToSummary(spr[1]);
            let recoverySummary = convertToSummary(spr[2]);

            console.log("catch",catchSummary);
            console.log("pull",pullSummary);
            console.log("recovery",recoverySummary);

            await getPrediction("catch", catchSummary, strokearr, strokearray, i-2);
            await getPrediction("pull", pullSummary, strokearr, strokearray, i-2);
            await getPrediction("recovery", recoverySummary, strokearr, strokearray, i-2);


        } // else just skip over it
        

        i += 1;
    }
}

function getGoodPercentage(part){
    if (predictions[part].length != 0){
        return countgood(part)/predictions[part].length;
    } else {
        return 0;
    }
}


function displayPie(strokearr, strokearray, i){

    let adden = ``;
    if (strokearray.length-5 != i){
        adden = `<h2 style='color: var(--main);'>Analyzing stroke ${i} of ${strokearray.length-5}</h2>`;
        document.getElementById("loadinganim").style.display = "none";
        loadingmotionon = false;
    }

    analysisdisplay.innerHTML = `
    <h2 style='color: var(--main);'>Strokes found: ${strokearr.length}</h2>
    <h2 style='color: var(--main);'>Consistent strokes found: ${strokearray.length-5}</h2>

    `+adden+`
   
    <div class="piechart" style="background-image: conic-gradient(
        green ${getGoodPercentage('catch')*360}deg,
        red 0 ${(1-getGoodPercentage('catch'))*360}deg
    );">
        <h2 style='margin-top: -85px;'>Catch</h2>
        <h4 style='margin-top: 0px; color: var(--main);'>${Math.round(getGoodPercentage('catch')*100)}% Optimal</h2>
    </div>

    <div class="piechart" style="background-image: conic-gradient(
        green ${getGoodPercentage('pull')*360}deg,
        red 0 ${(1-getGoodPercentage('pull'))*360}deg
    );">
        <h2 style='margin-top: -85px;'>Pull</h2>
        <h4 style='margin-top: 0px; color: var(--main);'>${Math.round(getGoodPercentage('pull')*100)}% Optimal</h2>
    </div>

    <div class="piechart" style="background-image: conic-gradient(
        green ${getGoodPercentage('recovery')*360}deg,
        red 0 ${(1-getGoodPercentage('recovery'))*360}deg
    );">
        <h2 style='margin-top: -85px;'>Recovery</h2>
        <h4 style='margin-top: 0px; color: var(--main);'>${Math.round(getGoodPercentage('recovery')*100)}% Optimal</h2>
    </div>

    <div class="pielegend" style="padding-top: 45px;">
        <div class="key" style="background-color: green;"></div>
        <h3 style='color: green;'>Optimal strokes</h2>
    </div>
    <div class="pielegend">
        <div class="key" style="background-color: red;"></div>
        <h3 style='color: red;'>Inoptimal strokes</h2>
    </div>
    


    `;  
}


function countgood(part){
    let i = 0;
    let count = 0;
    while (i < predictions[part].length){
        if (predictions[part][i] == 0){
            count += 1;
        }
        i += 1;
    }

    return count;
}

function getStrokeToSend(num){
    let stroke = sendData[num];

    let str = "";

    // no need for times here
    let features =  ["PhoneAccelX", "PhoneAccelY", "PhoneAccelZ", "PhoneGyroX",
        "PhoneGyroY", "PhoneGyroZ", "PhoneMagX", "PhoneMagY", "PhoneMagZ", 
        "LeftWatchRoll", "LeftWatchPitch", "LeftWatchYaw","LeftWatchRotX", 
        "LeftWatchRotY", "LeftWatchRotZ", "LeftWatchGravX", "LeftWatchGravY", "LeftWatchGravZ", 
        "LeftWatchDMUAccelX", "LeftWatchDMUAccelY", "LeftWatchDMUAccelZ", "LeftWatchQuatW",
        "LeftWatchQuatX", "LeftWatchQuatY", "LeftWatchQuatZ", "LeftWatchAccelX",
        "LeftWatchAccelY", "LeftWatchAccelZ", "RightWatchRoll", 
        "RightWatchPitch", "RightWatchYaw", "RightWatchRotX", 
        "RightWatchRotY", "RightWatchRotZ", "RightWatchGravX", "RightWatchGravY",
        "RightWatchGravZ", "RightWatchDMUAccelX", "RightWatchDMUAccelY", "RightWatchDMUAccelZ",
        "RightWatchQuatW", "RightWatchQuatX", "RightWatchQuatY", "RightWatchQuatZ",
        "RightWatchAccelX", "RightWatchAccelY", "RightWatchAccelZ"];
        
    let i = 0;
    while (i < features.length){
        let carr = stroke[features[i]];
        let currentstring = "";

        if (i != 0){
            str += "&"+features[i]+"=";
        } else {
            str += features[i]+"=";
        }

        let j = 0;
        while (j < carr.length){
            currentstring += String(carr[j]); //.toFixed(2)

            if (j != carr.length-1){
                currentstring += ",";
            }

            j += 1;
        }

        str += currentstring;
        

        i += 1;
    }

    return str;
}

async function getPrediction(part, sendstr, strokearr, strokearray, i){
    // let strokedictsend = getStrokeToSend(num);
    let url = "https://predictor-vu7p.onrender.com/predict/"+part+"?"+sendstr;

    // console.log(url)

    // await fetch(url, {method: 'POST'})
    // .then(response => {
    //     return response.json();
    // })
    // .then(data => {
    //     console.log(data);
    //     console.log(parseInt(data.prediction));
    //     predictions.push(parseInt(data.prediction));
    // })

    // console.log(strokedictsend);

    fetch(url, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        console.log(parseInt(data.prediction));
        predictions[part].push(parseInt(data.prediction));
        displayPie(strokearr, strokearray, i);
    })
}

let loadingmotionon = true;

let load1 = document.getElementById("loadingpoint1");
let load2 = document.getElementById("loadingpoint2");
let load3 = document.getElementById("loadingpoint3");
let load4 = document.getElementById("loadingpoint4");
let load6 = document.getElementById("loadingpoint5");
let load5 = document.getElementById("loadingpoint6");
let load7 = document.getElementById("loadingpoint7");
let load8 = document.getElementById("loadingpoint8");

function zeroify(x){
    if (x > 0){
        return 0;
    } else {
        return x;
    }
}

// but you never want to await this, its never gonna end
async function loadingmotion(){
    loadingdegree = 0;
    while (loadingmotionon){
        load1.style.opacity = (255-Math.abs(100-loadingdegree))/255;
        load3.style.opacity = (255-Math.abs(200-loadingdegree))/255;
        load6.style.opacity = (255-Math.abs(300-loadingdegree))/255;
        load7.style.opacity = (255-Math.abs(400-loadingdegree))/255;
        load8.style.opacity = (255-Math.abs(500-loadingdegree))/255;
        load5.style.opacity = (255-Math.abs(600-loadingdegree))/255;
        load4.style.opacity = (255-Math.abs(700-loadingdegree))/255;
        load2.style.opacity = (255-Math.abs(800-loadingdegree))/255;
        loadingdegree += 3;

    
        if (loadingdegree < 300){
            load5.style.opacity = (255-Math.abs(-200-loadingdegree))/255;
            load4.style.opacity = (255-Math.abs(-100-loadingdegree))/255;
            load2.style.opacity = (255-Math.abs(0-loadingdegree))/255;
        }

        if (loadingdegree > 500){
            load1.style.opacity = (255-Math.abs(900-loadingdegree))/255;
            load3.style.opacity = (255-Math.abs(1000-loadingdegree))/255;
            load6.style.opacity = (255-Math.abs(1100-loadingdegree))/255;
        }
        // if (loadingdegree > 250){
        //     load1.style.opacity = 1-(zeroify(loadingdegree-0)/90);
        //     load3.style.opacity = 1-(zeroify(loadingdegree-45)/90);
        //     load6.style.opacity = 1-(zeroify(loadingdegree-90)/90);
        //     load7.style.opacity = 1-(zeroify(loadingdegree-135)/90); 
        // }

        if (loadingdegree > 800){
            loadingdegree = 0;
        }
        await sleep();
    }
}

async function sendToModel(){
    // first let them know how many strokes have been found

}

function setplotparams(arr){
    const min = (values) => values.reduce((m, v) => (v != null && v < m ? v : m), Infinity);
    const max = (values) => values.reduce((m, v) => (v != null && v > m ? v : m), -Infinity);

    let mx = max(arr);
    let mn = min(arr);

    let diff = mx - mn;

    return [mn,diff/4];
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

        // watch features at the indices 6 7 8

        enddict.PhoneGyroZ.push(parseFloat(line[9]));
        enddict.PhoneGyroY.push(parseFloat(line[10]));
        enddict.PhoneGyroX.push(parseFloat(line[11]));
        
        // watch features at these indices 12 13 14

        enddict.PhoneMagZ.push(parseFloat(line[15]));
        enddict.PhoneMagY.push(parseFloat(line[16]));
        enddict.PhoneMagX.push(parseFloat(line[17]));
    
        // watch features at these indices 18 19 20

        i += 1;
    }

    return enddict;
}


async function prodapi(){

    document.getElementById("prodapi").innerHTML = "Prodding...";


    fetch("https://predictor-vu7p.onrender.com/predict", {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
        body: url
    })
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        console.log(parseInt(data.prediction));
        document.getElementById("prodapi").innerHTML = "Prod API";
    })
     

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
    "PhoneTimes": [],
    "LeftWatchTimes": [],
    "RightWatchTimes": [],

    "PhoneAccelX": [],
    "PhoneAccelY": [],
    "PhoneAccelZ": [],
    "PhoneGyroX": [],
    "PhoneGyroY": [],
    "PhoneGyroZ": [],
    "PhoneMagX": [],
    "PhoneMagY": [],
    "PhoneMagZ": [],

    "LeftWatchRoll": [],
    "LeftWatchPitch": [],
    "LeftWatchYaw": [],

    "LeftWatchRotX": [],
    "LeftWatchRotY": [],
    "LeftWatchRotZ": [],

    "LeftWatchGravX": [],
    "LeftWatchGravY": [],
    "LeftWatchGravZ": [],
    
    "LeftWatchDMUAccelX": [],
    "LeftWatchDMUAccelY": [],
    "LeftWatchDMUAccelZ": [],
    
    "LeftWatchQuatW": [],
    "LeftWatchQuatX": [],
    "LeftWatchQuatY": [],
    "LeftWatchQuatZ": [],

    "LeftWatchAccelX": [],
    "LeftWatchAccelY": [],
    "LeftWatchAccelZ": [],
    
    "RightWatchRoll": [],
    "RightWatchPitch": [],
    "RightWatchYaw": [],

    "RightWatchRotX": [],
    "RightWatchRotY": [],
    "RightWatchRotZ": [],

    "RightWatchGravX": [],
    "RightWatchGravY": [],
    "RightWatchGravZ": [],
    
    "RightWatchDMUAccelX": [],
    "RightWatchDMUAccelY": [],
    "RightWatchDMUAccelZ": [],
    
    "RightWatchQuatW": [],
    "RightWatchQuatX": [],
    "RightWatchQuatY": [],
    "RightWatchQuatZ": [],

    "RightWatchAccelX": [],
    "RightWatchAccelY": [],
    "RightWatchAccelZ": []
};


let predictions = {
    "catch": [],
    "pull": [],
    "recovery": []
};
let sendData;

fetchCSV('https://concretecanoe.skparab1.com/assets/Anthony_Optimal_Split_Forweb.csv');

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