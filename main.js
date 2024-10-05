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

const showAlert = (message) => {
    const alertDiv = document.getElementById("alertMessage");
    alertDiv.innerText = message;
    alertDiv.style.display = "block";

    // Position the alert near the cursor
    document.onmousemove = (e) => {
        alertDiv.style.left = e.pageX + 10 + 'px'; // Offset slightly to the right of the cursor
        alertDiv.style.top = e.pageY + 10 + 'px'; // Offset slightly below the cursor
    };

    // Fade out the alert after 3 seconds
    setTimeout(() => {
        alertDiv.style.opacity = '0'; // Start fading
        setTimeout(() => {
            alertDiv.style.display = "none"; // Hide it after fading
            alertDiv.style.opacity = '1'; // Reset opacity for next use
        }, 500); // Wait for the fading transition to complete
    }, 3000); // Show for 3 seconds
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
        showAlert("Please enter a valid Base64 string.");
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
        updateUpgradeCost();
        updateSecondBarUpgradeCost();
        updateThirdBarUpgradeCost();

        // Show second and third bars if they are unlocked
        if (secondBarUnlocked) {
            document.getElementById('secondBarContainer').style.display = "block";
        }
        if (thirdBarUnlocked) {
            document.getElementById('thirdBarContainer').style.display = "block";
        }

        // Update the UI to reflect the loaded state
        updateUI();
    } catch (error) {
        showAlert("Failed to load data. Please check the Base64 string.");
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
            // Exponential growth formula for money
            money += round(10 * Math.pow(1.15, upgradeLevel)); // 10 is the base amount
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
    upgradeCost = Math.floor(10 * Math.pow(1.5, upgradeLevel)); // Exponential cost growth
};

const updateSecondBarUpgradeCost = () => {
    const cost = Math.floor(baseSecondBarUpgradeCost * Math.pow(1.5, secondBarUpgradeLevel)); // Exponential cost growth
    document.getElementById('secondBarCost').innerHTML = cost;
};

const updateThirdBarUpgradeCost = () => {
    const cost = Math.floor(baseThirdBarUpgradeCost * Math.pow(1.5, thirdBarUpgradeLevel)); // Exponential cost growth
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
    
    secondBarButton.classList.contains("active") ? startSecondBarProgress() : stopSecondBarProgress();
};

const startSecondBarProgress = () => {
    const intervalDuration = calculateIntervalDuration(secondBarUpgradeLevel, 150);
    secondBarInterval = setInterval(() => {
        if (secondBarProgressValue < 100) {
            secondBarProgressValue++;
            document.getElementById("secondBarProgress").value = secondBarProgressValue;
        } else {
            // Exponential growth formula for the second bar
            money += round(20 * Math.pow(1.15, secondBarUpgradeLevel)); // 20 is the base amount
            document.getElementById("money").innerHTML = round(money);
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
        secondBarUpgradeLevel++;
        updateUI();  // Update UI after upgrade
        checkThirdBarUnlock();  // Check and unlock third bar if necessary
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
    
    thirdBarButton.classList.contains("active") ? startThirdBarProgress() : stopThirdBarProgress();
};

const startThirdBarProgress = () => {
    const intervalDuration = calculateIntervalDuration(thirdBarUpgradeLevel, 200);
    thirdBarInterval = setInterval(() => {
        if (thirdBarProgressValue < 100) {
            thirdBarProgressValue++;
            document.getElementById("thirdBarProgress").value = thirdBarProgressValue;
        } else {
            // Exponential growth formula for the third bar
            money += round(70 * Math.pow(1.15, thirdBarUpgradeLevel)); // 70 is the base amount
            document.getElementById("money").innerHTML = round(money);
            thirdBarProgressValue = 0;
        }
    }, intervalDuration);
    document.getElementById('thirdBarInterval').innerText = ` ${intervalDuration}ms`;
};

const stopThirdBarProgress = () => clearInterval(thirdBarInterval);

const upgradeThirdBar = () => {
    const cost = Math.floor(baseThirdBarUpgradeCost * Math.pow(1.5, thirdBarUpgradeLevel)); // Exponential cost growth
    if (thirdBarUnlocked && money >= cost) {
        money -= cost;
        thirdBarUpgradeLevel++;
        updateUI();
        restartProgressBars();
    } else {
        showAlert("Insufficient funds!");
    }
};

const calculateIntervalDuration = (level, baseDuration) => {
    const speedMultiplier = Math.pow(1.1, Math.floor(level / 10)); // Speed up every 10 levels
    return Math.floor(baseDuration / speedMultiplier); 
};

const checkThirdBarUnlock = () => {
    if (secondBarUpgradeLevel >= 5 && !thirdBarUnlocked) {
        thirdBarUnlocked = true;
        document.getElementById('thirdBarContainer').style.display = "block"; // Show third bar
    }
};

const restartProgressBars = () => {
    // Restart main bar progress
    stopProgress();
    if (isFindingMoney) startProgress();

    // Restart second bar progress if active
    if (document.getElementById("toggleSecondBar").classList.contains("active")) {
        stopSecondBarProgress();
        startSecondBarProgress();
    }

    // Restart third bar progress if active
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

    // Ensure upgrade levels display if elements are present in HTML
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
    document.getElementById("saveModal").style.display = "none"; // Hide the modal
};

const copyToClipboard = () => {
    const input = document.getElementById("savedDataInput");
    input.select();
    document.execCommand("copy"); // Copy the input value to clipboard
    alert("Copied to clipboard!"); // Optional: Alert user that it's copied
};

// Initial setup
updateUpgradeCost();
updateSecondBarUpgradeCost();
updateThirdBarUpgradeCost();
document.getElementById("money").innerHTML = money;

window.onload = () => {
    const savedData = localStorage.getItem("save");
    if (savedData) {
        // Optionally, you can set the input value directly
        document.getElementById("base64Input").value = savedData; // Set the input field if there is saved data
    }
};