let money = 0, 
    isFindingMoney = false, 
    progressValue = 0, 
    progressInterval, 
    upgradeLevel = 0;

let upgradeCost = 10, 
    secondBarUnlocked = false, 
    secondBarProgressValue = 0, 
    secondBarInterval, 
    secondBarUpgradeLevel = 0;

let thirdBarUnlocked = false, 
    thirdBarProgressValue = 0, 
    thirdBarInterval, 
    thirdBarUpgradeLevel = 0;

const baseSecondBarUpgradeCost = 25; 
const baseThirdBarUpgradeCost = 300;

const round = input => Math.round(input * 1e6) / 1e6;

const updateTitle = () => {
    document.title = `$${round(money)}`;
};

const save = () => {
    const saveData = JSON.stringify({ 
        money, 
        upgradeLevel, 
        secondBarUnlocked, 
        secondBarUpgradeLevel, 
        thirdBarUnlocked, 
        thirdBarUpgradeLevel 
    });
    const encodedData = btoa(saveData); // Encode to Base64
    localStorage.setItem("save", encodedData); // Save the Base64 string

    // Show the Base64 string in the modal
    document.getElementById("savedDataInput").value = encodedData;
    document.getElementById("saveModal").style.display = "block"; // Show the modal
};

const loadFromInput = () => {
    const base64Input = document.getElementById("base64Input").value.trim();
    if (!base64Input) {
        alert("Please enter a valid Base64 string.");
        return;
    }

    try {
        const saveData = atob(base64Input); // Decode from Base64
        const parsedData = JSON.parse(saveData); // Parse the JSON string

        // Assign loaded values to the variables
        money = parsedData.money || 0;
        upgradeLevel = parsedData.upgradeLevel || 0;
        secondBarUnlocked = parsedData.secondBarUnlocked || false;
        secondBarUpgradeLevel = parsedData.secondBarUpgradeLevel || 0;
        thirdBarUnlocked = parsedData.thirdBarUnlocked || false;
        thirdBarUpgradeLevel = parsedData.thirdBarUpgradeLevel || 0;

        // Update costs based on loaded levels
        updateUpgradeCost(); // Update the main upgrade cost
        updateSecondBarUpgradeCost(); // Update the second bar upgrade cost
        updateThirdBarUpgradeCost(); // Update the third bar upgrade cost

        updateUI(); // Update the UI with the loaded data
    } catch (error) {
        alert("Failed to load data. Please check the Base64 string.");
    }
};

const remove = () => localStorage.removeItem("save");

const toggleProgress = () => {
    isFindingMoney = !isFindingMoney;
    const progressBar = document.getElementById("moneyProgress");
    const toggleButton = document.getElementById("toggleProgress");
    
    progressBar.style.display = isFindingMoney ? "inline" : "none";
    progressValue = isFindingMoney ? 0 : progressValue;
    toggleButton.innerText = isFindingMoney ? "Stop Finding Money" : "Start Finding Money";
    
    isFindingMoney ? startProgress() : stopProgress();
};

const startProgress = () => {
    const intervalDuration = calculateIntervalDuration(upgradeLevel, 100);
    progressInterval = setInterval(() => {
        if (progressValue < 100) {
            progressValue++;
            document.getElementById("moneyProgress").value = progressValue;
        } else {
            money += 10 + (upgradeLevel * 5);
            document.getElementById("money").innerHTML = round(money);
            progressValue = 0;
        }
    }, intervalDuration);
    document.getElementById('progressInterval').innerText = ` ${intervalDuration}ms`;
};

const stopProgress = () => clearInterval(progressInterval);

const upgrade = () => {
    if (money >= upgradeCost) {
        money -= upgradeCost;
        upgradeLevel++;
        updateUpgradeCost();
        updateUI();
        
        if (upgradeLevel === 1) {
            secondBarUnlocked = true;
            document.getElementById('secondBarContainer').style.display = "block";
        }
    } else {
        alert("Insufficient funds!");
    }
};

const updateUpgradeCost = () => {
    upgradeCost = Math.floor(10 * Math.pow(1.2, upgradeLevel));
};

const updateSecondBarUpgradeCost = () => {
    const cost = Math.floor(baseSecondBarUpgradeCost * Math.pow(1.2, secondBarUpgradeLevel));
    document.getElementById('secondBarCost').innerHTML = cost;
};

const updateThirdBarUpgradeCost = () => {
    const cost = Math.floor(baseThirdBarUpgradeCost * Math.pow(1.2, thirdBarUpgradeLevel));
    document.getElementById('thirdBarCost').innerHTML = cost;
};

const toggleSecondBarProgress = () => {
    if (!secondBarUnlocked) return alert("Unlock the second bar first!");
    if (secondBarUpgradeLevel < 1) return alert("Upgrade the second bar at least once!");

    const secondBarButton = document.getElementById("toggleSecondBar");
    const secondBarProgressBar = document.getElementById("secondBarProgress");
    
    secondBarButton.classList.toggle("active");
    secondBarProgressBar.style.display = secondBarButton.classList.contains("active") ? "inline" : "none";
    secondBarButton.innerText = secondBarButton.classList.contains("active") ? "Stop Ice Cream Truck" : "Start Ice Cream Truck";
    
    secondBarButton.classList.contains("active") ? startSecondBarProgress() : stopSecondBarProgress();
};

const startSecondBarProgress = () => {
    const intervalDuration = calculateIntervalDuration(secondBarUpgradeLevel, 150);
    secondBarInterval = setInterval(() => {
        if (secondBarProgressValue < 100) {
            secondBarProgressValue++;
            document.getElementById("secondBarProgress").value = secondBarProgressValue;
        } else {
            money += 20 + (secondBarUpgradeLevel * 5);
            document.getElementById("money").innerHTML = round(money);
            secondBarProgressValue = 0;
        }
    }, intervalDuration);
    document.getElementById('secondBarInterval').innerText = ` ${intervalDuration}ms`;
};

const stopSecondBarProgress = () => clearInterval(secondBarInterval);

const upgradeSecondBar = () => {
    const cost = Math.floor(baseSecondBarUpgradeCost * Math.pow(1.2, secondBarUpgradeLevel));
    if (secondBarUnlocked && money >= cost) {
        money -= cost;
        secondBarUpgradeLevel++;
        updateUI();
        checkThirdBarUnlock();
    } else {
        alert("Insufficient funds!");
    }
};

const toggleThirdBarProgress = () => {
    if (!thirdBarUnlocked) return alert("Unlock the third bar first!");
    if (thirdBarUpgradeLevel < 1) return alert("Upgrade the third bar at least once!");

    const thirdBarButton = document.getElementById("toggleThirdBar");
    const thirdBarProgressBar = document.getElementById("thirdBarProgress");
    
    thirdBarButton.classList.toggle("active");
    thirdBarProgressBar.style.display = thirdBarButton.classList.contains("active") ? "inline" : "none";
    thirdBarButton.innerText = thirdBarButton.classList.contains("active") ? "Stop Pizza Delivery" : "Start Pizza Delivery";
    
    thirdBarButton.classList.contains("active") ? startThirdBarProgress() : stopThirdBarProgress();
};

const startThirdBarProgress = () => {
    const intervalDuration = calculateIntervalDuration(thirdBarUpgradeLevel, 200);
    thirdBarInterval = setInterval(() => {
        if (thirdBarProgressValue < 100) {
            thirdBarProgressValue++;
            document.getElementById("thirdBarProgress").value = thirdBarProgressValue;
        } else {
            money += 70 + (thirdBarUpgradeLevel * 5);
            document.getElementById("money").innerHTML = round(money);
            thirdBarProgressValue = 0;
        }
    }, intervalDuration);
    document.getElementById('thirdBarInterval').innerText = ` ${intervalDuration}ms`;
};

const stopThirdBarProgress = () => clearInterval(thirdBarInterval);

const upgradeThirdBar = () => {
    const cost = Math.floor(baseThirdBarUpgradeCost * Math.pow(1.2, thirdBarUpgradeLevel));
    if (thirdBarUnlocked && money >= cost) {
        money -= cost;
        thirdBarUpgradeLevel++;
        updateUI();
    } else {
        alert("Insufficient funds!");
    }
};

const calculateIntervalDuration = (level, baseDuration) => {
    const speedMultiplier = Math.pow(1.1, Math.floor(level / 10)); // 1.1x speed every 10 levels
    return Math.floor(baseDuration / speedMultiplier);
};

const checkThirdBarUnlock = () => {
    if (secondBarUpgradeLevel > 0) {
        thirdBarUnlocked = true;
        document.getElementById('thirdBarContainer').style.display = "block";
    }
};

const updateUI = () => {
    document.getElementById('money').innerHTML = round(money);
    document.getElementById('upgradeLevel').innerHTML = upgradeLevel;
    document.getElementById('upgradeCost').innerHTML = upgradeCost;
    document.getElementById('progressInterval').innerText = ` ${calculateIntervalDuration(upgradeLevel, 100)}ms`;

    document.getElementById('secondBarUpgradeLevel').innerHTML = secondBarUpgradeLevel;
    updateSecondBarUpgradeCost();
    
    document.getElementById('thirdBarUpgradeLevel').innerHTML = thirdBarUpgradeLevel;
    updateThirdBarUpgradeCost();

    // Show/hide the second and third bars based on their unlocked status
    document.getElementById('secondBarContainer').style.display = secondBarUnlocked ? "block" : "none";
    document.getElementById('thirdBarContainer').style.display = thirdBarUnlocked ? "block" : "none";
};

const closeModal = () => {
    document.getElementById("saveModal").style.display = "none"; // Hide the modal
};

const copyToClipboard = () => {
    const input = document.getElementById("savedDataInput");
    input.select();
    document.execCommand("copy"); // Copy the input value to clipboard
    alert("Copied to clipboard!"); // Optional: Alert user that it's copied
};

window.onload = () => {
    const savedData = localStorage.getItem("save");
    if (savedData) {
        // Optionally, you can set the input value directly
        document.getElementById("base64Input").value = savedData; // Set the input field if there is saved data
    }
};