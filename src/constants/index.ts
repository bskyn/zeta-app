export const ALCHEMY_PRICE_API_URL = `https://api.g.alchemy.com/prices/v1/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}/tokens/by-address`;

export const TestnetToMainnetTokenMap = {
  // Zeta
  '0x0000c304d2934c00db1d51995b9f6996affd17c0':
    '0xf091867EC603A6628eD83D274E835539D82e9cc8',
  // Pepe
  '0x1663ab6272c5736fa9616cdf9f7917c1aa361854':
    '0x6982508145454Ce325dDbE47a25d4ec3d2311933',
  // SuperRare
  '0x54fa517f05e11ffa87f4b22ae87d91cec0c2d7e1':
    '0xba5BDe662c17e2aDFF1075610382B9B691296350',
  // HarryPotterTrumpSonic100Inu
  '0xb561c9197130f411b0060e7ce945ab2b17a00633':
    '0x7099aB9E42Fa7327a6b15E0a0c120c3e50d11BeC',
  // Tron
  '0xdcf5d3e08c5007dececdb34808c49331bd82a247':
    '0x50327c6c5a14DCaDE707ABad2E27eB517df87AB5',
  // WETH
  '0xfff9976782d46cc05630d1f6ebab18b2324d6b14':
    '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
  '0x05ba149a7bd6dc1f937fa9046a9e05c05f3b18b0':
    '0x05ba149a7bd6dc1f937fa9046a9e05c05f3b18b0',
};
