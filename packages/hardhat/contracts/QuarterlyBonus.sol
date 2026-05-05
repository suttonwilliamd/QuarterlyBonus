pragma solidity >=0.8.0 <0.9.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract QuarterlyBonus is ReentrancyGuard { 
    address payable private owner;
    address payable private burnWallet;
    mapping(address => bool) private Employees;
    
    address payable[] public aEmployees;
    uint256 public lastReset;
    uint256 public lastQtrPayout;
    uint256 private oneWeek;
    uint256 public quarterlyBonus;
    uint256 public thePot;
    uint256 private aDay;
    uint256 private round;
    uint256 private aQuarter;
    uint256 private approxGas;
    uint256 public payout;

    mapping(address => uint256) public magicEarnyPoints;
    mapping(address => uint256) private earningsPerSecond;
    mapping(address => uint256) private redeemable;
    mapping(address => uint256) private lastRedeem;

    event BuyIn(address indexed user, uint256 amount, uint256 timestamp);
    event Redeem(address indexed user, uint256 amount, uint256 timestamp);
    event Compound(address indexed user, uint256 amount, uint256 timestamp);
    event RoundReset(uint256 roundNumber, uint256 timestamp);
    event QuarterlyPayout(address[] employees, uint256 amountPerEmployee, uint256 timestamp);

    constructor() payable {
        owner = payable(0x502221275CdAB7502182979a26A3841e5F6C9Fca);
        burnWallet = payable(0xDeaDbeefdEAdbeefdEadbEEFdeadbeEFdEaDbeeF);
        lastReset = block.timestamp;
        lastQtrPayout = block.timestamp;
        thePot = msg.value;
        quarterlyBonus = 0;
        oneWeek = 604800;
        aDay = 86400;
        round = 0;
        aQuarter = 7890000;
        approxGas = 69651;
    }

    function getLastReset() public view returns (uint256) {
      return lastReset;
    }
    
    function hireEmployee(address payable _employee) private {
        Employees[_employee] = true;
        aEmployees.push(_employee);
    }

    function contains(address _employee) private view returns (bool) {
        return Employees[_employee];
    }

    function resetRound() private {
        for (uint256 i = 0; i < aEmployees.length; i++) {
            Employees[aEmployees[i]] = false;
        }
        delete aEmployees;
        round += 1;
        lastReset = block.timestamp;
        emit RoundReset(round, block.timestamp);
    }

    function buyin() external payable nonReentrant {
        if (
            magicEarnyPoints[msg.sender] + msg.value >= 85 finney &&
            !contains(msg.sender)
        ) {
            hireEmployee(payable(msg.sender));
        }

        if (block.timestamp - lastReset > oneWeek && thePot < 1 ether) {
            magicEarnyPoints[msg.sender] = 0;
            earningsPerSecond[msg.sender] = 0;
            redeemable[msg.sender] = 0;
            resetRound();
        }

        if (block.timestamp - lastQtrPayout > aQuarter) {
            if (aEmployees.length > 0) {
                payout = quarterlyBonus / aEmployees.length;

                address[] memory paidEmployees = new address[](aEmployees.length);
                for (uint256 i = 0; i < aEmployees.length; i++) {
                    paidEmployees[i] = aEmployees[i];
                    bool success = payable(aEmployees[i]).send(payout);
                    require(success, "Payout failed.");
                }
                emit QuarterlyPayout(paidEmployees, payout, block.timestamp);
            }
            delete aEmployees;
            lastQtrPayout = block.timestamp;
        }

        magicEarnyPoints[msg.sender] += msg.value;
        uint256 left = msg.value;
        uint256 devFee = msg.value / 13;

        bool devsuccess = payable(owner).send(devFee);
        require(devsuccess, ".send failed.");
        left -= devFee;
        
        quarterlyBonus += msg.value / 40;
        left -= msg.value / 40;
        
        bool burnsuccess = payable(burnWallet).send(msg.value / 256);
        require(burnsuccess, "Burn failed.");
        left -= msg.value / 256;
        
        thePot += left;
        
        if (lastRedeem[msg.sender] == 0) {
            lastRedeem[msg.sender] = block.timestamp;
        }
        
        emit BuyIn(msg.sender, msg.value, block.timestamp);
        calcRedeemable();
    }

    function calcRedeemable() private {
        if (lastRedeem[msg.sender] == 0) {
            lastRedeem[msg.sender] = block.timestamp;
        }
        uint256 timeSinceLastRedeem = block.timestamp - lastRedeem[msg.sender];

        earningsPerSecond[msg.sender] =
            magicEarnyPoints[msg.sender] /
            10 /
            aDay;
        redeemable[msg.sender] =
            earningsPerSecond[msg.sender] *
            timeSinceLastRedeem;
    }

    function getRedeemable() public returns (uint256) {
        calcRedeemable();
        return redeemable[msg.sender];
    }

    function redeem() public payable nonReentrant {
        uint256 amount = getRedeemable();
        
        if(amount > thePot)
            amount = thePot;
        uint256 pay = amount;
        uint256 devFee = amount / 13;

        bool devsuccess = payable(owner).send(devFee);
        require(devsuccess, "dev.send failed on redeem");
        pay -= devFee;
        quarterlyBonus += amount / 40;
        pay -= amount / 40;
        bool burnsuccess = payable(burnWallet).send(amount / 256);
        require(burnsuccess, "Burn failed.");
        pay -= amount / 256;

        bool success = payable(msg.sender).send(pay);
        require(success, "redeem.send failed.");

        thePot -= amount;
        lastRedeem[msg.sender] = block.timestamp;
        redeemable[msg.sender] = 0;
        
        emit Redeem(msg.sender, amount, block.timestamp);
    }

    function getMagicEarnyPoints() external view returns(uint256) {
        return magicEarnyPoints[msg.sender];
    }
    
    function compound() public nonReentrant {
        calcRedeemable();
        uint256 amount = redeemable[msg.sender];
        
        magicEarnyPoints[msg.sender] += redeemable[msg.sender];
        redeemable[msg.sender] = 0;
        
        emit Compound(msg.sender, amount, block.timestamp);
    }
}