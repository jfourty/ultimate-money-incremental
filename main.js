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

let logEntries = [];

const round = input => Math.round(input * 100) / 100;

const updateTitle = () => {
    document.title = `$${round(money)}`;
};

const showAlert = (message) => {
    const alertDiv = document.getElementById("alertMessage");
    alertDiv.innerText = message;
    alertDiv.style.display = "block";
    document.onmousemove = (e) => {
        alertDiv.style.left = e.pageX + 10 + 'px';
        alertDiv.style.top = e.pageY + 10 + 'px';
    };

    setTimeout(() => {
        alertDiv.style.opacity = '0';
        setTimeout(() => {
            alertDiv.style.display = "none";
            alertDiv.style.opacity = '1';
        }, 500);
    }, 3000);
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
    const encodedData = btoa(saveData);
    localStorage.setItem("save", encodedData);

    document.getElementById("savedDataInput").value = encodedData;
    document.getElementById("saveModal").style.display = "block";
};

const loadFromInput = () => {
    const base64Input = document.getElementById("base64Input").value.trim();
    if (!base64Input) {
        showAlert("Please enter a valid Base64 string.");
        return;
    }

    try {
        const saveData = atob(base64Input);
        const parsedData = JSON.parse(saveData);

        money = parsedData.money || 0;
        upgradeLevel = parsedData.upgradeLevel || 0;
        secondBarUnlocked = parsedData.secondBarUnlocked || false;
        secondBarUpgradeLevel = parsedData.secondBarUpgradeLevel || 0;
        thirdBarUnlocked = parsedData.thirdBarUnlocked || false;
        thirdBarUpgradeLevel = parsedData.thirdBarUpgradeLevel || 0;

        updateUpgradeCost();
        updateSecondBarUpgradeCost();
        updateThirdBarUpgradeCost();

        if (secondBarUnlocked) {
            document.getElementById('secondBarContainer').style.display = "block";
        }
        if (thirdBarUnlocked) {
            document.getElementById('thirdBarContainer').style.display = "block";
        }

        updateUI();
    } catch (error) {
        showAlert("Failed to load data. Please check the Base64 string.");
    }
};

const remove = () => localStorage.removeItem("save");

const logTransaction = (amount, type) => {
    const timestamp = new Date().toLocaleTimeString();
    const entry = `${timestamp} - ${type}: $${round(amount)}`;
    logEntries.push(entry);
    updateLogDisplay();
};

const updateLogDisplay = () => {
    const logContainer = document.getElementById('logContainer');
    logContainer.innerHTML = logEntries.map(entry => `<div>${entry}</div>`).join('');
};

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
            const income = round(10 * Math.pow(1.3, upgradeLevel));
            money += income;
            document.getElementById("money").innerHTML = round(money);
            logTransaction(income, 'Income');
            progressValue = 0;
        }
    }, intervalDuration);
    document.getElementById('progressInterval').innerText = ` ${intervalDuration}ms`;
};

const stopProgress = () => clearInterval(progressInterval);

const upgrade = () => {
    if (money >= upgradeCost) {
        money -= upgradeCost;
        logTransaction(upgradeCost, 'Expense');
        upgradeLevel++;
        updateUpgradeCost();
        updateUI();
        restartProgressBars();

        if (upgradeLevel === 1) {
            secondBarUnlocked = true;
            document.getElementById('secondBarContainer').style.display = "block";
        }
    } else {
        showAlert("Insufficient funds!");
    }
};

const updateUpgradeCost = () => {
    upgradeCost = Math.floor(10 * Math.pow(1.5, upgradeLevel));
};

const updateSecondBarUpgradeCost = () => {
    const cost = Math.floor(baseSecondBarUpgradeCost * Math.pow(1.5, secondBarUpgradeLevel));
    document.getElementById('secondBarCost').innerHTML = cost;
};

const updateThirdBarUpgradeCost = () => {
    const cost = Math.floor(baseThirdBarUpgradeCost * Math.pow(1.5, thirdBarUpgradeLevel));
    document.getElementById('thirdBarCost').innerHTML = cost;
};

const toggleSecondBarProgress = () => {
    if (!secondBarUnlocked) return showAlert("Unlock the second bar first!");
    if (secondBarUpgradeLevel < 1) return showAlert("Upgrade the second bar at least once!");

    const secondBarButton = document.getElementById("toggleSecondBar");
    const secondBarProgressBar = document.getElementById("secondBarProgress");

    secondBarButton.classList.toggle("active");
    secondBarProgressBar.style.display = secondBarButton.classList.contains("active") ? "inline" : "none";
    secondBarButton.innerText = secondBarButton.classList.contains("active") ? "Stop Ice Cream Truck" : "Start Ice Cream Truck";

    if (secondBarButton.classList.contains("active")) {
        startSecondBarProgress();
    } else {
        stopSecondBarProgress();
    }
};

const startSecondBarProgress = () => {
    const intervalDuration = calculateIntervalDuration(secondBarUpgradeLevel, 150);
    secondBarInterval = setInterval(() => {
        if (secondBarProgressValue < 100) {
            secondBarProgressValue++;
            document.getElementById("secondBarProgress").value = secondBarProgressValue;
        } else {
            const income = round(20 * Math.pow(1.3, upgradeLevel));
            money += income;
            document.getElementById("money").innerHTML = round(money);
            logTransaction(income, 'Income');
            secondBarProgressValue = 0;
        }
    }, intervalDuration);
    document.getElementById('secondBarInterval').innerText = ` ${intervalDuration}ms`;
};

const stopSecondBarProgress = () => clearInterval(secondBarInterval);

const upgradeSecondBar = () => {
    const cost = Math.floor(baseSecondBarUpgradeCost * Math.pow(1.5, secondBarUpgradeLevel));
    if (secondBarUnlocked && money >= cost) {
        money -= cost;
        logTransaction(upgradeCost, 'Expense');
        secondBarUpgradeLevel++;
        updateUI();
        checkThirdBarUnlock();
        restartProgressBars();
    } else {
        showAlert("Insufficient funds!");
    }
};

const toggleThirdBarProgress = () => {
    if (!thirdBarUnlocked) return showAlert("Unlock the third bar first!");
    if (thirdBarUpgradeLevel < 1) return showAlert("Upgrade the third bar at least once!");

    const thirdBarButton = document.getElementById("toggleThirdBar");
    const thirdBarProgressBar = document.getElementById("thirdBarProgress");

    thirdBarButton.classList.toggle("active");
    thirdBarProgressBar.style.display = thirdBarButton.classList.contains("active") ? "inline" : "none";
    thirdBarButton.innerText = thirdBarButton.classList.contains("active") ? "Stop Pizza Delivery" : "Start Pizza Delivery";

    if (thirdBarButton.classList.contains("active")) {
        startThirdBarProgress();
    } else {
        stopThirdBarProgress();
    }
};

const startThirdBarProgress = () => {
    const intervalDuration = calculateIntervalDuration(thirdBarUpgradeLevel, 200);
    thirdBarInterval = setInterval(() => {
        if (thirdBarProgressValue < 100) {
            thirdBarProgressValue++;
            document.getElementById("thirdBarProgress").value = thirdBarProgressValue;
        } else {
            const income = round(75 * Math.pow(1.3, thirdBarUpgradeLevel));
            money += income;
            document.getElementById("money").innerHTML = round(money);
            logTransaction(income, 'Income');
            thirdBarProgressValue = 0;
        }
    }, intervalDuration);
    document.getElementById('thirdBarInterval').innerText = ` ${intervalDuration}ms`;
};

const stopThirdBarProgress = () => clearInterval(thirdBarInterval);

const upgradeThirdBar = () => {
    const cost = Math.floor(baseThirdBarUpgradeCost * Math.pow(1.5, thirdBarUpgradeLevel));
    if (thirdBarUnlocked && money >= cost) {
        money -= cost;
        logTransaction(upgradeCost, 'Expense');
        thirdBarUpgradeLevel++;
        updateUI();
        restartProgressBars();
    } else {
        showAlert("Insufficient funds!");
    }
};

const calculateIntervalDuration = (level, baseDuration) => {
    const speedMultiplier = Math.pow(1.1, Math.floor(level / 10));
    return Math.floor(baseDuration / speedMultiplier); 
};

const checkThirdBarUnlock = () => {
    if (secondBarUpgradeLevel >= 5 && !thirdBarUnlocked) {
        thirdBarUnlocked = true;
        document.getElementById('thirdBarContainer').style.display = "block";
    }
};

const restartProgressBars = () => {
    stopProgress();
    if (isFindingMoney) startProgress();

    if (document.getElementById("toggleSecondBar").classList.contains("active")) {
        stopSecondBarProgress();
        startSecondBarProgress();
    }

    if (document.getElementById("toggleThirdBar").classList.contains("active")) {
        stopThirdBarProgress();
        startThirdBarProgress();
    }
};

const updateUI = () => {
    if (document.getElementById("money")) {
        document.getElementById("money").innerHTML = round(money);
    }
    if (document.getElementById("upgradeCost")) {
        document.getElementById("upgradeCost").innerHTML = upgradeCost;
    }
    if (document.getElementById('secondBarCost')) {
        document.getElementById('secondBarCost').innerHTML = Math.floor(baseSecondBarUpgradeCost * Math.pow(1.5, secondBarUpgradeLevel));
    }
    if (document.getElementById('thirdBarCost')) {
        document.getElementById('thirdBarCost').innerHTML = Math.floor(baseThirdBarUpgradeCost * Math.pow(1.5, thirdBarUpgradeLevel));
    }

    if (document.getElementById('upgradeLevelDisplay')) {
        document.getElementById('upgradeLevelDisplay').innerHTML = upgradeLevel;
    }
    if (document.getElementById('secondBarUpgradeLevelDisplay')) {
        document.getElementById('secondBarUpgradeLevelDisplay').innerHTML = secondBarUpgradeLevel;
    }
    if (document.getElementById('thirdBarUpgradeLevelDisplay')) {
        document.getElementById('thirdBarUpgradeLevelDisplay').innerHTML = thirdBarUpgradeLevel;
    }

    updateTitle();
};

const closeModal = () => {
    document.getElementById("saveModal").style.display = "none";
};

const copyToClipboard = () => {
    const input = document.getElementById("savedDataInput");
    input.select();
    document.execCommand("copy");
    showAlert("Copied to clipboard!");
};

// Initial setup
updateUpgradeCost();
updateSecondBarUpgradeCost();
updateThirdBarUpgradeCost();
document.getElementById("money").innerHTML = money;

window.onload = () => {
    const savedData = localStorage.getItem("save");
    if (savedData) {
        document.getElementById("base64Input").value = savedData;
    }
};