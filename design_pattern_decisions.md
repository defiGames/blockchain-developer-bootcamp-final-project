# Design Pattern Decisions

* **Inheritance and Interfaces:**: The Rarity Game imports ownable.sol by OpenZepplin. 

* **Access Control Design Patterns**: The ownable modifier prevents bad actors from accessing functions that could change game parameters

* **Optimizing Gas**: I reduced my storage for my pattern variables from uint256 to uint8, a 32x reduction in storage usage!