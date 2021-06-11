import {useState, useEffect} from 'react';
import Web3 from 'web3';

const Agent = ({instance}) => {

    const [condition, setCondition] = useState(false);
    const [display, setDisplay] = useState({display: 'none'});
    const [classList, setClassList] = useState('alert alert-success mt-4');
    const [message, setMessage] = useState('');
    const [account, setAccount] = useState();
    const [txHash, setTxHash] = useState();

    const handleCondition = () => {
        setCondition(true);
        setClassList('alert alert-success mt-4');
        setDisplay({display: 'block'});
        setMessage('Condition has been met!');

        instance.methods.setCondition().send({from: account})
            .then(res => {
                console.log(res);
                setTxHash(res.transactionHash);
            }).catch(err => console.error(err));
    }

    useEffect(async () => {
        if (window.ethereum) {
            window.ethereum.enable().then(async data => {}).catch(console.error);

            let web3 = new Web3(window.ethereum);
            let _accounts = await web3.eth.getAccounts();

     
            if(_accounts[0]){
                setAccount(_accounts[0]);
            }
        }
    }, []);

    const handleReleaseFunds = () => {
        setDisplay({display: 'block'});
        if(!condition){
            setClassList('alert alert-danger mt-4');
            setDisplay({display: 'block'});
            setMessage('Condition has yet not been fulfilled!');
            return;
        }
        
        instance.methods.releaseFunds().send({from: account})
            .then(res => {
                console.log(res);
                setTxHash(res.transactionHash);
                setClassList('alert alert-success mt-4');
                setMessage('Funds have been released to seller.');
            }).catch(err => {
                console.error(err);
                setClassList('alert alert-danger mt-4');
                setMessage('Error while releasing funds!');
            });

        
    }

    const handleRefundFunds = () => {
        setDisplay({display: 'block'});
        if(condition){
            setClassList('alert alert-danger mt-4');
            setDisplay({display: 'block'});
            setMessage('Condition has been fulfilled. Funds cannot be refunded now!');
            return;
        }

        instance.methods.revertFunds().send({from: account})
            .then(res => {
                console.log(res);
                setTxHash(res.transactionHash);
                setClassList('alert alert-success mt-4');
                setMessage('Funds have been refunded to buyer.');
            }).catch(err => {
                console.error(err);
                setClassList('alert alert-danger mt-4');
                setMessage('Error while reverting funds!');
            });

        
    }

    return(
        <div className='d-flex align-items-center flex-column pt-2' >
            <h3>Agent panel</h3>
            <div className='w-25 flex-column mt-1'>
                <button type='text' 
                    className="form-control btn-primary"
                    onClick={handleCondition}>Confirm that condition is met</button>
                <button type='text' 
                    className="form-control btn-success mt-2"
                    onClick={handleReleaseFunds}>Release funds</button>
                <button type='text' 
                    className="form-control btn-warning mt-2"
                    onClick={handleRefundFunds}>Refund funds</button>
                <div className='mt-2'>
                    Transaction hash: {txHash}
                </div>
                <div className={classList} style={display} role="alert">
                    {message}
                </div>
            </div>
        </div>
    );
}

export default Agent;