from matplotlib import dates as mdate
from matplotlib import pyplot as plt
import matplotlib.animation as animation
import pandas as pd
from time import sleep
from IPython.display import clear_output
import numpy as np
from scipy.stats import skew

optimalFileBase = [
    {"PhoneAccel": "../Paddling_Data/Jan_24/Anthony Optimal (1)/AccelerometerUncalibrated.csv",
     "PhoneGyro": "../Paddling_Data/Jan_24/Anthony Optimal (1)/GyroscopeUncalibrated.csv",
     "PhoneMag": "../Paddling_Data/Jan_24/Anthony Optimal (1)/MagnetometerUncalibrated.csv",
     "LeftWatch": "../Paddling_Data/Jan_24//Anthony Optimal (1)/LeftWatch.csv",
     "RightWatch": "../Paddling_Data/Jan_24//Anthony Optimal (1)/RightWatch.csv"
    },
    {"PhoneAccel": "../Paddling_Data/Jan_24//Alex Optimal (1)/AccelerometerUncalibrated.csv",
     "PhoneGyro": "../Paddling_Data/Jan_24//Alex Optimal (1)/GyroscopeUncalibrated.csv",
     "PhoneMag": "../Paddling_Data/Jan_24//Alex Optimal (1)/MagnetometerUncalibrated.csv",
     "LeftWatch": "../Paddling_Data/Jan_24//Alex Optimal (1)/LeftWatch.csv",
     "RightWatch": "../Paddling_Data/Jan_24//Alex Optimal (1)/RightWatch.csv"
    },
    {"PhoneAccel": "../Paddling_Data/Jan_24//Alex Optimal (2)/AccelerometerUncalibrated.csv",
     "PhoneGyro": "../Paddling_Data/Jan_24//Alex Optimal (2)/GyroscopeUncalibrated.csv",
     "PhoneMag": "../Paddling_Data/Jan_24//Alex Optimal (2)/MagnetometerUncalibrated.csv",
     "LeftWatch": "../Paddling_Data/Jan_24//Alex Optimal (2)/LeftWatch.csv",
     "RightWatch": "../Paddling_Data/Jan_24//Alex Optimal (2)/RightWatch.csv"
    },
    {"PhoneAccel": "../Paddling_Data/Jan_24//Tony Optimal (1)/AccelerometerUncalibrated.csv",
     "PhoneGyro": "../Paddling_Data/Jan_24//Tony Optimal (1)/GyroscopeUncalibrated.csv",
     "PhoneMag": "../Paddling_Data/Jan_24//Tony Optimal (1)/MagnetometerUncalibrated.csv",
     "LeftWatch": "../Paddling_Data/Jan_24//Tony Optimal (1)/LeftWatch.csv",
     "RightWatch": "../Paddling_Data/Jan_24//Tony Optimal (1)/RightWatch.csv"
    },
    {"PhoneAccel": "../Paddling_Data/Jan_24//Tony Optimal (2)/AccelerometerUncalibrated.csv",
     "PhoneGyro": "../Paddling_Data/Jan_24//Tony Optimal (2)/GyroscopeUncalibrated.csv",
     "PhoneMag": "../Paddling_Data/Jan_24//Tony Optimal (2)/MagnetometerUncalibrated.csv",
     "LeftWatch": "../Paddling_Data/Jan_24//Tony Optimal (2)/LeftWatch.csv",
     "RightWatch": "../Paddling_Data/Jan_24//Tony Optimal (2)/RightWatch.csv"
    },
    {"PhoneAccel": "../Paddling_Data/Jan_24//Anthony Inoptimal (1)/AccelerometerUncalibrated.csv",
     "PhoneGyro": "../Paddling_Data/Jan_24//Anthony Inoptimal (1)/GyroscopeUncalibrated.csv",
     "PhoneMag": "../Paddling_Data/Jan_24//Anthony Inoptimal (1)/MagnetometerUncalibrated.csv",
     "LeftWatch": "../Paddling_Data/Jan_24//Anthony Inoptimal (1)/LeftWatch.csv",
     "RightWatch": "../Paddling_Data/Jan_24//Anthony Inoptimal (1)/RightWatch.csv"
    },
    {"PhoneAccel": "../Paddling_Data/Jan_24//Shubham Optimal (1)/AccelerometerUncalibrated.csv",
     "PhoneGyro": "../Paddling_Data/Jan_24//Shubham Optimal (1)/GyroscopeUncalibrated.csv",
     "PhoneMag": "../Paddling_Data/Jan_24//Shubham Optimal (1)/MagnetometerUncalibrated.csv",
     "LeftWatch": "../Paddling_Data/Jan_24//Shubham Optimal (1)/LeftWatch.csv",
     "RightWatch": "../Paddling_Data/Jan_24//Shubham Optimal (1)/RightWatch.csv"
    },
];

def createFullDict(fileBaseDict):
    
    PhoneAccel = pd.read_csv(fileBaseDict["PhoneAccel"])
    PhoneGyro = pd.read_csv(fileBaseDict["PhoneGyro"])
    PhoneMag = pd.read_csv(fileBaseDict["PhoneMag"])
    LeftWatch = pd.read_csv(fileBaseDict["LeftWatch"])
    RightWatch = pd.read_csv(fileBaseDict["RightWatch"])
        
    
    Dict = {
        "PhoneTime": PhoneAccel["time"],
        "LeftWatchTime": LeftWatch[" TimeSince1970(ms)"],
        "RightWatchTime": RightWatch[" TimeSince1970(ms)"],

        "PhoneAccelX": PhoneAccel["x"],
        "PhoneAccelY": PhoneAccel["y"],
        "PhoneAccelZ": PhoneAccel["z"],

        "PhoneGyroX": PhoneGyro["x"],
        "PhoneGyroY": PhoneGyro["y"],
        "PhoneGyroZ": PhoneGyro["z"],

        "PhoneMagX": PhoneMag["x"],
        "PhoneMagY": PhoneMag["y"],
        "PhoneMagZ": PhoneMag["z"],

        "LeftWatchRoll": LeftWatch[" DMRoll"],
        "LeftWatchPitch": LeftWatch[" DMPitch"],
        "LeftWatchYaw": LeftWatch[" DMYaw"],

        "LeftWatchRotX": LeftWatch[" DMRotX"],
        "LeftWatchRotY": LeftWatch[" DMRotY"],
        "LeftWatchRotZ": LeftWatch[" DMRotZ"],

        "LeftWatchGravX": LeftWatch[" DMGrvX"],
        "LeftWatchGravY": LeftWatch[" DMGrvY"],
        "LeftWatchGravZ": LeftWatch[" DMGrvZ"],
        
        "LeftWatchDMUAccelX": LeftWatch[" DMUAccelX"],
        "LeftWatchDMUAccelY": LeftWatch[" DMUAccelY"],
        "LeftWatchDMUAccelZ": LeftWatch[" DMUAccelZ"],
        
        "LeftWatchQuatW": LeftWatch[" DMQuatW"],
        "LeftWatchQuatX": LeftWatch[" DMQuatX"],
        "LeftWatchQuatY": LeftWatch[" DMQuatY"],
        "LeftWatchQuatZ": LeftWatch[" DMQuatZ"],
    
        "LeftWatchAccelX": LeftWatch["AccelroX"],
        "LeftWatchAccelY": LeftWatch[" AceelroY"],
        "LeftWatchAccelZ": LeftWatch[" AceelroZ"],
        
        "RightWatchRoll": RightWatch[" DMRoll"],
        "RightWatchPitch": RightWatch[" DMPitch"],
        "RightWatchYaw": RightWatch[" DMYaw"],

        "RightWatchRotX": RightWatch[" DMRotX"],
        "RightWatchRotY": RightWatch[" DMRotY"],
        "RightWatchRotZ": RightWatch[" DMRotZ"],

        "RightWatchGravX": RightWatch[" DMGrvX"],
        "RightWatchGravY": RightWatch[" DMGrvY"],
        "RightWatchGravZ": RightWatch[" DMGrvZ"],
        
        "RightWatchDMUAccelX": RightWatch[" DMUAccelX"],
        "RightWatchDMUAccelY": RightWatch[" DMUAccelY"],
        "RightWatchDMUAccelZ": RightWatch[" DMUAccelZ"],
        
        "RightWatchQuatW": RightWatch[" DMQuatW"],
        "RightWatchQuatX": RightWatch[" DMQuatX"],
        "RightWatchQuatY": RightWatch[" DMQuatY"],
        "RightWatchQuatZ": RightWatch[" DMQuatZ"],
    
        "RightWatchAccelX": RightWatch["AccelroX"],
        "RightWatchAccelY": RightWatch[" AceelroY"],
        "RightWatchAccelZ": RightWatch[" AceelroZ"]
    }
    
    return Dict

def clipArray(Dict, attribute, clipLen):
    Dict[attribute] = Dict[attribute][clipLen:]

def alignTimings(currentDict):
    currentPhoneTime = currentDict["PhoneTime"][0]
    currentLeftWatchTime = currentDict["LeftWatchTime"][0]*1000000
    currentRightWatchTime = currentDict["RightWatchTime"][0]*1000000
    
    holdMetric = None
    
    if (currentPhoneTime >= currentLeftWatchTime and currentPhoneTime >= currentRightWatchTime):
        holdMetric = "currentPhoneTime"
    elif (currentLeftWatchTime >= currentPhoneTime and currentLeftWatchTime >= currentRightWatchTime):
        holdMetric = "currentLeftWatchTime"
    else:
        holdMetric = "currentRightWatchTime"
    
    
    pindex = 0;
    wlindex = 0;
    wrindex = 0;
    while (True):
        currentPhoneTime = currentDict["PhoneTime"][pindex];
        currentLeftWatchTime = currentDict["LeftWatchTime"][wlindex]*1000000;
        currentRightWatchTime = currentDict["RightWatchTime"][wrindex]*1000000;
        
        
#         print(currentPhoneTime,currentLeftWatchTime,currentRightWatchTime)

        if (holdMetric == "currentPhoneTime"):
            if (currentLeftWatchTime < currentPhoneTime and currentRightWatchTime < currentPhoneTime):
                wlindex += 1;
                wrindex += 1;
            elif (currentLeftWatchTime < currentPhoneTime):
                wlindex += 1;
            elif (currentRightWatchTime < currentPhoneTime):
                wrindex += 1;
            else:
                break
    
        elif (holdMetric == "currentLeftWatchTime"):
            if (currentPhoneTime < currentLeftWatchTime and currentRightWatchTime < currentLeftWatchTime):
                pindex += 1;
                wrindex += 1;
            elif (currentPhoneTime < currentLeftWatchTime):
                pindex += 1;
            elif (currentRightWatchTime < currentLeftWatchTime):
                wrindex += 1;
            else:
                break

        else:
            if (currentPhoneTime < currentRightWatchTime and currentLeftWatchTime < currentRightWatchTime):
                pindex += 1;
                wlindex += 1;
            elif (currentPhoneTime < currentRightWatchTime):
                pindex += 1;
            elif (currentLeftWatchTime < currentRightWatchTime):
                wlindex += 1;
            else:
                break

    print("delta is", (currentDict["PhoneTime"][pindex]-currentDict["LeftWatchTime"][wlindex]*1000000)/(1000000000));
    print("delta is", (currentDict["PhoneTime"][pindex]-currentDict["RightWatchTime"][wrindex]*1000000)/(1000000000));


    PhoneAttributes = ["PhoneTime", "PhoneAccelX", "PhoneAccelY", "PhoneAccelZ", "PhoneGyroX",
                       "PhoneGyroY", "PhoneGyroZ", "PhoneMagX", "PhoneMagY", "PhoneMagZ"]
                       
    LeftWatchAttributes = ["LeftWatchTime", "LeftWatchRoll", "LeftWatchPitch", "LeftWatchYaw","LeftWatchRotX", 
                           "LeftWatchRotY", "LeftWatchRotZ", "LeftWatchGravX", "LeftWatchGravY", "LeftWatchGravZ", 
                           "LeftWatchDMUAccelX", "LeftWatchDMUAccelY", "LeftWatchDMUAccelZ", "LeftWatchQuatW",
                           "LeftWatchQuatX", "LeftWatchQuatY", "LeftWatchQuatZ", "LeftWatchAccelX",
                           "LeftWatchAccelY", "LeftWatchAccelZ"]
    RightWatchAttributes = ["RightWatchTime", "RightWatchRoll", "RightWatchPitch", "RightWatchYaw", "RightWatchRotX", 
                            "RightWatchRotY", "RightWatchRotZ", "RightWatchGravX", "RightWatchGravY",
                            "RightWatchGravZ", "RightWatchDMUAccelX", "RightWatchDMUAccelY", "RightWatchDMUAccelZ",
                            "RightWatchQuatW", "RightWatchQuatX", "RightWatchQuatY", "RightWatchQuatZ",
                            "RightWatchAccelX", "RightWatchAccelY", "RightWatchAccelZ"]

    for i in PhoneAttributes:
        clipArray(currentDict, i, pindex)
    
    for i in LeftWatchAttributes:
        clipArray(currentDict, i, wlindex)
    
    for i in RightWatchAttributes:
        clipArray(currentDict, i, wrindex)
        
    return [pindex, wlindex, wrindex]

def addReading(newDict, oldDict, pindex, wlindex, wrindex):
    attributes = ["PhoneTime", "PhoneAccelX", "PhoneAccelY", "PhoneAccelZ", "PhoneGyroX",
                   "PhoneGyroY", "PhoneGyroZ", "PhoneMagX", "PhoneMagY", "PhoneMagZ", "LeftWatchTime", 
                   "LeftWatchRoll", "LeftWatchPitch", "LeftWatchYaw","LeftWatchRotX", 
                   "LeftWatchRotY", "LeftWatchRotZ", "LeftWatchGravX", "LeftWatchGravY", "LeftWatchGravZ", 
                   "LeftWatchDMUAccelX", "LeftWatchDMUAccelY", "LeftWatchDMUAccelZ", "LeftWatchQuatW",
                   "LeftWatchQuatX", "LeftWatchQuatY", "LeftWatchQuatZ", "LeftWatchAccelX",
                   "LeftWatchAccelY", "LeftWatchAccelZ", "RightWatchTime", "RightWatchRoll", 
                   "RightWatchPitch", "RightWatchYaw", "RightWatchRotX", 
                   "RightWatchRotY", "RightWatchRotZ", "RightWatchGravX", "RightWatchGravY",
                   "RightWatchGravZ", "RightWatchDMUAccelX", "RightWatchDMUAccelY", "RightWatchDMUAccelZ",
                   "RightWatchQuatW", "RightWatchQuatX", "RightWatchQuatY", "RightWatchQuatZ",
                   "RightWatchAccelX", "RightWatchAccelY", "RightWatchAccelZ"]
        
    for i in attributes:
        index = ""
        if ("Phone" in i):
            index = pindex
        elif ("LeftWatch" in i):
            index = wlindex
        else:
            index = wrindex
            
#         print(index, wrindex)
        
        
        if (i in newDict):
            newDict[i].append(oldDict[i][index])
        else:
#             print("attribute",i)
#             print(oldDict[i])
            newDict[i] = [oldDict[i][index]]
    
def continuouslydownward(arr, startIndex, wantlength):
    checked = startIndex
    
    anomalies = 0
    while (checked < startIndex+wantlength):
        
        if (len(arr) <= startIndex+wantlength):
#             print("left cuz of end", checked-startIndex)
            return False
        if (arr[checked] < arr[checked+1]):
#             print("left cuz of higher", checked-startIndex)
            anomalies += 1
        
        checked += 1
    
    return anomalies <= 3
    
def splitIntoStrokes(currentDict, pindex, wlindex, wrindex):

    streaks = [];

    strokearr = [];

    currentstroke = {}

    pstart = pindex
    wlstart = wlindex
    wrstart = wrindex

    i = 0;
    last = 0;
    while (pstart < len(currentDict["PhoneAccelX"]) and wlstart < len(currentDict["LeftWatchRoll"])
          and wrstart < len(currentDict["RightWatchRoll"])):
        subj = currentDict["LeftWatchQuatX"][wlstart];
        
#         print("inside out", wlstart, subj)
        # cut it off as a stroke
        if (continuouslydownward(currentDict["LeftWatchQuatX"], wlstart, 40) and i-last > 150):
            
#             print("inside")

            strokearr.append(currentstroke);

            currentstroke = {}

            streaks.append(i-last) #; // will usually be around the threshold

            last = i;

        # Limit will be taken care of by the stroke splitter
        if (True or i-last < 190):
            
            addReading(currentstroke, currentDict, pstart, wlstart, wrstart)
        i += 1;
        pstart += 1
        wlstart += 1
        wrstart += 1

    print(streaks);

    # // noew find out the differences
    differences = [];
    i = 1;
    while (i < len(streaks)):
        differences.append(streaks[i]-streaks[i-1]);
        i += 1

    print(differences);

    starts = [];
    lns = [];

    currentstart = 0;
    currentlen = 0;
    i = 0;
    while (i < len(differences)):
    #     print("current i",i);
        if (differences[i] < 70 and differences[i] > -70):
    #         // within regulation, len goes up
            currentlen += 1;
        else:
    #         // out of regulation, cut it off
            lns.append(currentlen);
            starts.append(currentstart);

            currentlen = 0;
            currentstart = i+1;

        # check if thats the end
        if (i == len(differences)-1):
            lns.append(currentlen);
            starts.append(currentstart);

            currentlen = 0;
            currentstart = i+1;

        i += 1;


    print(starts);
    print(lns);

    # if the length is above 2, use it

    strokearray = [];
    # // only take the ones that were approved by the automation

    # // send any set of strokes larger than 2 for evaluation

    i = 0;
    while (i < len(starts)):
        if (lns[i] > 2):
    #         // actually do the thing

            j = starts[i];
            while (j < starts[i]+lns[i]):
#                 print(len(strokearr[j]["PhoneAccelX"]))
                if (len(strokearr[j]["PhoneAccelX"]) >= 190):
                    strokearray.append(strokearr[j]);

                j += 1;

    #     // else skip over it
        i += 1;
    return strokearray;

def splitIntoParts(currentDict):
    
    # currentDict is a dict with attributes of arrays
    streaks = [];
    strokearr = [];
    splitalready = False;
    secondsplitalready = False;

    currentstroke = {}

    i = 0;
    while (i < len(currentDict["PhoneAccelX"]) and i < len(currentDict["LeftWatchRoll"])
          and i < len(currentDict["RightWatchRoll"])):
        
#         print("in loop, at index", i)
        
        subj = currentDict["LeftWatchQuatW"][i];

        # i want to see if its increasing consistently
        if ((not splitalready) and 
            i < len(currentDict["LeftWatchQuatW"])-17 and subj < currentDict["LeftWatchQuatW"][i+1] 
            and currentDict["LeftWatchQuatW"][i+1] < currentDict["LeftWatchQuatW"][i+2] 
            and currentDict["LeftWatchQuatW"][i+2] < currentDict["LeftWatchQuatW"][i+3] 
            and currentDict["LeftWatchQuatW"][i+3] < currentDict["LeftWatchQuatW"][i+4] 
            and currentDict["LeftWatchQuatW"][i+4] < currentDict["LeftWatchQuatW"][i+5] 
            and currentDict["LeftWatchQuatW"][i+5] < currentDict["LeftWatchQuatW"][i+6] 
            and currentDict["LeftWatchQuatW"][i+6] < currentDict["LeftWatchQuatW"][i+7] 
            and currentDict["LeftWatchQuatW"][i+7] < currentDict["LeftWatchQuatW"][i+8] 
            and currentDict["LeftWatchQuatW"][i+8] < currentDict["LeftWatchQuatW"][i+9] 
            and currentDict["LeftWatchQuatW"][i+9] < currentDict["LeftWatchQuatW"][i+10] 
            and currentDict["LeftWatchQuatW"][i+10] < currentDict["LeftWatchQuatW"][i+11] 
            and currentDict["LeftWatchQuatW"][i+11] < currentDict["LeftWatchQuatW"][i+12] 
            and currentDict["LeftWatchQuatW"][i+12] < currentDict["LeftWatchQuatW"][i+13] 
            and currentDict["LeftWatchQuatW"][i+13] < currentDict["LeftWatchQuatW"][i+14] 
            and currentDict["LeftWatchQuatW"][i+14] < currentDict["LeftWatchQuatW"][i+15] 
            and currentDict["LeftWatchQuatW"][i+15] < currentDict["LeftWatchQuatW"][i+16] 
            and currentDict["LeftWatchQuatW"][i+16] < currentDict["LeftWatchQuatW"][i+17]):
            
#             print("first split out, at index", i)

            strokearr.append(currentstroke)
            
            splitalready = True
            
            currentstroke = {}
            
         # now i want to see if its decreasing consistently
        if ((splitalready) and (not secondsplitalready) and
            i < len(currentDict["LeftWatchQuatW"])-10 and subj > currentDict["LeftWatchQuatW"][i+1] 
            and currentDict["LeftWatchQuatW"][i+1] > currentDict["LeftWatchQuatW"][i+2] 
            and currentDict["LeftWatchQuatW"][i+2] > currentDict["LeftWatchQuatW"][i+3] 
            and currentDict["LeftWatchQuatW"][i+3] > currentDict["LeftWatchQuatW"][i+4] 
            and currentDict["LeftWatchQuatW"][i+4] > currentDict["LeftWatchQuatW"][i+5] 
            and currentDict["LeftWatchQuatW"][i+5] > currentDict["LeftWatchQuatW"][i+6] 
            and currentDict["LeftWatchQuatW"][i+6] > currentDict["LeftWatchQuatW"][i+7] 
            and currentDict["LeftWatchQuatW"][i+7] > currentDict["LeftWatchQuatW"][i+8] 
            and currentDict["LeftWatchQuatW"][i+8] > currentDict["LeftWatchQuatW"][i+9]):
            
#             print("second split out, at index", i)
            strokearr.append(currentstroke)
            
            secondsplitalready = True
            
            currentstroke = {}
    
        addReading(currentstroke, currentDict, i, i, i)
        i += 1;
    strokearr.append(currentstroke);

#     print("last split out, at index", i)
#
    return strokearr;

def getSummaryStats(arr):
    #dont flatten, summarize into mean, skewness, stdev, min, max, range, 75th percentile, 25th percentile
    retarr = [np.mean(arr), skew(arr), np.std(arr), np.min(arr), np.max(arr), np.max(arr)-np.min(arr), np.percentile(arr, 25), np.percentile(arr, 75)]
    
    return retarr

def convertToSummary(dct):
    attributes = ["PhoneTime", "PhoneAccelX", "PhoneAccelY", "PhoneAccelZ", "PhoneGyroX",
                   "PhoneGyroY", "PhoneGyroZ", "PhoneMagX", "PhoneMagY", "PhoneMagZ", "LeftWatchTime", 
                   "LeftWatchRoll", "LeftWatchPitch", "LeftWatchYaw","LeftWatchRotX", 
                   "LeftWatchRotY", "LeftWatchRotZ", "LeftWatchGravX", "LeftWatchGravY", "LeftWatchGravZ", 
                   "LeftWatchDMUAccelX", "LeftWatchDMUAccelY", "LeftWatchDMUAccelZ", "LeftWatchQuatW",
                   "LeftWatchQuatX", "LeftWatchQuatY", "LeftWatchQuatZ", "LeftWatchAccelX",
                   "LeftWatchAccelY", "LeftWatchAccelZ", "RightWatchTime", "RightWatchRoll", 
                   "RightWatchPitch", "RightWatchYaw", "RightWatchRotX", 
                   "RightWatchRotY", "RightWatchRotZ", "RightWatchGravX", "RightWatchGravY",
                   "RightWatchGravZ", "RightWatchDMUAccelX", "RightWatchDMUAccelY", "RightWatchDMUAccelZ",
                   "RightWatchQuatW", "RightWatchQuatX", "RightWatchQuatY", "RightWatchQuatZ",
                   "RightWatchAccelX", "RightWatchAccelY", "RightWatchAccelZ"]
    endarr = []
    
    for feature in attributes:
        endarr.extend(getSummaryStats(dct[feature]))
        
    return endarr
    
def getResults(predict_y, y_test):
    try:
        true_pos = 0
        true_neg = 0
        false_pos = 0
        false_neg = 0

        i = 0
        while (i < len(predict_y)):
            pred = predict_y[i]
            real = y_test[i]

            if (pred == real and pred == 1):
                true_pos += 1
            elif (pred == real and pred == 0):
                true_neg += 1
            elif (pred != real and real == 0):
                false_pos += 1
            else:
                false_neg += 1

            i += 1

        
            precision = (true_pos)/(true_pos+false_pos)
            recall = (true_pos)/(true_pos+false_neg)
            accuracy = (true_pos+true_neg)/(true_pos+true_neg+false_pos+false_neg)
            fscore = 2*(precision*recall)/(precision+recall)
        print("Precision:",precision,"\nRecall:",recall,"\nAccuracy:",accuracy,"\nFscore:",fscore)
        
    except (ZeroDivisionError):
        print("zero division error")
    
    

def filesToTrain(num, label):
    global catchcompletearr
    global catchresultarr

    global pullcompletearr
    global pullresultarr

    global recoverycompletearr
    global recoveryresultarr
    
    dct = createFullDict(optimalFileBase[num])
    ret = alignTimings(dct)
#     print(ret)
    strokearray = splitIntoStrokes(dct, ret[0],ret[1],ret[2])
    
    i = 0
    while (i < len(strokearray)):
        starr = splitIntoParts(strokearray[i]);
        
        if (len(starr) != 3 or starr[0] == {} or starr[1] == {} or starr[2] == {}):
            # splitting didnt work, discard
            i += 1
            continue
        else:
            catchcompletearr.append(convertToSummary(starr[0]))
            catchresultarr.append(label)
            
            pullcompletearr.append(convertToSummary(starr[1]))
            pullresultarr.append(label)
            
            recoverycompletearr.append(convertToSummary(starr[2]))
            recoveryresultarr.append(label)

        i += 1

catchcompletearr = []
catchresultarr = []

pullcompletearr = []
pullresultarr = []

recoverycompletearr = []
recoveryresultarr = []

filesToTrain(0, 0)
filesToTrain(1, 0)
filesToTrain(2, 0)
filesToTrain(4, 1)
filesToTrain(5, 1)