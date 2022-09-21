const contractAddress = "0x7764270eA941352Ec39d7D6825E5118F5a89fD8c";
const contractABI = require('./abi.json');


const WEB3 = require('web3');
let web3 = new WEB3(new WEB3.providers.WebsocketProvider(`http://127.0.0.1:7545/`));

// const web3 = new WEB3('http://127.0.0.1:7545/');


const contract = new web3.eth.Contract(contractABI.abi, contractAddress);


contract.events.MyEvent({})
.on('data', (event)=>{

    let txHash = event.transactionHash;
    let num = event.returnValues[0];
    let address = event.returnValues[1];

    console.log("txHash : " + txHash);
    console.log("num : " + num);
    console.log("address : " + address);
})

// Received()
//     .on("connected", function (subscriptionId) {
//         console.log(subscriptionId)
//     })
//     .on('MyEvent', async function (event) {
        
//         console.log("MyEvent : " ,event); // same results as the optional callback above

//         // let options = { upsert: true, new: true, setDefaultsOnInsert: true };
//         // await ContractModel.findOneAndUpdate({ contractAddress: event.returnValues.from.toLowerCase() }, {
//         //     "$push": {
//         //         "data": {
//         //             "totalSales": event.returnValues.totalSales,
//         //             "date": Date.now()
//         //         }
//         //     }
//         // }, options);
//     })
//     .on('changed', function (event) {
//         // remove event from local database
//     })
//     .on('error', function (error, receipt) {
//         // If the transaction was rejected by the network with a receipt, the second parameter will be the receipt.
//     });