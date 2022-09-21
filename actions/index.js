const IpfsHttpClient = require("ipfs-http-client");
const { globSource } = IpfsHttpClient;
// const ipfs = IpfsHttpClient({host: 'ipfs.infura.io', port: 5001, protocol: 'https'})
const ipfs = IpfsHttpClient({
  host: "ipfs.infura.io",
  port: 8081,
  protocol: "http",
});

async function fun() {
  const file = await ipfs.add(
    globSource("..\\public\\images\\1602020133562-a.png", { recursive: true })
  );

  console.log("File : ", file);
}

fun();

// QmTKnyMxrXhJwc2UqceLM3XCjiiscPd2WC9oifjWMiiDae
//https://bafybeickcizgkr4rbjzcorpbpjujqvm4cpagnh6nwqacttzavdsj6jrea4.ipfs.infura-ipfs.io/
