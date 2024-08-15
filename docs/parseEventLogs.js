function parseEventLogs(logs, type, chainId, latestBlockNumber) {
  // console.log(now() + " INFO parseEventLogs - logs: " + JSON.stringify(logs, null, 2));
  const erc721Interface = new ethers.utils.Interface(ERC721ABI);
  const erc1155Interface = new ethers.utils.Interface(ERC1155ABI);
  const records = [];
  for (const log of logs) {
    // console.log(now() + " INFO parseEventLogs - log: " + JSON.stringify(log));
    if (!log.removed) {
      const contract = log.address;
      let eventRecord = null;
      if (log.topics[0] == "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef") {
        // ERC-20 event Transfer(address indexed from, address indexed to, uint tokens);
        // ERC-721 event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);
        // console.log(now() + " INFO parseEventLogs - Transfer log: " + JSON.stringify(log));
        let [ from, to, tokensOrTokenId, tokens, tokenId ] = [ null, null, null, null, null ];
        if (log.topics.length == 4) {
          from = ethers.utils.getAddress('0x' + log.topics[1].substring(26));
          to = ethers.utils.getAddress('0x' + log.topics[2].substring(26));
          tokensOrTokenId = ethers.BigNumber.from(log.topics[3]).toString();
        } else if (log.topics.length == 3) {
          from = ethers.utils.getAddress('0x' + log.topics[1].substring(26));
          to = ethers.utils.getAddress('0x' + log.topics[2].substring(26));
          tokensOrTokenId = ethers.BigNumber.from(log.data).toString();
        // TODO: Handle 2
        } else if (log.topics.length == 1) {
          from = ethers.utils.getAddress('0x' + log.data.substring(26, 66));
          to = ethers.utils.getAddress('0x' + log.data.substring(90, 130));
          tokensOrTokenId = ethers.BigNumber.from('0x' + log.data.substring(130, 193)).toString();
        }
        if (from) {
          if (log.topics.length == 4) {
            eventRecord = { type: "Transfer", from, to, tokenId: tokensOrTokenId, eventType: "erc721" };
          } else {
            eventRecord = { type: "Transfer", from, to, tokens: tokensOrTokenId, eventType: "erc20" };
          }
        }
      } else if (log.topics[0] == "0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925") {
        // ERC-20 event Approval(address indexed owner, address indexed spender, uint tokens);
        // ERC-721 event Approval(address indexed owner, address indexed approved, uint256 indexed tokenId);
        // console.log(now() + " INFO parseEventLogs - Approval log: " + JSON.stringify(log));
        let [ owner, spender, tokens, tokenId ] = [ null, null, null, null ];
        if (log.topics.length == 4) {
          owner = ethers.utils.getAddress('0x' + log.topics[1].substring(26));
          spender = ethers.utils.getAddress('0x' + log.topics[2].substring(26));
          tokenId = ethers.BigNumber.from(log.topics[3]).toString();
          eventRecord = { type: "Approval", owner, spender, tokenId, eventType: "erc721" };
        } else if (log.topics.length == 3) {
          owner = ethers.utils.getAddress('0x' + log.topics[1].substring(26));
          spender = ethers.utils.getAddress('0x' + log.topics[2].substring(26));
          tokens = ethers.BigNumber.from(log.data).toString();
          eventRecord = { type: "Approval", owner, spender, tokens, eventType: "erc20" };
        }
      } else if (log.topics[0] == "0x17307eab39ab6107e8899845ad3d59bd9653f200f220920489ca2b5937696c31") {
        // ERC-721 event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
        // ERC-1155 event ApprovalForAll(address indexed owner, address indexed operator, bool approved);
        const owner = ethers.utils.getAddress('0x' + log.topics[1].substring(26));
        const operator = ethers.utils.getAddress('0x' + log.topics[2].substring(26));
        approved = ethers.BigNumber.from(log.data) > 0;
        // NOTE: Both erc1155 and erc721 fall in this category, but assigning all to erc721
        eventRecord = { type: "ApprovalForAll", owner, operator, approved, eventType: "erc721" };
      } else if (log.topics[0] == "0xc3d58168c5ae7397731d063d5bbf3d657854427343f4c083240f7aacaa2d0f62") {
        // ERC-1155 TransferSingle (index_topic_1 address operator, index_topic_2 address from, index_topic_3 address to, uint256 id, uint256 value)
        const logData = erc1155Interface.parseLog(log);
        const [operator, from, to, id, value] = logData.args;
        tokenId = ethers.BigNumber.from(id).toString();
        eventRecord = { type: "TransferSingle", operator, from, to, tokenId, value: value.toString(), eventType: "erc1155" };
      } else if (log.topics[0] == "0x4a39dc06d4c0dbc64b70af90fd698a233a518aa5d07e595d983b8c0526c8f7fb") {
        // ERC-1155 TransferBatch (index_topic_1 address operator, index_topic_2 address from, index_topic_3 address to, uint256[] ids, uint256[] values)
        const logData = erc1155Interface.parseLog(log);
        const [operator, from, to, ids, values] = logData.args;
        const tokenIds = ids.map(e => ethers.BigNumber.from(e).toString());
        eventRecord = { type: "TransferBatch", operator, from, to, tokenIds, values: values.map(e => e.toString()), eventType: "erc1155" };
      }
      if (eventRecord) {
        records.push( {
          chainId,
          blockNumber: parseInt(log.blockNumber),
          logIndex: parseInt(log.logIndex),
          txIndex: parseInt(log.transactionIndex),
          txHash: log.transactionHash,
          contract,
          ...eventRecord,
          confirmations: latestBlockNumber - log.blockNumber,
        });
      }

    }
  }
  // console.log(now() + " INFO parseEventLogs - records: " + JSON.stringify(records, null, 2));
  return records;
}
