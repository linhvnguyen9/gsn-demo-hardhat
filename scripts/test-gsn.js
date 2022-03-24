const { RelayProvider } = require('@opengsn/provider')
const { GsnTestEnvironment } = require('@opengsn/dev' )
const hre = require("hardhat");
const Web3HttpProvider = require( 'web3-providers-http')

async function main() {
    let env = await GsnTestEnvironment.startGsn('localhost')

    const { paymasterAddress, forwarderAddress } = env.contractsDeployment

    const web3provider = new Web3HttpProvider('http://localhost:8545')
    const deploymentProvider = new hre.ethers.providers.Web3Provider(web3provider)

    const factory = await hre.ethers.getContractFactory('Counter', deploymentProvider.getSigner())

        var counter = await factory.deploy(forwarderAddress)
        await counter.deployed()

        const config = await {
            // loggerConfiguration: { logLevel: 'error'},
            paymasterAddress: paymasterAddress,
            auditorsCount: 0
        }

        let gsnProvider = RelayProvider.newProvider({provider: web3provider, config})
    	await gsnProvider.init()

        const account = new hre.ethers.Wallet(Buffer.from('1'.repeat(64),'hex'))
        gsnProvider.addAccount(account.privateKey)
    	from = account.address

        const etherProvider = new hre.ethers.providers.Web3Provider(gsnProvider)
        counter = counter.connect(etherProvider.getSigner(from))

        const countBefore = await counter.counter()
        await counter.increment( { gasLimit: 1e6 } )
        const countAfter = await counter.counter()
        counterChange = countAfter - countBefore
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
  