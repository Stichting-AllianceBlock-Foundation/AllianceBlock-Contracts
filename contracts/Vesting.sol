//"SPDX-License-Identifier: UNLICENSED"
pragma solidity 0.6.12;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./PercentageCalculator.sol";

contract Vesting is Ownable {
    uint256 public startDate;
    uint256 periodLength = 30 days;
    uint256 totalPeriods = 24;
    uint256[24] public cumulativeAmountsToVest;
    IERC20 token;

    struct Recipient {
        uint256 withdrawnAmount;
        uint256 withdrawPercetange;
    }

    uint256 public totalRecipients = 0;
    mapping(address => Recipient) public recipients;

    event LogStartDateSet(address setter, uint256 startDate);
    event LogRecipientAdded(address recipient, uint256 withdrawPercentage);
    event LogTokensClaimed(address recipient, uint256 amount);

    //Note: Percentages will be multiplied by 1000 to be stored with 3 digit after the decimal point
    modifier onlyValidPercentages(uint256 _percentage) {
        require(
            _percentage < 100000,
            "Provided percentage should be less than 100%"
        );
        require(
            _percentage > 0,
            "Provided percentage should be greater than 0"
        );
        _;
    }

    /**
     * @param _tokenAddress The address of the ALBT token
     * @param _cumulativeAmountsToVest The cumulative amounts for each vesting period
     */
    constructor(
        address _tokenAddress,
        uint256[24] memory _cumulativeAmountsToVest
    ) public {
        require(
            _tokenAddress != address(0),
            "Token Address can't be zero address"
        );
        require(
            _cumulativeAmountsToVest.length > 0,
            "Vesting schedule amounts are missing"
        );
        require(
            _cumulativeAmountsToVest.length < 25,
            "Vesting schedule is greater than two years"
        );
        token = IERC20(_tokenAddress);
    }

    /**
     * @dev Function that sets the start date of the Vesting
     * @param _startDate The start date of the veseting presented as a timestamp
     */
    function setStartDate(uint256 _startDate) public onlyOwner {
        require(_startDate > 0, "Start Date can't be zero");
        require(_startDate >= now, "Start Date can't be in the past");

        startDate = _startDate;
        emit LogStartDateSet(address(msg.sender), _startDate);
    }

    /**
     * @dev Function add recipient to the vesting contract
     * @param _recipientAddress The address of the recipient
     * @param _withdrawPercentage The percentage that the recipient should receive in each vestin period
     */
    function addRecipient(
        address _recipientAddress,
        uint256 _withdrawPercentage
    ) public onlyOwner onlyValidPercentages(_withdrawPercentage) {
        require(
            _recipientAddress != address(0),
            "Recepient Address can't be zero address"
        );
        totalRecipients++;
        recipients[_recipientAddress] = Recipient(0, _withdrawPercentage);
        emit LogRecipientAdded(_recipientAddress, _withdrawPercentage);
    }

    /**
     * @dev Function add  multiple recipients to the vesting contract
     * @param _recipients Array of recipient addresses
     * @param _withdrawPercentages Corresponding percentages of the recipients
     */
    function addMultipleRecipients(
        address[] memory _recipients,
        uint256[] memory _withdrawPercentages
    ) public onlyOwner {
        //TODO: Check if the right number here is 50 or more
        require(
            _recipients.length < 50,
            "The recipients must be not more than 50"
        );
        for (uint256 i; i < _recipients.length; i++) {
            addRecipient(_recipients[i], _withdrawPercentages[i]);
        }
    }

    /**
     * @dev Function that withdraws all available tokens for the current period
     */
    function claim() public {
        require(startDate != 0, "The vesting hasn't started");
        require(now >= startDate, "The vesting hasn't stated");
        uint256 period = (now - startDate) % (periodLength);

        if (period >= cumulativeAmountsToVest.length) {
            period = cumulativeAmountsToVest.length - 1;
        }
        uint256 calculatedAmount = PercentageCalculator.div(
            cumulativeAmountsToVest[period],
            recipients[msg.sender].withdrawPercetange
        );
        uint256 owedAmount = calculatedAmount -
            recipients[msg.sender].withdrawnAmount;
        recipients[msg.sender].withdrawnAmount = calculatedAmount;
        token.transfer(msg.sender, owedAmount);
        emit LogTokensClaimed(msg.sender, owedAmount);
    }

    /**
     * @dev Function that returns the amount that the user can withdraw at the current period.
     * @return _owedAmount The amount that the user can withdraw at the current period.
     */
    function hasClaim() public view returns (uint256 _owedAmount, uint256 period) {
        require(startDate != 0, "The vesting hasn't started");
        require(now >= startDate, "The vesting hasn't stated");

        uint256 period = (now - startDate) % (periodLength);
        if (period >= cumulativeAmountsToVest.length) {
            period = cumulativeAmountsToVest.length - 1;
        }
        uint256 calculatedAmount = PercentageCalculator.div(
            cumulativeAmountsToVest[period],
            recipients[msg.sender].withdrawPercetange
        );
        uint256 owedAmount = calculatedAmount -
            recipients[msg.sender].withdrawnAmount;
        return (owedAmount,period);
    }
}
