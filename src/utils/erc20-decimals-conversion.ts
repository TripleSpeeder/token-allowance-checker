import BN from 'bn.js'

export function toBaseUnit(value:string, decimals:BN) {
  const ten = new BN(10)
  const base = ten.pow(decimals)

  // Is it negative?
  let negative = (value.substring(0, 1) === '-')
  if (negative) {
    value = value.substring(1)
  }

  if (value === '.') { 
    throw new Error(
    `Invalid value ${value} cannot be converted to`
    + ` base unit with ${decimals.toString()} decimals.`)
  }

  // Split it into a whole and fractional part
  let comps = value.split('.')
  if (comps.length > 2) { throw new Error('Too many decimal points') }
  let whole = comps[0]
  let fraction = comps[1]

  if (!whole) { whole = '0' }
  if (!fraction) { fraction = '0' }
  const decimalsNumber = decimals.toNumber()
  if (fraction.length > decimalsNumber) {
    throw new Error('Too many decimal places') 
  }

  while (fraction.length < decimalsNumber) {
    fraction += '0'
  }

  const wholeBN = new BN(whole)
  const fractionBN = new BN(fraction)
  let wei = (wholeBN.mul(base)).add(fractionBN)

  if (negative) {
    wei = wei.neg()
  }

  return new BN(wei.toString(10), 10)
}