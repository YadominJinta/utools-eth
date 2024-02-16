const cp = require('child_process');

SCAN_URL = {
    eth: "https://etherscan.io",
    bsc: "https://bscscan.com",
    polygon: "https://polygonscan.com",
    fantom: "https://ftmscan.com",
    gnosis: "https://gnosisscan.io",
    optimism: "https://optimistic.etherscan.io",
    arbitrum: "https://arbiscan.io"
}

const defaultList = (chain) => [
    {
        title: '请输入 address/hash',
        description: '',
        icon: `assets/etherscan_${chain}.png`,
        id: 'null'
    },
];


const openSelect = (chain, itemData) => {
    const start = (process.platform == 'darwin' ? 'open' : process.platform == 'win32' ? 'start' : 'xdg-open');
    let url = ''
    switch (itemData.id) {
        case 'scan_address':
            url = `${SCAN_URL[chain]}/address/${itemData.description}`;
            break;
        case 'blockscan':
            
            url = chain === "eth" ? `https://vscode.blockscan.com/ethereum/${itemData.description}` :
                                    `https://vscode.blockscan.com/${chain}/${itemData.description}` ;
            break;
        case 'scan_tx':
            url = `${SCAN_URL[chain]}/tx/${itemData.description}`;
            break;
        case 'scan_block':
            url = `${SCAN_URL[chain]}/block/${itemData.description}`
            break;
        case 'blocksec':
            url = `https://phalcon.blocksec.com/explorer/tx/${chain}/${itemData.description}`;
            break;
        case 'null':
            return window.utools.showNotification('please input address');
        default:
            return window.utools.showNotification('unsupport action');    
    }
    cp.exec(`${start} ${url}`, (error, stdout, stderr) => {
        if (error) return window.showNotification(stderr);
    })
}

function genArgs(chain) {
    return {
        enter: (action, callbackSetList) => {
            callbackSetList(defaultList)
        },
        search: (action, searchWord, callbackSetList) => {
            if (searchWord.length === 42) {
                callbackSetList([
                    {
                        title: "Etherscan Address Detail",
                        description: searchWord,
                        icon: `assets/etherscan.png`,
                        id: 'scan_address',
                    },
                    {
                        title: 'Blockscan IDE',
                        description: searchWord,
                        icon: 'assets/vscode.png',
                        id: 'blockscan'
                    }
                ])
            } else if (searchWord.length === 66) {
                    callbackSetList([
                    {
                        title: 'Etherscan Transaction Detail',
                        description: searchWord,
                        icon: 'assets/etherscan.png',
                        id: 'scan_tx'
                    },
                    {
                        title: 'Etherscan Block Detail',
                        description: searchWord,
                        icon: 'assets/etherscan.png',
                        id: 'scan_block'
                    },
                    {
                        title: 'Blocksec Transaction Analyze',
                        description: searchWord,
                        icon: 'assets/blocksec.png',
                        id: 'blocksec'
                    }
                ]) 
            } else {
                callbackSetList(defaultList)
            }
        },
        select: (action, itemData) => {
            openSelect(chain, itemData);
        }
    }
}


window.exports = {
    eth: { mode: "list", args: genArgs("eth") },
    bsc: { mode: "list", args: genArgs("bsc") },
    polygon: { mode: "list", args: genArgs("polygon") },
    optimism: { mode: "list", args: genArgs("optimism") },
    gnosis: { mode: "list", args: genArgs("gnosis") },
    fantom: { mode: "list", args: genArgs("fantom") },
    arbitrum: { mode: "list", args: genArgs("arbitrum") }
}