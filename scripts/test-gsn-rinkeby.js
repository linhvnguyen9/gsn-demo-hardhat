const fs = require('fs');
const { RelayProvider } = require('@opengsn/provider')
const { GsnTestEnvironment } = require('@opengsn/dev' )
const hre = require("hardhat");
const Web3HttpProvider = require( 'web3-providers-http')
const rinkebyConfig = JSON.parse(fs.readFileSync('rinkeby.json').toString());

async function main() {
    let paymasterAddress = '0xA6e10aA9B038c9Cddea24D2ae77eC3cE38a0c016'
    let forwarderAddress = '0x83A54884bE4657706785D7309cf46B58FE5f6e8a'

    const web3provider = new Web3HttpProvider(rinkebyConfig.url)

    var counter = await hre.ethers.getContractAt('Counter', '0xA4478c406ff475158F0b3192cAf9EDe02382A3f3')

    // let factory = await hre.ethers.getContractFactory('Counter')
    // var counter = await factory.deploy(forwarderAddress)
    
    await counter.deployed()

    let deployedContractAddress = await counter.address

    console.log('deploy contract success at ', deployedContractAddress);

    const config = await {
        // loggerConfiguration: { logLevel: 'error'},
        paymasterAddress: paymasterAddress,
        auditorsCount: 0
    }

    let gsnProvider = RelayProvider.newProvider({provider: web3provider, config})
    await gsnProvider.init()

    console.log('GSN provider init success');

    const account = hre.ethers.Wallet.createRandom()
    gsnProvider.addAccount(account.privateKey)
    from = account.address

    console.log('Created account address ', from)

    const etherProvider = new hre.ethers.providers.Web3Provider(gsnProvider)
    counter = counter.connect(etherProvider.getSigner(from))

    const countBefore = await counter.counter()
    await counter.increment( { gasLimit: 1e6 } )
    const countAfter = await counter.counter()
    counterChange = countAfter - countBefore
    console.log('Before', countBefore)
    console.log('After', countAfter)
    console.log(counterChange)
    const balance = await counter.provider.getBalance(from)
    console.log(balance.toString())
    const lastCaller = await counter.lastCaller()
    console.log(lastCaller, from)
}
  
main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
  