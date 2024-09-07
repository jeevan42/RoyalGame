import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address } from "@graphprotocol/graph-ts"
import { Gamemember } from "../generated/Contract/Contract"

export function createGamememberEvent(
  clubId: BigInt,
  creator: Address,
  priceFeed: BigInt,
  predictedPrice: BigInt
): Gamemember {
  let gamememberEvent = changetype<Gamemember>(newMockEvent())

  gamememberEvent.parameters = new Array()

  gamememberEvent.parameters.push(
    new ethereum.EventParam("clubId", ethereum.Value.fromUnsignedBigInt(clubId))
  )
  gamememberEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  gamememberEvent.parameters.push(
    new ethereum.EventParam(
      "priceFeed",
      ethereum.Value.fromUnsignedBigInt(priceFeed)
    )
  )
  gamememberEvent.parameters.push(
    new ethereum.EventParam(
      "predictedPrice",
      ethereum.Value.fromUnsignedBigInt(predictedPrice)
    )
  )

  return gamememberEvent
}
