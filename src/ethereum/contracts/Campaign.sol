pragma solidity ^0.4.17;

contract Factory {

    address[] public deployedCampaigns;

    function createCampaign(uint minimum) public {
        address campaign = new Campaign(minimum, msg.sender);
        deployedCampaigns.push(campaign);
    }

    function getDeployedCampaigns() public view returns(address[]) {
        return deployedCampaigns;
    }
}

contract Campaign {

    struct Request {
        string description;
        uint value;
        bool complete;
        address recipient;
        mapping(address => bool) approvals;
        uint approvalsCount;
    } 

    Request[] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address => bool) public contributers;
    uint public contributersCount;

    modifier checkManager() {
        require(msg.sender == manager);
        _;
    }

    function Campaign(uint minimum, address creator) public {
        manager = creator;
        minimumContribution = minimum;
    }

    function contribute() public payable {
        require(msg.value > minimumContribution);
        contributers[msg.sender] = true;
        contributersCount++;
    }

    function makeRequest(string description, uint value, address recipient) public checkManager {
        
        Request memory newRequest = Request({
            description: description,
            value: value,
            recipient: recipient,
            complete: false,
            approvalsCount: 0
        });

        requests.push(newRequest);
    }
    
    function approveRequest(uint requestIndex) public {

        Request storage request = requests[requestIndex];

        require(contributers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        request.approvalsCount++;
    }

    function finalizeRequest(uint requestIndex) public checkManager {
        
        Request storage request = requests[requestIndex];

        require(!request.complete);
        require(request.approvalsCount > (contributersCount / 2));

        request.recipient.transfer(request.value);

        request.complete = true;
    }

    function getSummary() public view returns(uint, uint, uint, uint, address) {
        return (
            minimumContribution,
            this.balance,
            requests.length,
            contributersCount,
            manager
        );
    }

    function getRequestsCount() public view returns(uint) {
        return requests.length;
    }
}