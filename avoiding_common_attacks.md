# Avoiding Common Attacks

* **Using Specific Compiler Pragma**: Rarity game is using Solc 0.8.4 only
* **Use Modifiers Only for Validation**: The Rarity Game uses the ownable modifier only to validate onlyOwner
* **Pull Over Push**: The Rarity Game does not push rewards, but rather they are pulled by individual users
* **Checks-Effects-Interactions (Avoiding state changes after external calls)**: The Rarity Game updates a users reward balance before sending the reward value
* **Re-entrancy**: The Rarity Game updates a users reward balance before sending the reward value so that a bad actor cannot call back the contract and claim more rewards before the balance is updated