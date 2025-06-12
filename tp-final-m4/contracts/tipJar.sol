// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

contract TipJar is ReentrancyGuard {
    address public owner;
    event NewTip(address indexed from, uint256 amount, string message);
    event Withdrawal(address indexed to, uint256 amount);

    struct Tipper {
        address from;
        uint256 amount;
        string message;
        uint256 timestamp;
    }

    Tipper[] private tips;

    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    constructor() {
        owner = msg.sender;
    }

    //Almacena las propinas
    function tip(string memory message) external payable {
        require(msg.value > 0, "Must send ETH to tip");
        tips.push(
            Tipper({
                from: msg.sender,
                amount: msg.value,
                message: message,
                timestamp: block.timestamp
            })
        );
        emit NewTip(msg.sender, msg.value, message);
    }

    //Solo el owner puede retirar
    function withdraw() external nonReentrant onlyOwner {
        uint256 _balance = address(this).balance;
        (bool success, ) = payable(owner).call{value: _balance}("");
        require(success, "Withdrawal failed");
        emit Withdrawal(owner, _balance);
    }

    //Devuelve el balance del contrato, accesible solo al owner
    function getBalance() external view onlyOwner returns (uint256) {
        return address(this).balance;
    }

    //Devuelve la cantidad de propinas recibidas
    function getTipsCount() external view returns (uint256) {
        return tips.length;
    }

    //Devuelve la propina en el índice `i`
    function getTip(uint256 i)
        external
        view
        returns (
            address from,
            uint256 amount,
            string memory message,
            uint256 timestamp
        )
    {
        Tipper storage t = tips[i];
        return (t.from, t.amount, t.message, t.timestamp);
    }

    //Devuelve todas las propinas
    function getAllTips() external view onlyOwner returns (Tipper[] memory) {
        return tips;
    }
}
