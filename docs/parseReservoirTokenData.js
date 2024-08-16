function parseReservoirTokenData(info) {
  // console.log("info: " + JSON.stringify(info, null, 2));
  const result = {};
  const token = info.token;
  const market = info.market;
  result.chainId = token.chainId;
  result.contract = ethers.utils.getAddress(token.contract);
  result.type = token.kind;
  result.tokenId = token.tokenId;
  try {
    result.owner = ethers.utils.getAddress(token.owner);
  } catch (e) {
    console.log("parseReservoirTokenData - ERROR: name: " + name + ", owner: " + token.owner + ", error: " + e.message + " info: " + JSON.stringify(info, null, 2));
    result.owner = ADDRESS0;
  }
  result.slug = token.collection && token.collection.slug || null;
  result.collectionSymbol = token.collection && token.collection.symbol || null;
  result.collectionName = token.collection && token.collection.name || null;
  result.name = token.name;
  result.description = token.description;
  // if (token.image == null && token.metadata && token.metadata.tokenURI) {
  //   result.image = token.metadata.tokenURI;
  // } else {
    result.image = token.image;
  // }
  result.attributes = [];
  if (token.attributes) {
    for (const attribute of token.attributes) {
      // result.attributes.push({ trait_type: attribute.key, value: attribute.value });
      result.attributes.push([ attribute.key, attribute.value ]);
    }
  }
  // const createdRecord = token.attributes.filter(e => e.key == "Created Date");
  // result.created = createdRecord.length == 1 && createdRecord[0].value && parseInt(createdRecord[0].value) || null;
  // if (result.contract == ENS_BASEREGISTRARIMPLEMENTATION_ADDRESS) {
  //   const registrationRecord = token.attributes.filter(e => e.key == "Registration Date");
  //   result.registration = registrationRecord.length == 1 && registrationRecord[0].value && parseInt(registrationRecord[0].value) || null;
  // } else {
  //   result.registration = result.created;
  // }
  // if (result.contract == ENS_BASEREGISTRARIMPLEMENTATION_ADDRESS) {
  //   const expiryRecord = token.attributes.filter(e => e.key == "Expiration Date");
  //   result.expiry = expiryRecord.length == 1 && expiryRecord[0].value && parseInt(expiryRecord[0].value) || null;
  // } else {
  //   const expiryRecord = token.attributes.filter(e => e.key == "Namewrapper Expiry Date");
  //   result.expiry = expiryRecord.length == 1 && expiryRecord[0].value && parseInt(expiryRecord[0].value) || null;
  // }
  // const characterSetRecord = token.attributes.filter(e => e.key == "Character Set");
  // result.characterSet = characterSetRecord.length == 1 && characterSetRecord[0].value || null;
  // const lengthRecord = token.attributes.filter(e => e.key == "Length");
  // result.length = lengthRecord.length == 1 && lengthRecord[0].value && parseInt(lengthRecord[0].value) || null;
  // const segmentLengthRecord = token.attributes.filter(e => e.key == "Segment Length");
  // result.segmentLength = segmentLengthRecord.length == 1 && segmentLengthRecord[0].value && parseInt(segmentLengthRecord[0].value) || null;
  const lastSaleTimestamp = token.lastSale && token.lastSale.timestamp || null;
  const lastSaleCurrency = token.lastSale && token.lastSale.price && token.lastSale.price.currency && token.lastSale.price.currency.symbol || null;
  const lastSaleAmount = token.lastSale && token.lastSale.price && token.lastSale.price.amount && token.lastSale.price.amount.native || null;
  const lastSaleAmountUSD = token.lastSale && token.lastSale.price && token.lastSale.price.amount && token.lastSale.price.amount.usd || null;
  if (lastSaleAmount) {
    result.lastSale = {
      timestamp: lastSaleTimestamp,
      currency: lastSaleCurrency,
      amount: lastSaleAmount,
      amountUSD: lastSaleAmountUSD,
    };
  } else {
    result.lastSale = null;
  }
  const priceExpiry = market.floorAsk && market.floorAsk.validUntil && parseInt(market.floorAsk.validUntil) || null;
  const priceSource = market.floorAsk && market.floorAsk.source && market.floorAsk.source.domain || null;
  const priceCurrency = market.floorAsk && market.floorAsk.price && market.floorAsk.price.currency && market.floorAsk.price.currency.symbol || null;
  const priceAmount = market.floorAsk && market.floorAsk.price && market.floorAsk.price.amount && market.floorAsk.price.amount.native || null;
  const priceAmountUSD = market.floorAsk && market.floorAsk.price && market.floorAsk.price.amount && market.floorAsk.price.amount.usd || null;
  if (priceAmount) {
    result.price = {
      source: priceSource,
      expiry: priceExpiry,
      currency: priceCurrency,
      amount: priceAmount,
      amountUSD: priceAmountUSD,
    };
  } else {
    result.price = null;
  }
  const topBidCurrency = market.topBid && market.topBid.price && market.topBid.price.currency && market.topBid.price.currency.symbol || null;
  const topBidAmount = market.topBid && market.topBid.price && market.topBid.price.amount && market.topBid.price.amount.native || null;
  const topBidAmountUSD = market.topBid && market.topBid.price && market.topBid.price.amount && market.topBid.price.amount.usd || null;
  const topBidNetAmount = market.topBid && market.topBid.price && market.topBid.price.netAmount && market.topBid.price.netAmount.native || null;
  const topBidNetAmountUSD = market.topBid && market.topBid.price && market.topBid.price.netAmount && market.topBid.price.netAmount.usd || null;
  if (topBidNetAmount) {
    result.topBid = {
      currency: topBidCurrency,
      amount: topBidAmount,
      amountUSD: topBidAmountUSD,
      netAmount: topBidNetAmount,
      netAmountUSD: topBidNetAmountUSD,
    };
  } else {
    result.topBid = null;
  }
  // console.log("result: " + JSON.stringify(result, null, 2));
  return result;
}
