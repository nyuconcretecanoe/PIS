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

    makedict(watchAccelerometerCSV, "WatchAccel");
    makedict(watchGyroscopeCSV, "WatchGyro");
    makedict(watchMagnetometerCSV, "WatchMag");
    
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
        sampleDict.WatchTimes = enddict.time;
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

    return enddict;
}


let phoneAccelerometerCSV;
let phoneGyroscopeCSV;
let phoneMagnetometerCSV;
let watchAccelerometerCSV;
let watchGyroscopeCSV;
let watchMagnetometerCSV;

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
while (i < 3){
    const j = i;
    document.getElementById('file-upload'+j).addEventListener('change', function(event) {
        if (event.target.files.length != 3){
            alert("You must upload three files.");
        } else if (true) {

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
                    // document.getElementById('output').innerText = content;
                    if (j == 1){
                        phoneAccelerometerCSV = content;
                    } else if (j == 2){
                        watchAccelerometerCSV = content;
                    }
                    console.log(content);
        
                    if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && watchAccelerometerCSV != null && watchGyroscopeCSV != null && watchMagnetometerCSV != null){
                        enableanalysis();
                    }
                };

                const readergyro = new FileReader();
                readergyro.onload = function(e) {
                    const content = e.target.result;
                    console.log(e);
                    // document.getElementById('output').innerText = content;
                    if (j == 1){
                        phoneGyroscopeCSV = content;
                    } else if (j == 2){
                        watchGyroscopeCSV = content;
                    }
                    console.log(content);
        
                    if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && watchAccelerometerCSV != null && watchGyroscopeCSV != null && watchMagnetometerCSV != null){
                        enableanalysis();
                    }
                };

                const readermag = new FileReader();
                readermag.onload = function(e) {
                    const content = e.target.result;
                    console.log(e);
                    // document.getElementById('output').innerText = content;
                    if (j == 1){
                        phoneMagnetometerCSV = content;
                    } else if (j == 2){
                        watchMagnetometerCSV = content;
                    }
                    console.log(content);
        
                    if (phoneAccelerometerCSV != null && phoneGyroscopeCSV != null && phoneMagnetometerCSV != null && watchAccelerometerCSV != null && watchGyroscopeCSV != null && watchMagnetometerCSV != null){
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
        }
    });
    i += 1;
}


async function splitdata(){
    // this splits sampleDict

    loadingmotion();

    analysisdisplay.innerHTML = "<h2>Splitting strokes...</h2>"

    let newdict = {
        "PhoneAccelX": [],
        "PhoneAccelY": [],
        "PhoneAccelZ": [],
        "PhoneGyroX": [],
        "PhoneGyroY": [],
        "PhoneGyroZ": [],
        "PhoneMagX": [],
        "PhoneMagY": [],
        "PhoneMagZ": [],
    
        "WatchAccelX": [],
        "WatchAccelY": [],
        "WatchAccelZ": [],
        "WatchGyroX": [],
        "WatchGyroY": [],
        "WatchGyroZ": [],
        "WatchMagX": [],
        "WatchMagY": [],
        "WatchMagZ": [],
    
        "PhoneTimes": [],
        "WatchTimes": []
    };


    console.log("TELLER BEFORE:",sampleDict.PhoneAccelX);


    // one thing to take into account
    // is the phone aligned with the watch
    // if not, we need to align it

    let currentwatchtime = sampleDict.WatchTimes[0];
    let currentphonetime = sampleDict.PhoneTimes[0];
    let pushmetric;

    if (currentwatchtime < currentphonetime){
        // watch started early, lets push it
        pushmetric = "watch";
    } else {
        // phone started early, lets push it
        pushmetric = "phone";
    }

    // keep pushing it until the opposite is true
    let windex = 0;
    let pindex = 0;
    while (true){
        // alert("pushing", currentwatchtime-currentphonetime,pushmetric);
        // console.log("pushing", currentwatchtime,currentphonetime, currentwatchtime-currentphonetime,pushmetric);
        currentwatchtime = sampleDict.WatchTimes[windex];
        currentphonetime = sampleDict.PhoneTimes[pindex];

        if (currentwatchtime > currentphonetime && pushmetric == "watch"){
            // we can break now
            break;
        }

        if (currentwatchtime < currentphonetime && pushmetric == "phone"){
            // we can break now
            break;
        }

        if (pushmetric == "watch"){
            windex += 1;
        } else {
            pindex += 1;
        }
    }

    console.log("use indices ", windex, pindex, "with times", sampleDict.WatchTimes[windex], sampleDict.PhoneTimes[pindex]);
    // notify of the delta. raise error if its too much

    console.log("delta is", (sampleDict.WatchTimes[windex]-sampleDict.PhoneTimes[pindex])/(1000000000));

    if (windex != 0){
        // slice index
        // slice all of the watch attributes of sample dict, keep windex and beyond
        sampleDict.WatchTimes = sampleDict.WatchTimes.slice(windex);
        sampleDict.WatchAccelX = sampleDict.WatchAccelX.slice(windex);
        sampleDict.WatchAccelY = sampleDict.WatchAccelY.slice(windex);
        sampleDict.WatchAccelZ = sampleDict.WatchAccelZ.slice(windex);
        sampleDict.WatchGyroX = sampleDict.WatchGyroX.slice(windex);
        sampleDict.WatchGyroY = sampleDict.WatchGyroY.slice(windex);
        sampleDict.WatchMagZ = sampleDict.WatchMagZ.slice(windex);
        sampleDict.WatchMagY = sampleDict.WatchMagY.slice(windex);
        sampleDict.WatchMagZ = sampleDict.WatchMagZ.slice(windex);
    } else {
        // the same thing but for phone attributes
        sampleDict.PhoneTimes = sampleDict.PhoneTimes.slice(pindex);
        sampleDict.PhoneAccelX = sampleDict.PhoneAccelX.slice(pindex);
        sampleDict.PhoneAccelY = sampleDict.PhoneAccelY.slice(pindex);
        sampleDict.PhoneAccelZ = sampleDict.PhoneAccelZ.slice(pindex);
        sampleDict.PhoneGyroX = sampleDict.PhoneGyroX.slice(pindex);
        sampleDict.PhoneGyroY = sampleDict.PhoneGyroY.slice(pindex);
        sampleDict.PhoneMagZ = sampleDict.PhoneMagZ.slice(pindex);
        sampleDict.PhoneMagY = sampleDict.PhoneMagY.slice(pindex);
        sampleDict.PhoneMagZ = sampleDict.PhoneMagZ.slice(pindex);
    }


    console.log("TELLER:",sampleDict.PhoneAccelX);

    

    // lengths of strokes
    let streaks = [];


    let strokearr = [];

    let currentstroke = {
        "PhoneAccelX": [],
        "PhoneAccelY": [],
        "PhoneAccelZ": [],
        "PhoneGyroX": [],
        "PhoneGyroY": [],
        "PhoneGyroZ": [],
        "PhoneMagX": [],
        "PhoneMagY": [],
        "PhoneMagZ": [],
    
        "WatchAccelX": [],
        "WatchAccelY": [],
        "WatchAccelZ": [],
        "WatchGyroX": [],
        "WatchGyroY": [],
        "WatchGyroZ": [],
        "WatchMagX": [],
        "WatchMagY": [],
        "WatchMagZ": [],
    
        "PhoneTimes": [],
        "WatchTimes": []
    };


    let i = 0;
    let last = 0;
    while (i < sampleDict.PhoneAccelX.length){
        let subj = sampleDict.PhoneGyroX[i];

        // i think this is way more surefire now

        if (i < sampleDict.PhoneGyroX.length-4 && subj > sampleDict.PhoneGyroX[i+1] && sampleDict.PhoneGyroX[i+1] > sampleDict.PhoneGyroX[i+2] && sampleDict.PhoneGyroX[i+3] > sampleDict.PhoneGyroX[i+4] && i-last > 100 && subj > 0.8){
            //insert spaces
            let j = 0;
            while (j < 100){

                newdict.PhoneTimes.push(null);
                newdict.WatchTimes.push(null);

                newdict.PhoneAccelX.push(null);
                newdict.PhoneAccelY.push(null);
                newdict.PhoneAccelZ.push(null);
                newdict.PhoneGyroX.push(null);
                newdict.PhoneGyroY.push(null);
                newdict.PhoneGyroZ.push(null);
                newdict.PhoneMagX.push(null);
                newdict.PhoneMagY.push(null);
                newdict.PhoneMagZ.push(null);

                newdict.WatchAccelX.push(null);
                newdict.WatchAccelY.push(null);
                newdict.WatchAccelZ.push(null);
                newdict.WatchGyroX.push(null);
                newdict.WatchGyroY.push(null);
                newdict.WatchGyroZ.push(null);
                newdict.WatchMagX.push(null);
                newdict.WatchMagY.push(null);
                newdict.WatchMagZ.push(null);
                j += 1;
            }

            strokearr.push(currentstroke);
                 
            currentstroke = {
                "PhoneAccelX": [],
                "PhoneAccelY": [],
                "PhoneAccelZ": [],
                "PhoneGyroX": [],
                "PhoneGyroY": [],
                "PhoneGyroZ": [],
                "PhoneMagX": [],
                "PhoneMagY": [],
                "PhoneMagZ": [],
            
                "WatchAccelX": [],
                "WatchAccelY": [],
                "WatchAccelZ": [],
                "WatchGyroX": [],
                "WatchGyroY": [],
                "WatchGyroZ": [],
                "WatchMagX": [],
                "WatchMagY": [],
                "WatchMagZ": [],
            
                "PhoneTimes": [],
                "WatchTimes": []
            };

            streaks.push(i-last); // will usually be around the threshold

            last = i;
        }



        newdict.PhoneTimes.push(sampleDict.PhoneTimes[i]);
        newdict.WatchTimes.push(sampleDict.WatchTimes[i]);

        newdict.PhoneAccelX.push(sampleDict.PhoneAccelX[i]);
        newdict.PhoneAccelY.push(sampleDict.PhoneAccelY[i]);
        newdict.PhoneAccelZ.push(sampleDict.PhoneAccelZ[i]);
        newdict.PhoneGyroX.push(sampleDict.PhoneGyroX[i]);
        newdict.PhoneGyroY.push(sampleDict.PhoneGyroY[i]);
        newdict.PhoneGyroZ.push(sampleDict.PhoneGyroZ[i]);
        newdict.PhoneMagX.push(sampleDict.PhoneMagX[i]);
        newdict.PhoneMagY.push(sampleDict.PhoneMagY[i]);
        newdict.PhoneMagZ.push(sampleDict.PhoneMagZ[i]);

        newdict.WatchAccelX.push(sampleDict.WatchAccelX[i]);
        newdict.WatchAccelY.push(sampleDict.WatchAccelY[i]);
        newdict.WatchAccelZ.push(sampleDict.WatchAccelZ[i]);
        newdict.WatchGyroX.push(sampleDict.WatchGyroX[i]);
        newdict.WatchGyroY.push(sampleDict.WatchGyroY[i]);
        newdict.WatchGyroZ.push(sampleDict.WatchGyroZ[i]);
        newdict.WatchMagX.push(sampleDict.WatchMagX[i]);
        newdict.WatchMagY.push(sampleDict.WatchMagY[i]);
        newdict.WatchMagZ.push(sampleDict.WatchMagZ[i]);

        currentstroke.PhoneTimes.push(sampleDict.PhoneTimes[i]);
        currentstroke.WatchTimes.push(sampleDict.WatchTimes[i]);

        currentstroke.PhoneAccelX.push(sampleDict.PhoneAccelX[i]);
        currentstroke.PhoneAccelY.push(sampleDict.PhoneAccelY[i]);
        currentstroke.PhoneAccelZ.push(sampleDict.PhoneAccelZ[i]);
        currentstroke.PhoneGyroX.push(sampleDict.PhoneGyroX[i]);
        currentstroke.PhoneGyroY.push(sampleDict.PhoneGyroY[i]);
        currentstroke.PhoneGyroZ.push(sampleDict.PhoneGyroZ[i]);
        currentstroke.PhoneMagX.push(sampleDict.PhoneMagX[i]);
        currentstroke.PhoneMagY.push(sampleDict.PhoneMagY[i]);
        currentstroke.PhoneMagZ.push(sampleDict.PhoneMagZ[i]);

        currentstroke.WatchAccelX.push(sampleDict.WatchAccelX[i]);
        currentstroke.WatchAccelY.push(sampleDict.WatchAccelY[i]);
        currentstroke.WatchAccelZ.push(sampleDict.WatchAccelZ[i]);
        currentstroke.WatchGyroX.push(sampleDict.WatchGyroX[i]);
        currentstroke.WatchGyroY.push(sampleDict.WatchGyroY[i]);
        currentstroke.WatchGyroZ.push(sampleDict.WatchGyroZ[i]);
        currentstroke.WatchMagX.push(sampleDict.WatchMagX[i]);
        currentstroke.WatchMagY.push(sampleDict.WatchMagY[i]);
        currentstroke.WatchMagZ.push(sampleDict.WatchMagZ[i]);

        i += 1;
    }

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

    sendData = newdict;


    newdict = {
        "PhoneAccelX": [],
        "PhoneAccelY": [],
        "PhoneAccelZ": [],
        "PhoneGyroX": [],
        "PhoneGyroY": [],
        "PhoneGyroZ": [],
        "PhoneMagX": [],
        "PhoneMagY": [],
        "PhoneMagZ": [],
    
        "WatchAccelX": [],
        "WatchAccelY": [],
        "WatchAccelZ": [],
        "WatchGyroX": [],
        "WatchGyroY": [],
        "WatchGyroZ": [],
        "WatchMagX": [],
        "WatchMagY": [],
        "WatchMagZ": [],
    
        "PhoneTimes": [],
        "WatchTimes": [],
    };

    i = 0;
    last = 0;
    let strokesgone = 0;

    while (i < sampleDict.PhoneAccelX.length && i < sampleDict.WatchAccelX.length){
        let subj = sampleDict.PhoneGyroX[i];

        if (i < sampleDict.PhoneGyroX.length-4 && subj > sampleDict.PhoneGyroX[i+1] && sampleDict.PhoneGyroX[i+1] > sampleDict.PhoneGyroX[i+2] && sampleDict.PhoneGyroX[i+3] > sampleDict.PhoneGyroX[i+4] && i-last > 100 && subj > 0.8){
            //insert spaces
            let j = 0;
            while (j < 100 && strokesgone >= takestartindex && strokesgone < takestartindex+takelen){
                newdict.PhoneTimes.push(null);
                newdict.WatchTimes.push(null);

                newdict.PhoneAccelX.push(null);
                newdict.PhoneAccelY.push(null);
                newdict.PhoneAccelZ.push(null);
                newdict.PhoneGyroX.push(null);
                newdict.PhoneGyroY.push(null);
                newdict.PhoneGyroZ.push(null);
                newdict.PhoneMagX.push(null);
                newdict.PhoneMagY.push(null);
                newdict.PhoneMagZ.push(null);

                newdict.WatchAccelX.push(null);
                newdict.WatchAccelY.push(null);
                newdict.WatchAccelZ.push(null);
                newdict.WatchGyroX.push(null);
                newdict.WatchGyroY.push(null);
                newdict.WatchGyroZ.push(null);
                newdict.WatchMagX.push(null);
                newdict.WatchMagY.push(null);
                newdict.WatchMagZ.push(null);
                j += 1;
            }

            strokesgone += 1;

            console.log(strokesgone);

            last = i;
        }

        if (strokesgone >= takestartindex && strokesgone < takestartindex+takelen){
            newdict.PhoneTimes.push(sampleDict.PhoneTimes[i]);
            newdict.WatchTimes.push(sampleDict.WatchTimes[i]);
    
            newdict.PhoneAccelX.push(sampleDict.PhoneAccelX[i]);
            newdict.PhoneAccelY.push(sampleDict.PhoneAccelY[i]);
            newdict.PhoneAccelZ.push(sampleDict.PhoneAccelZ[i]);
            newdict.PhoneGyroX.push(sampleDict.PhoneGyroX[i]);
            newdict.PhoneGyroY.push(sampleDict.PhoneGyroY[i]);
            newdict.PhoneGyroZ.push(sampleDict.PhoneGyroZ[i]);
            newdict.PhoneMagX.push(sampleDict.PhoneMagX[i]);
            newdict.PhoneMagY.push(sampleDict.PhoneMagY[i]);
            newdict.PhoneMagZ.push(sampleDict.PhoneMagZ[i]);
    
            newdict.WatchAccelX.push(sampleDict.WatchAccelX[i]);
            newdict.WatchAccelY.push(sampleDict.WatchAccelY[i]);
            newdict.WatchAccelZ.push(sampleDict.WatchAccelZ[i]);
            newdict.WatchGyroX.push(sampleDict.WatchGyroX[i]);
            newdict.WatchGyroY.push(sampleDict.WatchGyroY[i]);
            newdict.WatchGyroZ.push(sampleDict.WatchGyroZ[i]);
            newdict.WatchMagX.push(sampleDict.WatchMagX[i]);
            newdict.WatchMagY.push(sampleDict.WatchMagY[i]);
            newdict.WatchMagZ.push(sampleDict.WatchMagZ[i]);
        }


        i += 1;
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
                if (strokearr[j].PhoneAccelX.length >= 155){
                    strokearray.push(strokearr[j]);
                }
                j += 1;
            }
        }
        // else skip over it
        i += 1;
    }


    analysisdisplay.innerHTML = `
    <h2 style='color: var(--main);'>Strokes found: ${strokearr.length}</h2>
    <h2 style='color: var(--main);'>Consistent strokes found: ${strokearray.length}</h2>
    <h2>Analyzing stroke 0 of ${strokearray.length}</h2>`;

    sendData = strokearray;

    i = 0;
    while (i < sendData.length){
        
        await getPrediction(i);

        let good = countgood();

        analysisdisplay.innerHTML = `
        <h2 style='color: var(--main);'>Strokes found: ${strokearr.length}</h2>
        <h2 style='color: var(--main);'>Consistent strokes found: ${strokearray.length}</h2>

        <h2>Analyzing stroke ${i} of ${strokearray.length}</h2>
        <div class="piechart" style="background-image: conic-gradient(
            green ${good/predictions.length*360}deg,
            red 0 ${(1-good/predictions.length)*360}deg
        );"></div>
        <div class="pielegend">
            <div class="key" style="background-color: green;"></div>
            <h3 style='color: green;'>Optimal strokes (${good})</h2>
        </div>
        <div class="pielegend">
            <div class="key" style="background-color: red;"></div>
            <h3 style='color: red;'>Inoptimal strokes (${predictions.length-good})</h2>
        </div>
        `;   

        i += 1;
    }

    loadingmotionon = false;

    let good = countgood();

    analysisdisplay.innerHTML = `
        <h2 style='color: var(--main);'>Strokes found: ${strokearr.length}</h2>
        <h2 style='color: var(--main);'>Consistent strokes found: ${strokearray.length}</h2>

        <h2 style='color: var(--main);'>Optimal stroke percentage: ${100*good/predictions.length}%</h2>
        <div class="piechart" style="background-image: conic-gradient(
            green ${good/predictions.length*360}deg,
            red 0 ${(1-good/predictions.length)*360}deg
        );"></div>
        <div class="pielegend">
            <div class="key" style="background-color: green;"></div>
            <h3 style='color: green;'>Optimal strokes (${good})</h2>
        </div>
        <div class="pielegend">
            <div class="key" style="background-color: red;"></div>
            <h3 style='color: red;'>Inoptimal strokes (${predictions.length-good})</h2>
        </div>
        `;   

    document.getElementById("loadinganim").style.display = "none";

}

function countgood(){
    let i = 0;
    let count = 0;
    while (i < predictions.length){
        if (predictions[i] == 0){
            count += 1;
        }
        i += 1;
    }

    return count;
}

function getStrokeToSend(num){
    let stroke = sendData[num];

    let str = "";

    let features = ["PhoneAccelX","PhoneAccelY","PhoneAccelZ","PhoneGyroX","PhoneGyroY","PhoneGyroZ","PhoneMagX","PhoneMagY","PhoneMagZ","WatchAccelX","WatchAccelY","WatchAccelZ","WatchGyroX","WatchGyroY","WatchGyroZ","WatchMagX","WatchMagY","WatchMagZ"];

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
            currentstring += String(carr[j].toFixed(2));

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

async function getPrediction(num){
    let strokestr = getStrokeToSend(num);

    let url = "https://predictor-vu7p.onrender.com/predict?"+strokestr;

    console.log(url)

    await fetch((url))
    .then(response => {
        return response.json();
    })
    .then(data => {
        console.log(data);
        console.log(parseInt(data.prediction));
        predictions.push(parseInt(data.prediction));
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
    let url = "https://predictor-vu7p.onrender.com/predict?PhoneAccelX=-0.37,-0.31,-0.24,-0.18,-0.16,-0.12,-0.08,-0.04,0.01,0.07,0.16,0.25,0.40,0.57,0.73,0.84,0.84,0.82,0.77,0.77,0.79,0.79,0.76,0.68,0.58,0.47,0.39,0.37,0.40,0.46,0.50,0.53,0.55,0.57,0.58,0.59,0.63,0.68,0.72,0.71,0.70,0.68,0.63,0.56,0.52,0.51,0.50,0.49,0.52,0.58,0.62,0.61,0.57,0.49,0.41,0.40,0.47,0.58,0.68,0.72,0.69,0.61,0.61,0.62,0.61,0.69,0.77,0.82,0.82,0.77,0.67,0.61,0.65,0.74,0.82,0.85,0.85,0.80,0.75,0.75,0.81,0.85,0.85,0.81,0.78,0.78,0.79,0.82,0.84,0.82,0.78,0.74,0.70,0.66,0.61,0.59,0.60,0.62,0.65,0.68,0.72,0.78,0.84,0.88,0.89,0.89,0.87,0.87,0.90,0.95,1.00,1.03,1.02,0.97,0.92,0.92,0.94,0.99,1.02,1.01,0.97,0.92,0.84,0.75,0.67,0.62,0.59,0.59,0.60,0.62,0.63,0.65,0.63,0.60,0.58,0.55,0.49,0.44,0.43,0.42,0.43,0.45,0.46,0.48,0.52,0.56,0.60,0.65,0.70,0.76,0.81,0.88,0.95,1.02,1.07,1.11,1.17,1.22,1.27,1.33,1.39,1.45,1.49,1.44,1.36,1.26,1.14,1.01,0.90,0.82,0.74,0.66,0.58,0.50,0.43,0.37,0.27,0.17,0.08,-0.00,-0.10,-0.22,-0.30,-0.31,-0.30&PhoneAccelY=0.11,0.14,0.13,0.05,-0.07,-0.17,-0.28,-0.40,-0.48,-0.49,-0.46,-0.43,-0.44,-0.46,-0.41,-0.30,-0.25,-0.26,-0.34,-0.44,-0.49,-0.51,-0.52,-0.49,-0.44,-0.42,-0.40,-0.36,-0.35,-0.34,-0.34,-0.30,-0.26,-0.25,-0.26,-0.27,-0.26,-0.23,-0.21,-0.23,-0.25,-0.25,-0.23,-0.20,-0.19,-0.21,-0.24,-0.24,-0.20,-0.17,-0.15,-0.14,-0.14,-0.15,-0.18,-0.21,-0.22,-0.21,-0.20,-0.19,-0.20,-0.23,-0.26,-0.27,-0.26,-0.27,-0.30,-0.33,-0.33,-0.30,-0.29,-0.31,-0.35,-0.38,-0.42,-0.46,-0.51,-0.57,-0.59,-0.57,-0.51,-0.48,-0.48,-0.53,-0.58,-0.60,-0.59,-0.60,-0.61,-0.62,-0.63,-0.65,-0.68,-0.70,-0.71,-0.70,-0.69,-0.68,-0.69,-0.71,-0.73,-0.74,-0.76,-0.77,-0.77,-0.77,-0.77,-0.79,-0.80,-0.79,-0.72,-0.65,-0.63,-0.64,-0.66,-0.67,-0.67,-0.67,-0.69,-0.75,-0.81,-0.85,-0.84,-0.81,-0.81,-0.83,-0.84,-0.83,-0.80,-0.74,-0.69,-0.67,-0.69,-0.75,-0.83,-0.91,-0.95,-0.93,-0.91,-0.89,-0.87,-0.83,-0.79,-0.76,-0.72,-0.69,-0.65,-0.60,-0.53,-0.45,-0.37,-0.28,-0.18,-0.08,0.02,0.12,0.21,0.29,0.35,0.42,0.48,0.53,0.55,0.52,0.44,0.36,0.31,0.27,0.22,0.18,0.14,0.09,0.02,-0.07,-0.17,-0.25,-0.29,-0.28,-0.24,-0.18,-0.16,-0.17,-0.17,-0.15,-0.16&PhoneAccelZ=-0.16,-0.33,-0.46,-0.57,-0.67,-0.77,-0.86,-0.94,-0.97,-1.00,-1.05,-1.11,-1.09,-1.12,-1.17,-1.21,-1.23,-1.17,-1.17,-1.17,-1.16,-1.17,-1.19,-1.23,-1.20,-1.13,-1.06,-1.00,-0.96,-0.91,-0.87,-0.83,-0.81,-0.79,-0.79,-0.87,-0.96,-1.00,-0.99,-0.96,-0.92,-0.85,-0.79,-0.76,-0.73,-0.70,-0.70,-0.72,-0.75,-0.76,-0.77,-0.75,-0.67,-0.60,-0.59,-0.64,-0.68,-0.67,-0.62,-0.56,-0.54,-0.61,-0.60,-0.65,-0.70,-0.66,-0.66,-0.66,-0.61,-0.55,-0.55,-0.55,-0.53,-0.49,-0.47,-0.47,-0.49,-0.53,-0.58,-0.60,-0.58,-0.53,-0.49,-0.49,-0.50,-0.51,-0.49,-0.46,-0.43,-0.40,-0.38,-0.37,-0.37,-0.36,-0.35,-0.37,-0.38,-0.37,-0.36,-0.37,-0.34,-0.31,-0.29,-0.30,-0.32,-0.33,-0.37,-0.43,-0.47,-0.50,-0.49,-0.47,-0.42,-0.36,-0.31,-0.29,-0.29,-0.31,-0.35,-0.39,-0.44,-0.46,-0.45,-0.43,-0.43,-0.45,-0.46,-0.47,-0.49,-0.51,-0.55,-0.60,-0.68,-0.75,-0.78,-0.80,-0.83,-0.84,-0.83,-0.79,-0.72,-0.64,-0.56,-0.50,-0.47,-0.44,-0.40,-0.36,-0.32,-0.28,-0.23,-0.19,-0.17,-0.16,-0.14,-0.14,-0.13,-0.14,-0.16,-0.15,-0.16,-0.13,-0.11,-0.16,-0.19,-0.14,-0.10,-0.12,-0.19,-0.26,-0.32,-0.36,-0.38,-0.40,-0.41,-0.41,-0.45,-0.50,-0.49,-0.45,-0.40,-0.40,-0.45,-0.50,-0.52&PhoneGyroX=2.62,2.58,2.57,2.58,2.58,2.54,2.44,2.30,2.12,1.92,1.78,1.70,1.59,1.43,1.32,1.26,1.17,1.04,0.88,0.75,0.67,0.64,0.62,0.56,0.50,0.42,0.31,0.23,0.19,0.16,0.14,0.16,0.20,0.24,0.25,0.23,0.19,0.15,0.12,0.11,0.10,0.08,0.06,0.08,0.11,0.14,0.15,0.15,0.16,0.18,0.22,0.28,0.36,0.41,0.43,0.41,0.40,0.41,0.46,0.54,0.61,0.65,0.66,0.65,0.69,0.69,0.71,0.74,0.75,0.75,0.76,0.79,0.79,0.80,0.84,0.88,0.88,0.83,0.78,0.75,0.75,0.74,0.71,0.64,0.56,0.50,0.48,0.47,0.44,0.41,0.41,0.42,0.42,0.37,0.31,0.26,0.19,0.12,0.06,0.01,-0.02,-0.03,-0.06,-0.11,-0.21,-0.30,-0.38,-0.47,-0.59,-0.71,-0.83,-0.95,-1.08,-1.20,-1.28,-1.31,-1.31,-1.32,-1.35,-1.43,-1.53,-1.60,-1.63,-1.65,-1.67,-1.71,-1.78,-1.89,-2.02,-2.15,-2.29,-2.41,-2.53,-2.63,-2.75,-2.86,-2.94,-3.01,-3.07,-3.14,-3.21,-3.26,-3.30,-3.35,-3.40,-3.43,-3.45,-3.44,-3.40,-3.30,-3.17,-3.03,-2.88,-2.69,-2.47,-2.22,-1.97,-1.73,-1.47,-1.21,-0.92,-0.58,-0.30,-0.07,0.15,0.34,0.49,0.60,0.69,0.78,0.88,1.02,1.19,1.38,1.56,1.65,1.69,1.73,1.77,1.85,1.88,1.83,1.77,1.70,1.72&PhoneGyroY=0.16,0.46,0.67,0.82,0.96,1.03,1.05,1.09,1.25,1.44,1.61,1.78,1.85,1.76,1.49,1.11,0.84,0.71,0.65,0.63,0.53,0.32,0.04,-0.18,-0.27,-0.22,-0.08,0.08,0.21,0.31,0.42,0.52,0.63,0.74,0.79,0.77,0.69,0.60,0.51,0.46,0.47,0.48,0.49,0.48,0.47,0.48,0.56,0.70,0.78,0.73,0.58,0.42,0.36,0.44,0.61,0.82,1.01,1.15,1.21,1.23,1.12,1.06,0.99,0.84,0.82,0.84,0.82,0.80,0.86,0.90,0.92,0.95,0.96,0.95,0.98,1.05,1.11,1.11,1.06,0.97,0.86,0.82,0.85,0.94,1.03,1.06,1.06,1.00,0.93,0.85,0.81,0.77,0.74,0.72,0.73,0.77,0.89,1.04,1.20,1.34,1.44,1.44,1.35,1.23,1.15,1.09,1.02,0.96,0.92,0.85,0.73,0.61,0.52,0.46,0.38,0.23,0.04,-0.21,-0.50,-0.78,-0.99,-1.10,-1.10,-1.01,-0.88,-0.73,-0.59,-0.48,-0.36,-0.22,-0.09,0.01,0.02,-0.06,-0.20,-0.37,-0.52,-0.60,-0.67,-0.72,-0.70,-0.58,-0.40,-0.19,0.05,0.26,0.43,0.57,0.69,0.78,0.84,0.88,0.89,0.87,0.85,0.83,0.78,0.67,0.50,0.22,-0.06,-0.44,-1.04,-1.60,-1.91,-2.04,-2.14,-2.16,-2.09,-2.01,-1.98,-2.03,-2.17,-2.36,-2.49,-2.57,-2.57,-2.49,-2.30,-2.03,-1.65,-1.19,-0.77,-0.41,-0.07&PhoneGyroZ=-2.12,-1.85,-1.61,-1.40,-1.19,-0.97,-0.74,-0.54,-0.37,-0.29,-0.29,-0.34,-0.38,-0.35,-0.30,-0.25,-0.25,-0.29,-0.36,-0.44,-0.45,-0.40,-0.33,-0.28,-0.22,-0.13,-0.05,0.02,0.07,0.13,0.18,0.22,0.24,0.27,0.31,0.32,0.29,0.22,0.16,0.11,0.09,0.11,0.15,0.17,0.16,0.17,0.19,0.22,0.25,0.29,0.31,0.31,0.32,0.36,0.39,0.40,0.38,0.32,0.26,0.23,0.27,0.35,0.45,0.56,0.61,0.58,0.46,0.32,0.24,0.28,0.38,0.46,0.48,0.43,0.36,0.33,0.38,0.49,0.60,0.64,0.61,0.57,0.57,0.61,0.66,0.69,0.69,0.66,0.64,0.66,0.72,0.80,0.89,0.96,0.98,0.96,0.95,0.96,1.00,1.05,1.07,1.05,1.00,0.98,0.99,1.02,1.06,1.09,1.08,1.00,0.87,0.73,0.67,0.65,0.65,0.62,0.55,0.43,0.30,0.18,0.05,-0.04,-0.05,0.03,0.15,0.25,0.28,0.24,0.21,0.21,0.22,0.26,0.34,0.42,0.50,0.63,0.77,0.85,0.88,0.89,0.90,0.91,0.91,0.89,0.86,0.82,0.79,0.75,0.67,0.53,0.34,0.12,-0.13,-0.36,-0.58,-0.81,-1.02,-1.19,-1.33,-1.46,-1.62,-1.77,-1.98,-2.29,-2.59,-2.78,-2.90,-3.05,-3.21,-3.32,-3.36,-3.33,-3.27,-3.22,-3.17,-3.08,-2.99,-2.89,-2.83,-2.82,-2.78,-2.70,-2.64,-2.58,-2.50&PhoneMagX=-85.55,-85.76,-85.78,-85.55,-85.87,-85.56,-86.14,-86.17,-86.31,-86.90,-86.95,-87.02,-86.71,-86.87,-87.37,-87.30,-86.91,-87.88,-87.49,-87.34,-87.56,-87.53,-87.31,-87.33,-87.03,-87.06,-87.13,-87.68,-87.36,-87.91,-88.43,-88.73,-88.58,-89.23,-89.51,-89.78,-89.90,-90.49,-90.65,-91.09,-90.60,-90.97,-90.88,-91.36,-91.80,-92.07,-92.72,-93.63,-94.38,-95.48,-96.07,-96.54,-96.78,-96.92,-96.30,-95.96,-95.18,-94.56,-93.78,-92.85,-92.44,-91.71,-91.28,-90.83,-90.54,-89.72,-89.54,-88.78,-88.19,-87.70,-87.22,-86.65,-85.79,-85.41,-84.94,-84.84,-85.23,-85.34,-86.19,-86.61,-87.57,-88.45,-89.47,-90.46,-91.62,-92.79,-94.63,-95.79,-96.53,-97.76,-98.59,-99.32,-99.87,-100.56,-100.42,-100.59,-100.32,-100.08,-99.54,-99.48,-98.61,-98.31,-97.90,-97.09,-96.54,-95.87,-95.66,-94.69,-94.08,-93.38,-92.79,-92.32,-91.79,-91.56,-91.20,-90.81,-90.48,-90.38,-90.60,-90.61,-90.13,-90.55,-91.01,-90.63,-90.60,-90.50,-90.22,-90.16,-89.86,-89.78,-89.76,-89.38,-89.58,-89.14,-89.31,-88.82,-88.86,-88.51,-88.59,-88.51,-87.96,-88.02,-87.76,-87.70,-87.18,-87.38,-87.12,-87.37,-87.03,-86.70,-86.93,-86.54,-86.06,-86.18,-86.05,-85.41,-85.27,-84.88,-84.71,-84.58,-84.94,-84.42,-84.57,-84.34,-84.26,-83.65,-83.69,-83.60,-83.99,-83.51,-83.29,-83.43,-82.67,-82.91,-82.78,-83.00,-82.78,-82.38,-82.49,-82.61,-82.80,-82.53,-82.32,-82.70,-82.50&PhoneMagY=-110.64,-110.81,-111.03,-110.75,-111.21,-112.01,-112.04,-112.02,-112.45,-112.40,-112.79,-113.27,-112.97,-113.18,-113.48,-113.87,-114.18,-114.12,-114.38,-114.76,-114.83,-114.71,-114.87,-115.02,-114.63,-115.10,-115.28,-115.22,-114.87,-115.06,-114.85,-114.79,-114.84,-114.37,-114.39,-114.07,-113.56,-113.49,-112.74,-112.37,-111.82,-111.24,-110.51,-109.95,-109.59,-108.62,-107.98,-107.31,-106.38,-105.70,-105.03,-103.74,-102.87,-101.69,-100.93,-99.60,-98.40,-96.97,-95.50,-94.21,-92.89,-91.85,-90.41,-89.29,-88.45,-87.00,-86.11,-85.27,-84.30,-83.10,-82.04,-81.35,-80.92,-79.68,-79.04,-78.27,-77.86,-77.20,-76.83,-76.49,-76.28,-76.37,-76.57,-76.71,-77.12,-77.39,-77.67,-78.04,-78.52,-78.99,-79.87,-80.54,-81.71,-82.84,-83.84,-85.06,-86.21,-87.51,-88.49,-90.01,-90.88,-91.59,-92.78,-93.84,-94.69,-95.43,-96.11,-96.92,-97.71,-97.75,-98.66,-99.38,-99.50,-99.54,-100.05,-100.41,-100.74,-100.97,-100.97,-101.16,-101.52,-101.74,-101.84,-101.98,-101.93,-102.06,-101.85,-101.80,-102.00,-102.03,-102.53,-102.45,-102.57,-102.63,-102.72,-102.92,-103.07,-102.99,-102.97,-103.19,-103.29,-103.38,-103.61,-103.33,-103.20,-103.33,-103.29,-103.67,-103.84,-103.98,-104.62,-104.25,-104.76,-104.99,-105.03,-104.88,-105.26,-105.82,-106.05,-106.27,-106.80,-106.98,-107.26,-107.16,-108.02,-107.97,-108.31,-108.54,-108.77,-108.95,-109.02,-109.61,-110.09,-110.22,-110.69,-110.82,-111.43,-111.43,-111.74,-111.88,-111.98,-112.39,-112.65,-112.68,-113.10&PhoneMagZ=-313.06,-312.84,-311.99,-312.04,-311.81,-311.55,-311.50,-311.22,-310.95,-310.67,-310.68,-309.95,-310.23,-309.49,-309.23,-309.73,-308.33,-309.12,-307.89,-307.71,-307.47,-307.79,-306.85,-307.43,-307.04,-306.73,-306.96,-306.91,-306.55,-306.98,-307.49,-307.21,-308.24,-308.98,-309.09,-309.76,-309.97,-310.85,-311.49,-312.63,-312.42,-312.95,-314.37,-315.13,-315.83,-316.82,-317.22,-318.70,-319.38,-320.19,-320.43,-321.14,-322.21,-323.06,-323.48,-324.17,-325.27,-326.00,-326.49,-326.91,-327.05,-327.02,-327.41,-327.82,-328.17,-327.98,-327.97,-328.38,-327.78,-328.05,-328.02,-327.05,-327.27,-327.44,-327.89,-327.28,-327.33,-327.47,-328.11,-328.18,-328.19,-328.58,-329.26,-329.26,-329.50,-330.24,-330.49,-330.55,-330.29,-330.33,-329.89,-330.80,-330.37,-330.55,-330.17,-330.48,-330.24,-330.32,-329.52,-329.30,-328.96,-328.60,-328.11,-328.19,-327.78,-326.84,-327.31,-326.68,-325.56,-325.26,-324.58,-324.80,-324.74,-323.90,-324.06,-323.15,-323.53,-323.42,-323.63,-322.83,-322.23,-322.86,-323.12,-322.83,-322.88,-322.73,-322.75,-322.75,-322.24,-322.44,-322.04,-321.73,-322.21,-321.71,-321.52,-321.20,-321.04,-321.56,-320.81,-321.04,-321.17,-320.64,-320.61,-320.42,-319.83,-320.10,-319.90,-319.61,-319.43,-319.37,-319.41,-319.33,-318.88,-318.33,-318.25,-317.27,-316.92,-316.98,-316.86,-316.31,-316.17,-316.55,-315.24,-314.92,-314.91,-314.43,-314.31,-313.63,-313.78,-313.03,-312.93,-312.28,-311.55,-311.27,-311.02,-310.55,-310.56,-310.05,-309.54,-308.86,-307.86,-307.88,-307.80,-307.56,-307.72&WatchAccelX=0.10,0.10,0.09,0.08,0.08,0.07,0.06,0.05,0.05,0.04,0.03,0.03,0.03,0.02,0.02,0.02,0.02,0.02,0.02,0.02,0.01,0.00,0.00,-0.00,-0.01,-0.02,-0.04,-0.05,-0.05,-0.05,-0.04,-0.03,-0.02,-0.00,0.01,0.02,0.03,0.02,0.02,0.01,-0.00,-0.00,-0.01,-0.01,-0.02,-0.02,-0.01,0.00,0.02,0.03,0.03,0.04,0.04,0.04,0.03,0.02,0.00,-0.03,-0.05,-0.05,-0.05,-0.05,-0.05,-0.04,-0.03,-0.01,0.01,0.03,0.04,0.04,0.04,0.04,0.04,0.04,0.03,0.03,0.04,0.04,0.04,0.04,0.05,0.06,0.06,0.06,0.06,0.06,0.08,0.11,0.13,0.15,0.18,0.22,0.25,0.28,0.30,0.32,0.32,0.33,0.34,0.35,0.34,0.31,0.28,0.24,0.21,0.17,0.13,0.08,0.04,0.01,-0.03,-0.06,-0.09,-0.11,-0.12,-0.13,-0.13,-0.13,-0.13,-0.13,-0.12,-0.11,-0.10,-0.10,-0.10,-0.10,-0.11,-0.12,-0.12,-0.12,-0.13,-0.14,-0.16,-0.18,-0.19,-0.21,-0.22,-0.24,-0.24,-0.25,-0.26,-0.27,-0.28,-0.29,-0.31,-0.33,-0.35,-0.37,-0.37,-0.36,-0.34,-0.32,-0.31,-0.30,-0.29,-0.28,-0.27,-0.27,-0.26,-0.25,-0.24,-0.22,-0.20,-0.16,-0.14,-0.11,-0.08,-0.06,-0.04,-0.02,0.01,0.03,0.03,0.03,0.02,0.00,-0.01,-0.03,-0.04,-0.06,-0.06,-0.06,-0.06,-0.07,-0.06&WatchAccelY=-0.40,-0.40,-0.40,-0.41,-0.41,-0.42,-0.43,-0.44,-0.45,-0.46,-0.46,-0.47,-0.47,-0.46,-0.45,-0.44,-0.43,-0.42,-0.42,-0.41,-0.41,-0.41,-0.40,-0.40,-0.40,-0.39,-0.39,-0.39,-0.38,-0.38,-0.37,-0.37,-0.37,-0.37,-0.37,-0.37,-0.38,-0.39,-0.41,-0.42,-0.43,-0.43,-0.43,-0.43,-0.43,-0.42,-0.43,-0.43,-0.43,-0.42,-0.41,-0.39,-0.37,-0.36,-0.35,-0.34,-0.35,-0.36,-0.37,-0.38,-0.39,-0.40,-0.40,-0.39,-0.37,-0.35,-0.32,-0.32,-0.32,-0.33,-0.34,-0.34,-0.34,-0.34,-0.34,-0.35,-0.35,-0.35,-0.34,-0.33,-0.34,-0.34,-0.33,-0.30,-0.28,-0.27,-0.28,-0.30,-0.30,-0.30,-0.30,-0.30,-0.30,-0.29,-0.29,-0.28,-0.26,-0.25,-0.24,-0.23,-0.22,-0.20,-0.18,-0.16,-0.15,-0.14,-0.13,-0.13,-0.14,-0.15,-0.15,-0.16,-0.17,-0.16,-0.16,-0.16,-0.15,-0.15,-0.16,-0.17,-0.17,-0.16,-0.15,-0.14,-0.12,-0.10,-0.09,-0.09,-0.08,-0.07,-0.07,-0.07,-0.08,-0.10,-0.11,-0.12,-0.12,-0.13,-0.13,-0.13,-0.14,-0.14,-0.14,-0.14,-0.14,-0.16,-0.16,-0.17,-0.18,-0.19,-0.19,-0.19,-0.19,-0.18,-0.17,-0.16,-0.15,-0.14,-0.14,-0.15,-0.15,-0.16,-0.17,-0.18,-0.19,-0.21,-0.23,-0.24,-0.25,-0.26,-0.26,-0.27,-0.27,-0.28,-0.29,-0.30,-0.32,-0.33,-0.33,-0.33,-0.33,-0.34,-0.35,-0.35,-0.35&WatchAccelZ=-0.87,-0.88,-0.90,-0.91,-0.91,-0.90,-0.90,-0.90,-0.91,-0.92,-0.92,-0.93,-0.95,-0.96,-0.98,-0.99,-1.02,-1.03,-1.04,-1.03,-1.00,-0.99,-0.97,-0.96,-0.96,-0.96,-0.98,-0.98,-0.96,-0.94,-0.92,-0.91,-0.90,-0.89,-0.87,-0.85,-0.84,-0.83,-0.83,-0.85,-0.86,-0.87,-0.88,-0.90,-0.91,-0.91,-0.91,-0.90,-0.89,-0.90,-0.91,-0.93,-0.95,-0.97,-0.97,-0.95,-0.94,-0.92,-0.90,-0.88,-0.85,-0.84,-0.84,-0.86,-0.90,-0.93,-0.94,-0.94,-0.94,-0.93,-0.92,-0.90,-0.90,-0.89,-0.88,-0.88,-0.89,-0.90,-0.91,-0.92,-0.93,-0.95,-0.97,-0.99,-0.99,-0.97,-0.93,-0.88,-0.85,-0.81,-0.78,-0.76,-0.75,-0.75,-0.75,-0.75,-0.77,-0.79,-0.82,-0.86,-0.93,-1.03,-1.14,-1.22,-1.28,-1.30,-1.30,-1.29,-1.27,-1.24,-1.21,-1.17,-1.14,-1.12,-1.10,-1.07,-1.04,-1.01,-0.98,-0.97,-0.96,-0.95,-0.96,-0.98,-1.02,-1.06,-1.10,-1.13,-1.14,-1.13,-1.12,-1.09,-1.07,-1.05,-1.04,-1.03,-1.03,-1.02,-1.02,-1.03,-1.04,-1.04,-1.04,-1.03,-1.03,-1.02,-1.01,-0.99,-0.97,-0.95,-0.92,-0.91,-0.91,-0.91,-0.92,-0.93,-0.95,-0.95,-0.95,-0.93,-0.92,-0.91,-0.88,-0.85,-0.82,-0.80,-0.80,-0.80,-0.80,-0.81,-0.81,-0.82,-0.84,-0.85,-0.86,-0.88,-0.90,-0.92,-0.94,-0.97,-0.98,-0.99,-1.00,-1.01,-1.00&WatchGyroX=-0.36,-0.33,-0.30,-0.29,-0.29,-0.31,-0.32,-0.31,-0.31,-0.32,-0.32,-0.30,-0.28,-0.27,-0.25,-0.21,-0.17,-0.11,-0.06,-0.03,0.00,0.01,0.01,0.01,0.02,0.04,0.07,0.08,0.07,0.06,0.04,0.05,0.06,0.07,0.07,0.06,0.05,0.03,0.02,0.00,-0.03,-0.06,-0.08,-0.08,-0.09,-0.10,-0.12,-0.14,-0.16,-0.16,-0.14,-0.11,-0.06,-0.02,0.00,0.01,0.02,0.01,-0.02,-0.09,-0.16,-0.24,-0.28,-0.29,-0.27,-0.23,-0.20,-0.15,-0.12,-0.07,-0.03,0.02,0.07,0.11,0.13,0.14,0.14,0.13,0.09,0.03,-0.01,-0.03,-0.02,0.01,0.02,0.00,-0.07,-0.16,-0.26,-0.38,-0.47,-0.57,-0.65,-0.74,-0.83,-0.91,-1.01,-1.11,-1.21,-1.28,-1.27,-1.18,-1.02,-0.84,-0.67,-0.53,-0.42,-0.32,-0.23,-0.16,-0.10,-0.06,-0.01,0.04,0.07,0.10,0.11,0.11,0.11,0.10,0.08,0.06,0.05,0.06,0.11,0.18,0.26,0.35,0.41,0.45,0.47,0.49,0.49,0.51,0.52,0.53,0.53,0.54,0.55,0.57,0.60,0.63,0.66,0.69,0.72,0.74,0.75,0.74,0.70,0.64,0.59,0.54,0.51,0.49,0.49,0.49,0.50,0.50,0.48,0.44,0.41,0.38,0.33,0.27,0.19,0.12,0.07,0.04,0.01,-0.01,-0.02,-0.01,-0.00,0.01,0.01,0.01,0.01,-0.00,-0.01,-0.03,-0.04,-0.04,-0.03,-0.03,-0.02&WatchGyroY=-0.00,-0.02,-0.02,-0.01,0.00,0.02,0.02,0.02,-0.00,-0.02,-0.05,-0.09,-0.11,-0.11,-0.08,-0.05,-0.01,0.03,0.04,0.03,0.01,-0.02,-0.06,-0.08,-0.10,-0.09,-0.07,-0.03,0.02,0.08,0.13,0.16,0.17,0.15,0.12,0.08,0.00,-0.07,-0.13,-0.20,-0.23,-0.24,-0.20,-0.14,-0.08,-0.00,0.05,0.06,0.03,-0.02,-0.07,-0.10,-0.11,-0.09,-0.06,-0.03,-0.00,0.04,0.07,0.08,0.07,0.04,0.00,-0.02,-0.03,-0.03,-0.02,-0.01,-0.02,-0.05,-0.11,-0.18,-0.26,-0.35,-0.45,-0.54,-0.61,-0.61,-0.57,-0.52,-0.46,-0.40,-0.30,-0.16,-0.00,0.16,0.34,0.52,0.68,0.81,0.89,0.94,0.95,0.92,0.87,0.81,0.72,0.59,0.41,0.22,0.04,-0.11,-0.23,-0.29,-0.27,-0.20,-0.09,0.01,0.10,0.15,0.18,0.22,0.27,0.33,0.40,0.47,0.53,0.56,0.56,0.52,0.45,0.35,0.25,0.14,0.06,0.02,0.02,0.08,0.14,0.22,0.29,0.32,0.33,0.30,0.25,0.21,0.16,0.13,0.11,0.09,0.09,0.08,0.09,0.08,0.08,0.09,0.11,0.14,0.18,0.22,0.25,0.23,0.19,0.14,0.08,0.05,0.05,0.07,0.11,0.17,0.25,0.30,0.33,0.36,0.37,0.36,0.32,0.27,0.20,0.11,0.02,-0.10,-0.22,-0.33,-0.43,-0.50,-0.54,-0.53,-0.47,-0.39,-0.29,-0.19,-0.11,-0.05,0.02&WatchGyroZ=0.07,0.04,0.00,-0.03,-0.05,-0.06,-0.07,-0.07,-0.07,-0.08,-0.10,-0.13,-0.17,-0.20,-0.22,-0.24,-0.25,-0.25,-0.26,-0.26,-0.27,-0.27,-0.28,-0.29,-0.29,-0.30,-0.30,-0.30,-0.31,-0.32,-0.33,-0.35,-0.36,-0.36,-0.37,-0.37,-0.37,-0.38,-0.40,-0.41,-0.43,-0.44,-0.44,-0.45,-0.48,-0.51,-0.55,-0.58,-0.61,-0.64,-0.66,-0.67,-0.66,-0.63,-0.59,-0.55,-0.52,-0.49,-0.48,-0.45,-0.42,-0.39,-0.35,-0.32,-0.30,-0.29,-0.30,-0.31,-0.32,-0.34,-0.35,-0.35,-0.35,-0.36,-0.37,-0.37,-0.35,-0.33,-0.29,-0.25,-0.22,-0.19,-0.19,-0.19,-0.19,-0.20,-0.22,-0.25,-0.30,-0.34,-0.36,-0.35,-0.36,-0.36,-0.37,-0.39,-0.39,-0.39,-0.38,-0.37,-0.35,-0.32,-0.28,-0.24,-0.20,-0.16,-0.12,-0.10,-0.08,-0.08,-0.11,-0.15,-0.21,-0.27,-0.32,-0.33,-0.33,-0.31,-0.30,-0.29,-0.28,-0.29,-0.29,-0.30,-0.29,-0.27,-0.24,-0.21,-0.16,-0.10,-0.04,0.01,0.05,0.08,0.09,0.10,0.11,0.13,0.15,0.17,0.19,0.20,0.20,0.19,0.18,0.16,0.14,0.11,0.09,0.08,0.07,0.08,0.09,0.10,0.11,0.12,0.12,0.12,0.13,0.13,0.12,0.10,0.07,0.04,0.02,0.01,-0.00,-0.01,-0.00,0.02,0.05,0.08,0.10,0.10,0.10,0.08,0.07,0.06,0.04,0.02,0.00,-0.01,-0.03,-0.03,-0.03&WatchMagX=165.56,165.59,165.46,165.55,165.54,165.47,165.47,165.41,165.37,165.57,165.44,165.43,165.47,165.36,165.14,165.32,165.36,165.31,165.26,165.36,165.20,165.32,165.23,165.27,165.07,165.08,165.08,164.96,164.98,165.09,165.39,165.40,165.73,165.62,165.57,165.49,165.49,165.57,165.52,165.29,165.32,165.06,164.99,165.19,165.10,165.17,165.11,165.34,165.13,165.18,165.07,164.86,165.02,164.94,165.06,164.81,164.90,164.92,164.96,165.15,165.08,165.15,165.08,164.87,164.99,164.99,165.04,165.02,165.01,165.01,164.82,164.56,164.48,164.20,164.07,163.86,163.55,163.30,163.15,162.68,162.74,162.53,162.54,162.63,162.86,162.95,163.39,163.61,164.10,164.60,164.94,165.41,166.11,166.32,166.59,167.09,167.31,167.72,167.82,167.84,168.01,168.12,168.18,168.39,168.39,168.79,169.22,169.43,170.03,170.22,170.81,171.04,171.61,172.20,172.72,173.38,173.76,174.20,174.91,175.35,175.52,175.63,175.95,176.08,176.40,176.54,176.87,177.21,177.44,178.05,178.13,178.26,178.48,178.63,179.03,179.02,179.32,179.64,179.67,179.79,180.02,179.98,180.07,180.09,180.09,180.29,180.54,180.53,180.75,180.85,180.91,180.95,180.86,180.99,180.82,180.89,181.00,180.89,181.27,181.39,181.51,181.64,181.85,182.06,182.02,182.25,182.11,182.15,182.14,181.98,181.96,181.87,181.42,181.34,180.98,180.86,180.51,180.47,180.35,180.21,180.15,180.17,180.32,180.25,180.21&WatchMagY=61.44,61.29,60.83,60.50,60.28,59.74,59.47,59.11,58.70,58.30,58.02,57.92,57.64,57.40,57.14,56.72,56.56,56.30,56.12,55.94,55.75,55.49,55.42,55.46,55.20,55.17,55.20,55.28,55.40,55.49,55.43,55.46,55.34,55.39,55.74,55.54,55.72,55.65,55.72,55.84,55.83,55.84,55.80,55.87,55.87,55.92,56.02,56.11,56.13,56.04,56.11,56.18,56.15,56.01,55.98,55.98,55.76,55.67,55.70,55.59,55.52,55.27,55.20,55.10,55.06,55.01,55.02,55.31,55.22,55.17,55.13,55.33,55.35,55.35,55.39,55.63,55.46,55.60,55.62,55.77,55.79,55.78,55.83,55.65,55.74,55.84,55.67,55.70,55.51,55.75,55.92,55.89,55.88,55.79,55.92,56.02,56.11,56.09,56.04,56.08,55.83,55.60,55.65,55.36,55.33,55.31,55.30,55.23,55.07,55.18,55.17,55.28,55.27,55.08,55.16,55.26,55.22,55.28,55.28,55.35,55.43,55.52,55.40,55.79,55.52,55.62,55.65,55.57,55.51,55.40,55.20,55.37,55.18,55.22,55.24,55.32,55.17,55.38,55.21,55.30,55.51,55.66,55.59,55.65,55.90,55.84,55.99,56.12,56.24,56.28,56.39,56.20,56.39,56.31,56.53,56.66,56.66,56.51,56.66,56.81,56.76,56.79,56.61,56.62,56.73,56.83,56.72,56.81,56.58,56.69,56.67,56.68,56.80,56.90,56.95,56.82,56.97,57.05,57.12,57.19,57.29,57.42,57.52,57.65,57.88&WatchMagZ=-59.81,-59.95,-60.00,-59.55,-59.33,-59.60,-59.60,-59.58,-59.56,-59.97,-59.77,-59.48,-59.54,-59.40,-59.74,-59.89,-59.13,-59.27,-59.24,-59.34,-59.15,-59.24,-59.34,-59.18,-59.32,-58.97,-59.34,-59.20,-59.00,-59.47,-59.17,-59.15,-59.11,-59.13,-59.20,-59.16,-59.06,-58.95,-59.15,-59.07,-59.21,-59.29,-58.90,-59.02,-59.14,-58.74,-58.92,-58.79,-59.05,-59.01,-59.22,-59.14,-59.20,-59.10,-58.97,-59.07,-59.13,-59.04,-59.15,-59.11,-58.80,-58.67,-58.85,-58.78,-59.02,-59.00,-58.36,-58.54,-58.61,-58.91,-58.98,-58.75,-58.86,-59.04,-58.73,-59.11,-58.71,-58.89,-58.90,-59.09,-58.66,-58.81,-58.83,-58.86,-58.75,-58.83,-58.83,-58.56,-58.66,-58.90,-58.76,-58.50,-58.45,-58.72,-58.73,-58.31,-58.51,-58.61,-58.41,-58.34,-58.81,-58.82,-58.96,-58.98,-58.57,-58.48,-58.57,-58.91,-58.89,-58.68,-58.67,-58.74,-58.45,-58.49,-58.63,-58.43,-58.53,-58.60,-58.51,-58.10,-58.43,-58.28,-58.66,-58.71,-58.49,-58.79,-58.38,-58.57,-58.42,-58.29,-58.36,-58.12,-58.39,-58.14,-58.22,-58.16,-58.31,-58.06,-58.06,-57.50,-57.72,-57.50,-57.82,-57.88,-57.53,-57.79,-57.52,-57.79,-57.72,-57.86,-57.79,-57.76,-57.74,-57.60,-57.91,-57.75,-57.51,-57.49,-57.50,-57.69,-57.75,-57.63,-57.53,-57.67,-57.44,-57.42,-57.85,-57.45,-57.56,-57.73,-57.50,-57.76,-57.77,-58.20,-57.71,-57.82,-58.09,-58.27,-58.18,-57.98,-58.08,-57.96,-58.23,-58.23,-58.22";

    document.getElementById("prodapi").innerHTML = "Prodding...";

    await fetch((url))
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
    "PhoneAccelX": [],
    "PhoneAccelY": [],
    "PhoneAccelZ": [],
    "PhoneGyroX": [],
    "PhoneGyroY": [],
    "PhoneGyroZ": [],
    "PhoneMagX": [],
    "PhoneMagY": [],
    "PhoneMagZ": [],

    "WatchAccelX": [],
    "WatchAccelY": [],
    "WatchAccelZ": [],
    "WatchGyroX": [],
    "WatchGyroY": [],
    "WatchGyroZ": [],
    "WatchMagX": [],
    "WatchMagY": [],
    "WatchMagZ": [],

    "PhoneTimes": [],
    "WatchTimes": [],
};


let predictions = [];
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