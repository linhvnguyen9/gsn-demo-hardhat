const fs = require('fs');
const { RelayProvider } = require('@opengsn/provider')
const { GsnTestEnvironment } = require('@opengsn/dev' )
const hre = require("hardhat");
const Web3HttpProvider = require( 'web3-providers-http')
const rinkebyConfig = JSON.parse(fs.readFileSync('rinkeby.json').toString());

async function main() {
    let forwarderAddress = '0x83A54884bE4657706785D7309cf46B58FE5f6e8a'
    const paymasterAddress = '0xE38786Bc6135Fc847339b5Cc9ad34055259aD2b6'

    const web3provider = new Web3HttpProvider(rinkebyConfig.url)

    // let factory = await hre.ethers.getContractFactory('AcceptEverythingPaymaster')
    // var paymaster = await factory.deploy()
    // let paymasterAddress = await paymaster.address
    // await paymaster.setRelayHub('0x6650d69225CA31049DB7Bd210aE4671c0B1ca132')
    // await paymaster.setTrustedForwarder(forwarderAddress)
    // const tx = await signer.sendTransaction({
    //     to: paymasterAddress,
    //     value: ethers.utils.parseEther("0.1")
    // });

    console.log('Paymaster deployed at ', paymasterAddress);

    var counter = await hre.ethers.getContractAt('Counter', '0xA4478c406ff475158F0b3192cAf9EDe02382A3f3')
    
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
  