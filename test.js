var endpoint = process.argv[2]
var Web3 = require('web3');
require('isomorphic-fetch');
var web3 = new Web3(new Web3.providers.HttpProvider(endpoint));

// network speed test
var rounds = 0
var stopSpeedTestFlag = false
var latencyArr = []


const headers = { 'Content-Type': 'application/json' };


function speedTest() {
    stopSpeedTestFlag = false
    tempTime = getNanoSecTime()
    fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify({
            id: "1",
            jsonrpc: "2.0",
            method: "eth_blockNumber",
            params: [],
        }),
    }).getBlockNumber().then(function(value) {
        var questTime = (getNanoSecTime() - tempTime) / 1000000
        rounds++
        console.log(questTime.toFixed(2) + " ms")
        latencyArr[rounds] = questTime
        if (rounds == 50)
            stopSpeedTest()
        if (!stopSpeedTestFlag)
            speedTest()
    })
}

function speedTestUpdate() {}

function getNanoSecTime() {
    var hrTime = process.hrtime();
    return hrTime[0] * 1000000000 + hrTime[1];
}

function stopSpeedTest() {
    stopSpeedTestFlag = true

    var maxLatency = -1
    var minLatency = 999999
    var totalLatency = 0

    latencyArr.forEach(function(tempTime) {
        if (tempTime > maxLatency)
            maxLatency = tempTime
        if (tempTime < minLatency)
            minLatency = tempTime

        totalLatency += tempTime
    })

    console.log("end");
    console.log("Total number of rounds: " + rounds);
    console.log("Max latency: " + maxLatency);
    console.log("Min latency: " + minLatency);
    console.log("Average latency: " + totalLatency / rounds);

}

speedTest()