import { Gamemember as GamememberEvent } from "../generated/Contract/Contract"
import { Gamemember } from "../generated/schema"

export function handleGamemember(event: GamememberEvent): void {
  let entity = new Gamemember(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.clubId = event.params.clubId
  entity.creator = event.params.creator
  entity.priceFeed = event.params.priceFeed
  entity.predictedPrice = event.params.predictedPrice

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
