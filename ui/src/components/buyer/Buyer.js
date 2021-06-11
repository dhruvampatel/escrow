import {useState, useEffect} from 'react';
import Web3 from 'web3';

const Buyer = ({instance}) => {

    const [agentAddress, setAgentAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [display, setDisplay] = useState({display: 'none'});
    const [account, setAccount] = useState();
    const [message, setMessage] = useState('Payment done successfully!');
    const [agentSelected, setAgentSelected] = useState(false);
    const [web3, setWeb3] = useState();
    const [txHash, setTxHash] = useState();

    useEffect(async () => {
        if (window.ethereum) {
            window.ethereum.enable().then(async data => {}).catch(console.error);

            let _web3 = new Web3(window.ethereum);
            let _accounts = await _web3.eth.getAccounts();

            setWeb3(_web3);
     
            if(_accounts[0]){
                setAccount(_accounts[0]);
            }
        }
    }, []);

    const selectAgent = () => {
        setDisplay({display: 'block'});
        if(!account){
            setMessage('Please sign in using metamask to use the platform.');
            return;
        }
        
        instance.methods.chooseAgent(agentAddress).send({from: account})
            .then(res => {
                console.log(res);
                setTxHash(res.transactionHash);
                setMessage('Agent selected successfully!');
                setAgentSelected(true);
            })
            .catch(err => {
                console.error(err);
                setMessage('Error while selecting agent');
                setAgentSelected(false);
            });
        
    }

    const pay = () => {
        setDisplay({display: 'block'});
        if(!agentSelected){
            setMessage('Please select agent first.');
            return;
        }

        web3.eth.sendTransaction({
            from: account,
            to: '0xfFB823adAe675e1002a21C5cadDD471a2e07950D',
            value: amount
        }).then(res => {
            console.log(res);
            setTxHash(res.transactionHash);
            setMessage('Payment done successfully!');
          })
          .catch(err => {
            console.error(err);
            setMessage('Error while paying!');
          });
    }

    return(
        <div className='d-flex align-items-center flex-column pt-2' >
            <h3>Buyer panel</h3>
            <div
                className='w-25 flex-column mt-1'>
                <label>Choose an agent</label>
                <input type='text' placeholder='Enter agent address here' 
                    className="form-control mb-2"
                    value={agentAddress}
                    onChange={e => setAgentAddress(e.target.value)}/>
                <label>Enter amount you wish to pay</label>
                <input type='number' placeholder='Enter amount in wei (1 ether = 1 * 10^18)' 
                    className="form-control"
                    value={amount}
                    onChange={e => setAmount(e.target.value)}/>
                <div className='d-flex flex-row justify-content-around'>
                    <button 
                        value='Pay ether' 
                        className='form-control btn-primary mt-2'
                        style={{marginRight: '5px'}}
                        onClick={selectAgent}>Select agent</button>
                    <button
                        className='form-control btn-success mt-2'
                        style={{marginLeft: '5px'}}
                        onClick={pay}>Pay</button>
                </div>
                <div className='mt-2'>
                    Transaction hash: {txHash}
                </div>
                <div className="alert alert-success mt-4" style={display} role="alert">
                    {message}
                </div>
            </div>
        </div>
    );
}

export default Buyer;