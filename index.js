const express = require("express");
const app = express();
const http = require("http");
const bodyParser = require("body-parser");
const axios = require("axios"); // Import 'axios' instead of 'request'
const moment = require("moment");
const apiRouter = require('./api');
const cors = require("cors");


const port = 5000;
const hostname = "localhost";
//const phoneNumber = 254112163919;
//const Amount = 20;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use('/', apiRouter);

const server = http.createServer(app);

// ACCESS TOKEN FUNCTION - Updated to use 'axios'
async function getAccessToken() {
  const consumer_key = "nk16Y74eSbTaGQgc9WF8j6FigApqOMWr"; // REPLACE IT WITH YOUR CONSUMER KEY
  const consumer_secret = "40fD1vRXCq90XFaU"; // REPLACE IT WITH YOUR CONSUMER SECRET
  const url =
    "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";

  const auth =
    "Basic " +
    new Buffer.from(consumer_key + ":" + consumer_secret).toString("base64");

  try {
    const response = await axios.get(url, {
      headers: {
        Authorization: auth,
      },
    });
    const accessToken = response.data.access_token;
    return accessToken;
  } catch (error) {
    throw error;
  }
}

app.get("/", (req, res) => {
  res.send("Welcome to Solve Payment Menthod(Mpesa)");
  var timeStamp = moment().format("YYYYMMDDHHmmss");
  console.log(timeStamp);
});

//ACCESS TOKEN ROUTE
app.get("/access_token", (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      res.send("😀 Your access token is " + accessToken);
    })
    .catch(console.log);
});

//MPESA STK PUSH ROUTE
// app.post("/stkpush", (req, res) => {
//   getAccessToken()
//     .then((accessToken) => {
//       const {phoneNumber,Amount} = req.body;
      
//       console.log(phoneNumber)
//       // return;
//       // const phoneNumber = 254791072861;
//       // const Amount = 20;
//       const url =
//         "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
//       const auth = "Bearer " + accessToken;
//       const timestamp = moment().format("YYYYMMDDHHmmss");
//       const password = new Buffer.from(
//         "174379" +
//           "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
//           timestamp
//       ).toString("base64");

//       axios
//         .post(
//           url,
//           {
//             BusinessShortCode: "174379",
//             Password: password,
//             Timestamp: timestamp,
//             TransactionType: "CustomerPayBillOnline",
//             Amount: Amount,
//             PartyA: phoneNumber,
//             PartyB: "174379",
//             PhoneNumber: phoneNumber,
//             CallBackURL: "https://laundryappstk.vercel.app/callbackreq",
//             AccountReference: "Laundro",
//             TransactionDesc: "Laundry API stk push",
//           },
//           {
//             headers: {
//               Authorization: auth,
//             },
//           }
//         )
//         .then((response) => {
//           res.send("😀 Request is successful done ✔✔. Please enter mpesa pin to complete the transaction");
//           console.log(response.data.CheckoutRequestID);
//         })
//         .catch((error) => {
//           console.log(error);
//           res.status(500).send("❌ Request failed");
//         });
//     })
//     .catch(console.log);
// });
app.post("/stkpush", (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      const { phoneNumber, Amount } = req.body;

      

      const url =
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
      const auth = "Bearer " + accessToken;
      const timestamp = moment().format("YYYYMMDDHHmmss");
      const password = new Buffer.from(
        "174379" +
        "bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919" +
        timestamp
      ).toString("base64");

      axios
        .post(
          url,
          {
            BusinessShortCode: "174379",
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: Amount,
            PartyA: `254${phoneNumber}`,
            PartyB: "174379",
            PhoneNumber: `254${phoneNumber}`,
            CallBackURL: "https://a551-102-219-208-66.ngrok-free.app/callbackreq",
            AccountReference: "Laundro",
            TransactionDesc: "Laundry API stk push",
          },
          {
            headers: {
              Authorization: auth,
            },
          }
        )
        .then((response) => {
          res.send("😀 Request is successful done ✔✔. Please enter mpesa pin to complete the transaction");
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send("❌ Request failed");
        });
    })
    .catch(console.log);
});


// REGISTER URL FOR C2B
// app.get("/registerurl", (req, resp) => {
//   getAccessToken()
//     .then((accessToken) => {
//       const url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
//       const auth = "Bearer " + accessToken;
//       axios
//         .post(
//           url,
//           {
//             ShortCode: "174379",
//             ResponseType: "Complete",
//             ConfirmationURL: "http://example.com/confirmation",
//             ValidationURL: "http://example.com/validation",
//           },
//           {
//             headers: {
//               Authorization: auth,
//             },
//           }
//         )
//         .then((response) => {
//           resp.status(200).json(response.data);
//         })
//         .catch((error) => {
//           console.log(error);
//           resp.status(500).send("❌ Request failed");
//         });
//     })
//     .catch(console.log);
// });


app.get('/registerurl', (req,resp)=>{
  getAccessToken()
  .then((accessToken)=>{
    let url = "https://sandbox.safaricom.co.ke/mpesa/c2b/v1/registerurl";
    let auth = "Bearer " + accessToken;

    request(
      {
        url:url,
        method:"POST",
        headers:{
          Authorization:auth
        },
        json:{
          ShortCode:"174379",
          ResponseType:"Complete",
          ConfirmationURL:"http://example.com/confirmation",
          ValidationURL:"http://example.com/validation"
        },
      },

      function(error,response,body){
        if(error){
          console.log(error);
        }
        resp.status(200).json(body);
      }
    );
  })
  .catch(console.log);
});

app.get("/confirmation", (req, res) => {
  console.log("All transaction will be sent to this URL");
  console.log(req.body);
});


app.post('/callbackreq',(req,res)=>{
  const callbackData = req.body;
  console.log("callback data:",callbackData.Body)
  if(!callbackData.Body.CallbackMetadata){
    console.log(callbackData.Body)
    return res.json("ok")
  }

  console.log(callbackData.Body.CallbackMetadata);
})

app.get("/validation", (req, resp) => {
  console.log("Validating payment");
  console.log(req.body);
});

// B2C ROUTE OR AUTO WITHDRAWAL
app.get("/b2curlrequest", (req, res) => {
  getAccessToken()
    .then((accessToken) => {
      const securityCredential =
        "N3Lx/hisedzPLxhDMDx80IcioaSO7eaFuMC52Uts4ixvQ/Fhg5LFVWJ3FhamKur/bmbFDHiUJ2KwqVeOlSClDK4nCbRIfrqJ+jQZsWqrXcMd0o3B2ehRIBxExNL9rqouKUKuYyKtTEEKggWPgg81oPhxQ8qTSDMROLoDhiVCKR6y77lnHZ0NU83KRU4xNPy0hRcGsITxzRWPz3Ag+qu/j7SVQ0s3FM5KqHdN2UnqJjX7c0rHhGZGsNuqqQFnoHrshp34ac/u/bWmrApUwL3sdP7rOrb0nWasP7wRSCP6mAmWAJ43qWeeocqrz68TlPDIlkPYAT5d9QlHJbHHKsa1NA==";
      const url = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
      const auth = "Bearer " + accessToken;
      axios
        .post(
          url,
          {
            InitiatorName: "testapi",
            SecurityCredential: securityCredential,
            CommandID: "PromotionPayment",
            Amount: "1",
            PartyA: "600996",
            PartyB: "254112163919",
            Remarks: "Withdrawal",
            QueueTimeOutURL: "https://mydomain.com/b2c/queue",
            ResultURL: "https://mydomain.com/b2c/result",
            Occasion: "Withdrawal",
          },
          {
            headers: {
              Authorization: auth,
            },
          }
        )
        .then((response) => {
          res.status(200).json(response.data);
        })
        .catch((error) => {
          console.log(error);
          res.status(500).send("❌ Request failed");
        });
    })
    .catch(console.log);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
