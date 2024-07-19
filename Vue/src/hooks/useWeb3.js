import Web3 from "web3";
import VoteJSON from "../contract/Vote.json";

const useWeb3 = () => {
  const web3 = new Web3(
    Web3.givenProvider ||
    "wss://go.getblock.io/9a8aba0230e249d08a547eab6e5c18c2"
  );
  console.log("Web3 instance: ", web3);

  const contractAddrress = "0x139dad739F8D234B7C051A779E605b4BBBB3063b";
  const voteContract = new web3.eth.Contract(VoteJSON.abi, contractAddrress);
  console.log("Vote contract instance: ", voteContract);

  const getAccount = async () => {
    const accounts = await web3.eth.requestAccounts();
    console.log("Current account: ", accounts[0]);
    return accounts[0];
  };

  return {
    web3,
    voteContract,
    contractAddrress,
    getAccount,
  };
};

export default useWeb3;
