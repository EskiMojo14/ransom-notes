# Ransom Notes

An online version of the excellent game Ransom Notes, made with TanStack Router and Supabase.

_Created entirely as a learning exercise. Ransom Notes is created by [Very Special Games](https://www.veryspecialgames.co.uk/) - I recommend you buy it!_

## Gameplay

### Game creation

First, a user must create a game, choosing a few game rules during setup.

- Points needed to win
- Voting mode

#### Voting mode

In **judge** mode, an order of judges is set at the start of the game. Each round, the next judge in the order is selected. The judge does not submit an answer for the round, instead picking a winner out of the answers submitted by other players.

In **jury** mode, all players submit an answer, then vote for their favourite. In the case of a tie, a point is awarded to each player involved in the tie.

In **executioner** mode, a judge is picked at random for each round. The judge does not submit an answer for the round, instead picking a winner out of the answers submitted by other players.

### Invitation

Once the game is created, an invite code will be visible. The creator of the game should share this invite code to any players they want to join.

Players can then enter this code into the join screen to be added to the game. Players can only join during setup - once a game has started, no players can be added.

Once the minimum amount of players (3) has been added, the game can be started by the creator.

### Rounds

Each player receives a "pool" of 75 words. A prompt is revealed, and players create a response using only the words available in their pool.

<!-- TODO: time limit? -->

Once all players have submitted answers, an answer is picked as the round winner (see [voting mode](#voting-mode)) and the player who submitted it gains a point.

Words used in answers are removed from the players' pool, and the pool is then replenished with new words.

The game then moves on to the next round.

### Win condition

The game ends when one player earns the required amount of points to win, by default 5.

## Potential future features

- Custom word/prompt packs
- Shrinking word pools (no replenishing after use)
- Text chat
