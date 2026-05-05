const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("QuarterlyBonus", function () {
  async function deployFixture() {
    const [deployer, alice] = await ethers.getSigners();
    const fundedBalanceHex = "0x21e19e0c9bab2400000"; // 10,000 ETH
    await ethers.provider.send("hardhat_setBalance", [deployer.address, fundedBalanceHex]);
    await ethers.provider.send("hardhat_setBalance", [alice.address, fundedBalanceHex]);

    const Factory = await ethers.getContractFactory("QuarterlyBonus");
    const contract = await Factory.deploy();
    await contract.deployed();
    return { contract, deployer, alice };
  }

  it("accepts buyin and tracks points + employee state", async function () {
    const { contract, alice } = await deployFixture();

    await contract.connect(alice).buyin({ value: ethers.utils.parseEther("0.1") });

    const points = await contract.connect(alice).getMagicEarnyPoints();
    expect(points).to.equal(ethers.utils.parseEther("0.1"));

    const employeeAddress = await contract.aEmployees(0);
    expect(employeeAddress).to.equal(alice.address);
  });

  it("accrues redeemable amount over time", async function () {
    const { contract, alice } = await deployFixture();

    await contract.connect(alice).buyin({ value: ethers.utils.parseEther("1") });
    await ethers.provider.send("evm_increaseTime", [86400]);
    await ethers.provider.send("evm_mine", []);

    const redeemable = await contract.connect(alice).callStatic.getRedeemable();
    expect(redeemable).to.be.gt(0);
  });

  it("allows redeem after accrual", async function () {
    const { contract, alice } = await deployFixture();

    await contract.connect(alice).buyin({ value: ethers.utils.parseEther("1") });
    await ethers.provider.send("evm_increaseTime", [2 * 86400]);
    await ethers.provider.send("evm_mine", []);

    const before = await ethers.provider.getBalance(alice.address);
    const tx = await contract.connect(alice).redeem();
    const receipt = await tx.wait();
    const gasCost = receipt.gasUsed.mul(receipt.effectiveGasPrice);
    const after = await ethers.provider.getBalance(alice.address);

    expect(after.add(gasCost)).to.be.gt(before);
  });

  it("does not double-count accrual immediately after compounding", async function () {
    const { contract, alice } = await deployFixture();

    await contract.connect(alice).buyin({ value: ethers.utils.parseEther("1") });
    await ethers.provider.send("evm_increaseTime", [86400]);
    await ethers.provider.send("evm_mine", []);

    const beforeCompound = await contract.connect(alice).callStatic.getRedeemable();
    expect(beforeCompound).to.be.gt(0);

    await contract.connect(alice).compound();
    const immediate = await contract.connect(alice).callStatic.getRedeemable();
    expect(immediate).to.equal(0);
  });
});
