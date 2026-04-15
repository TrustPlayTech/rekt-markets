// OFAC SDN sanctioned Ethereum/EVM addresses
// Source: https://www.treasury.gov/ofac/downloads/sanctions/1.0/sdn_advanced.xml
// These are publicly listed sanctioned addresses
export const SANCTIONED_ADDRESSES: Set<string> = new Set([
  // Tornado Cash addresses
  '0x8589427373d6d84e98730d7795d8f6f8731fda16',
  '0x722122df12d4e14e13ac3b6895a86e84145b6967',
  '0xdd4c48c0b24039969fc16d1cdf626eab821d3384',
  '0xd90e2f925da726b50c4ed8d0fb90ad053324f31b',
  '0xd96f2b1cf787cd351e650ef65f66686e93a3bf36',
  '0x4736dcf1b7a3d580672cce6e7c65cd5cc9cfbfa9',
  '0xd4b88df4d29f5cedd6857912842cff3b20c8cfa3',
  '0x910cbd523d972eb0a6f4cae4618ad62622b39dbf',
  '0xa160cdab225685da1d56aa342ad8841c3b53f291',
  '0xfd8610d20aa15b7b2e3be39b396a1bc3516c7144',
  '0xf60dd140cff0706bae9cd734ac3683f16782adec',
  '0x22aaa7720ddd5388a3c0a3333430953c68f1849b',
  '0xba214c1c1928a32bffe790263e38b4af9bfcd659',
  '0xb1c8094b234dce6e03f10a5b673c1d8c69739a00',
  '0x527653ea119f3e6a1f5bd18fbf4714081d7b31ce',
  '0x58e8dcc13be9780fc42e8723d8ead4cf46943df2',
  '0xd691f27f38b395864ea86cfc7253969b409c362d',
  '0xaeaac358560e11f52454d997aaff2c5731b6f8a6',
  '0x1356c899d8c9467c7f71c195612f8a395abf2f0a',
  '0xa7e5d5a720f06526557c513402f2e6b5fa20b008',
  '0x03893a7c7463ae47d46bc7f091665f1893656003',
  '0x2717c5e28cf931733106c8b3bb0e9049b2db188f',
  '0x9ad122c22b14202b4490edaf288fdb3c7cb3ff5e',
  '0xfec8a60023265364d066a1212fde3930f6ae8da7',
  // Lazarus Group (North Korea)
  '0x098b716b8aaf21512996dc57eb0615e2383e2f96',
  '0xa0e1c89ef1a489c9c7de96311ed5ce5d32c20e4b',
  '0x3cffd56b47b7b41c56258d9c7731abadc360e460',
  '0x53b6936513e738f44fb50d2b9476730c0ab3bfc1',
  // Add more as needed - full list at https://www.treasury.gov/ofac/downloads/sdnlist.txt
].map(a => a.toLowerCase()))

export function isSanctioned(address: string): boolean {
  return SANCTIONED_ADDRESSES.has(address.toLowerCase())
}
