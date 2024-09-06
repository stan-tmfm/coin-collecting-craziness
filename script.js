document.addEventListener('DOMContentLoaded', () => {
    // Elements
    const coinCounter = document.getElementById('coin-counter');
    const spawnRateDisplay = document.getElementById('spawn-rate');
    const platformCapacityDisplay = document.getElementById('platform-capacity');
    const spawnRateUpgradeButton = document.getElementById('spawn-rate-upgrade');
    const coinMultiplierUpgradeButton = document.getElementById('coin-multiplier-upgrade');
    const coinPlatform = document.getElementById('coin-platform');
    const testButton = document.getElementById('test-button');
    const settingsButton = document.getElementById('settings-button');
    const settingsOverlay = document.getElementById('settings-overlay');
    const closeSettingsButton = document.getElementById('close-settings');
    const changeTrackButton = document.getElementById('change-track-button');
    const music = document.getElementById('background-music');
    const musicCheckbox = document.getElementById('music-checkbox');
    const scientificNotationCheckbox = document.getElementById('scientific-notation-checkbox');
    const hardResetButton = document.getElementById('hardResetButton');
    const confirmationOverlay = document.getElementById('confirmationOverlay');
    const confirmResetButton = document.getElementById('confirmResetButton');
    const cancelResetButton = document.getElementById('cancelResetButton');

    // Constants and Initial Values
    const maxCoins = 100; // Max capacity of the coin platform
    let coinCount = 0; // Total coins collected
    let spawnRate = 1; // Base spawn rate (coins per second)
    let spawnInterval = 1000 / spawnRate; // Interval time in milliseconds
    let upgradeLevel = 0; // Level of the spawn rate upgrade
    let coinMultiplier = 1; // Initial coin multiplier
    const maxUpgradeLevel = 9; // Maximum upgrade levels
    const baseUpgradeCost = 1e9; // Base cost of the upgrade
    let currentPlatformCapacity = 100; // Initial platform capacity
    let spawnIntervalId;
    let currentTrackIndex = 0;
    let useScientificNotation = false; // Default is false

    // Track list
    const tracks = [
        'DEAF KEV - Invincible  Glitch Hop  NCS - Copyright Free Music.mp3',
        'Different Heaven & EH!DE - My Heart  Drumstep  NCS - Copyright Free Music.mp3',
        'Elektronomia - Sky High  Progressive House  NCS - Copyright Free Music.mp3',
        'Disfigure - Blank  Melodic Dubstep  NCS - Copyright Free Music.mp3',
        'Different Heaven - Nekozilla  Electro  NCS - Copyright Free Music.mp3',
        'Jim Yosef - Firefly  Progressive House  NCS - Copyright Free Music.mp3',
        'Desmeon - Hellcat  Drumstep  NCS - Copyright Free Music.mp3',
        'JPB - High  Trap  NCS - Copyright Free Music.mp3',
        'K-391 - Earth  Drumstep  NCS - Copyright Free Music.mp3',
        'Jim Yosef & Anna Yvette - Linked  House  NCS - Copyright Free Music.mp3',
        'LFZ - Popsicle  House  NCS - Copyright Free Music.mp3',
        'Jim Yosef - Eclipse  House  NCS - Copyright Free Music.mp3',
        'Electro-Light - Symbolism  Trap  NCS - Copyright Free Music.mp3',
        'Cartoon, Jéja - On & On (feat. Daniel Levi)  Electronic Pop  NCS - Copyright Free Music.mp3',
        'Julius Dreisig & Zeus X Crona - Invisible  Trap  NCS - Copyright Free Music.mp3',
        'Killercats - Tell Me (feat. Alex Skrindo)  Future Bass  NCS - Copyright Free Music.mp3',
        'Distrion & Alex Skrindo - Entropy  House  NCS - Copyright Free Music.mp3',
        'Distrion & Electro-Light - Rubik  House  NCS - Copyright Free Music.mp3',
        'Lensko - Lets Go!  House  NCS - Copyright Free Music.mp3',
        'Kovan & Electro-Light - Skyline  House  NCS - Copyright Free Music.mp3'
    ];

    let shuffledTracks = [...tracks]; // Create a copy of the tracks array

    function formatNumber(number) {
        // Convert number to a JavaScript Number
        number = Number(number);

        // Check for scientific notation setting
        if (useScientificNotation) {
            if (number >= 1e6) {
                return number.toExponential(2);
            } else if (number >= 1e3) {
                // Include commas for thousands separators
                return number.toLocaleString();
            }
            return number.toString(); // For smaller numbers, return as is
        }

        // Custom suffixes for large numbers
        const suffixes = [
        { value: 1e303, suffix: 'Ce' }, { value: 1e300, suffix: 'NoNg' },
        { value: 1e297, suffix: 'OcNg' }, { value: 1e294, suffix: 'SpNg' },
        { value: 1e291, suffix: 'SxNg' }, { value: 1e288, suffix: 'QnNg' },
        { value: 1e285, suffix: 'QdNg' }, { value: 1e282, suffix: 'TNg' },
        { value: 1e279, suffix: 'DNg' }, { value: 1e276, suffix: 'UNg' },
        { value: 1e273, suffix: 'Ng' }, { value: 1e270, suffix: 'NoOg' },
        { value: 1e267, suffix: 'OcOg' }, { value: 1e264, suffix: 'SpOg' },
        { value: 1e261, suffix: 'SxOg' }, { value: 1e258, suffix: 'QnOg' },
        { value: 1e255, suffix: 'QdOg' }, { value: 1e252, suffix: 'TOg' },
        { value: 1e249, suffix: 'DOg' }, { value: 1e246, suffix: 'UOg' },
        { value: 1e243, suffix: 'Og' }, { value: 1e240, suffix: 'NoSg' },
        { value: 1e237, suffix: 'OcSg' }, { value: 1e234, suffix: 'SpSg' },
        { value: 1e231, suffix: 'SxSg' }, { value: 1e228, suffix: 'QnSg' },
        { value: 1e225, suffix: 'QdSg' }, { value: 1e222, suffix: 'TSg' },
        { value: 1e219, suffix: 'DSg' }, { value: 1e216, suffix: 'USg' },
        { value: 1e213, suffix: 'Sg' }, { value: 1e210, suffix: 'Nosg' },
        { value: 1e207, suffix: 'Ocsg' }, { value: 1e204, suffix: 'Spsg' },
        { value: 1e201, suffix: 'Sxsg' }, { value: 1e198, suffix: 'Qnsg' },
        { value: 1e195, suffix: 'Qdsg' }, { value: 1e192, suffix: 'Tsg' },
        { value: 1e189, suffix: 'Dsg' }, { value: 1e186, suffix: 'Usg' },
        { value: 1e183, suffix: 'sg' }, { value: 1e180, suffix: 'NoQg' },
        { value: 1e177, suffix: 'OcQg' }, { value: 1e174, suffix: 'SpQg' },
        { value: 1e171, suffix: 'SxQg' }, { value: 1e168, suffix: 'QnQg' },
        { value: 1e165, suffix: 'QdQg' }, { value: 1e162, suffix: 'TQg' },
        { value: 1e159, suffix: 'DQg' }, { value: 1e156, suffix: 'UQg' },
        { value: 1e153, suffix: 'Qg' }, { value: 1e150, suffix: 'Noqg' },
        { value: 1e147, suffix: 'Ocqg' }, { value: 1e144, suffix: 'Spqg' },
        { value: 1e141, suffix: 'Sxqg' }, { value: 1e138, suffix: 'Qnqg' },
        { value: 1e135, suffix: 'Qdqg' }, { value: 1e132, suffix: 'Tqg' },
        { value: 1e129, suffix: 'Dqg' }, { value: 1e126, suffix: 'Uqg' },
        { value: 1e123, suffix: 'qg' }, { value: 1e120, suffix: 'NoTg' },
        { value: 1e117, suffix: 'OcTg' }, { value: 1e114, suffix: 'SpTg' },
        { value: 1e111, suffix: 'SxTg' }, { value: 1e108, suffix: 'QnTg' },
        { value: 1e105, suffix: 'QdTg' }, { value: 1e102, suffix: 'TTg' },
        { value: 1e99, suffix: 'DTg' }, { value: 1e96, suffix: 'UTg' },
        { value: 1e93, suffix: 'Tg' }, { value: 1e90, suffix: 'NoVt' },
        { value: 1e87, suffix: 'OcVt' }, { value: 1e84, suffix: 'SpVt' },
        { value: 1e81, suffix: 'SxVt' }, { value: 1e78, suffix: 'QnVt' },
        { value: 1e75, suffix: 'QdVt' }, { value: 1e72, suffix: 'TVt' },
        { value: 1e69, suffix: 'DVt' }, { value: 1e66, suffix: 'UVt' },
        { value: 1e63, suffix: 'Vt' }, { value: 1e60, suffix: 'NoDe' },
        { value: 1e57, suffix: 'OcDe' }, { value: 1e54, suffix: 'SpDe' },
        { value: 1e51, suffix: 'SxDe' }, { value: 1e48, suffix: 'QnDe' },
        { value: 1e45, suffix: 'QdDe' }, { value: 1e42, suffix: 'TDe' },
        { value: 1e39, suffix: 'DDe' }, { value: 1e36, suffix: 'UDe' },
        { value: 1e33, suffix: 'De' }, { value: 1e30, suffix: 'No' },
        { value: 1e27, suffix: 'Oc' }, { value: 1e24, suffix: 'Sp' },
        { value: 1e21, suffix: 'Sx' }, { value: 1e18, suffix: 'Qn' },
        { value: 1e15, suffix: 'Qd' }, { value: 1e12, suffix: 'T' },
        { value: 1e9, suffix: 'B' }, { value: 1e6, suffix: 'M' }
    ];

        for (const { value, suffix } of suffixes) {
            if (number >= value) {
                let formattedNumber = (number / value).toFixed(2).replace(/\.00$/, '');
                return formattedNumber + suffix;
            }
        }

        return number.toLocaleString(); // For numbers less than 1e3
    }

    function updateCoinCounter() {
        coinCounter.textContent = `Coins: ${formatNumber(coinCount)}`;
    }

    function updatePlatformCapacity() {
        const coinCountOnPlatform = coinPlatform.children.length;
        platformCapacityDisplay.textContent = `Platform Capacity: ${coinCountOnPlatform}/${currentPlatformCapacity}`;

        // Change text color and boldness based on platform capacity
        if (coinCountOnPlatform >= currentPlatformCapacity) {
            platformCapacityDisplay.style.color = 'red';
            platformCapacityDisplay.style.fontWeight = 'bold';
        } else {
            platformCapacityDisplay.style.color = 'black';
            platformCapacityDisplay.style.fontWeight = 'normal';
        }
    }

    function updateSpawnRate() {
        clearInterval(spawnIntervalId); // Clear existing interval
        spawnInterval = Math.max(100, 1000 - (upgradeLevel * 100)); // Calculate new interval

        // Update spawn rate display
        const displaySpawnInterval = (spawnInterval / 1000).toFixed(1);
        spawnRateDisplay.textContent = `Coin Spawn Rate: 1 per ${displaySpawnInterval}s`;

        // Start the new interval
        spawnIntervalId = setInterval(spawnCoin, spawnInterval);
    }

 function spawnCoin() {
        if (coinPlatform.children.length >= currentPlatformCapacity) {
            console.log('Coin platform is full.');
            return; // Stop spawning if platform is full
        }

        const coin = document.createElement('div');
        coin.classList.add('coin');

        // Random position within the platform
        const x = Math.random() * (coinPlatform.clientWidth - 30);
        const y = Math.random() * (coinPlatform.clientHeight - 30);
        coin.style.left = `${x}px`;
        coin.style.top = `${y}px`;

        coinPlatform.appendChild(coin);
        updatePlatformCapacity(); // Update platform capacity display
    }

    function handleUpgrade() {
        // Calculate the cost with scaling factor
        const upgradeCost = baseUpgradeCost * Math.pow(2, upgradeLevel); // Cost scales by 2x per level

        if (coinCount >= upgradeCost && upgradeLevel < maxUpgradeLevel) {
            coinCount -= upgradeCost;
            upgradeLevel++;
            updateSpawnRate();
            updateCoinCounter();
            spawnRateUpgradeButton.textContent = `Increase Coin Spawn Speed (Cost: ${formatNumber(baseUpgradeCost * Math.pow(2, upgradeLevel))} Coins)`;
        } else {
            alert("Not enough coins or maximum level reached.");
        }
    }

    function increaseCoinMultiplier() {
        if (coinCount >= 1e9) {
            coinCount -= 1e9;
            coinMultiplier *= 10; // Increase coin multiplier by 10x
            updateCoinCounter();
            coinMultiplierUpgradeButton.textContent = `Increase Coin Multi by 10x Compounding [for testing purposes] (x${coinMultiplier})`;
        } else {
            alert("Not enough coins to increase multiplier.");
        }
    }

    function increaseCoinsExponentially() {
        coinMultiplier *= 10; // Multiply coin gain by 10x
        updateCoinCounter();
        testButton.textContent = `Increase Coin Multi by 10x Compounding [for testing purposes] (x${coinMultiplier})`;
    }
    
    function toggleSettingsMenu() {
        settingsOverlay.style.display = settingsOverlay.style.display === 'none' || settingsOverlay.style.display === '' ? 'flex' : 'none';
    }

    function closeSettingsMenu() {
        settingsOverlay.style.display = 'none';
    }

    function toggleMusic() {
        if (musicCheckbox.checked) {
            music.play(); // Play the music
        } else {
            music.pause(); // Pause the music
        }
    }

    function shuffleTracks() {
        for (let i = shuffledTracks.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledTracks[i], shuffledTracks[j]] = [shuffledTracks[j], shuffledTracks[i]];
        }
        currentTrackIndex = 0; // Reset track index after shuffling
    }

    function changeTrack() {
        currentTrackIndex++;
        if (currentTrackIndex >= shuffledTracks.length) {
            currentTrackIndex = 0; // Loop back to the first track
        }
        music.src = shuffledTracks[currentTrackIndex];
        music.play(); // Auto-play the next track
    }
    
 function saveGame() {
        const gameData = {
            coinCount,
            spawnRate,
            upgradeLevel,
            coinMultiplier,
            currentPlatformCapacity,
            currentTrackIndex,
            useScientificNotation
        };
        localStorage.setItem('gameData', JSON.stringify(gameData));
    }

    function loadGame() {
        const gameData = JSON.parse(localStorage.getItem('gameData'));
        if (gameData) {
            coinCount = gameData.coinCount;
            spawnRate = gameData.spawnRate;
            upgradeLevel = gameData.upgradeLevel;
            coinMultiplier = gameData.coinMultiplier;
            currentPlatformCapacity = gameData.currentPlatformCapacity;
            currentTrackIndex = gameData.currentTrackIndex;
            useScientificNotation = gameData.useScientificNotation;

            updateCoinCounter();
            updatePlatformCapacity();
            updateSpawnRate();
            music.src = shuffledTracks[currentTrackIndex];
            music.play(); // Resume playing the last track
        }
    }

    function showConfirmationOverlay() {
        confirmationOverlay.style.display = 'flex';
    }

    function hideConfirmationOverlay() {
        confirmationOverlay.style.display = 'none';
    }

    function performHardReset() {
        // Reset all game data
        localStorage.removeItem('gameData');
        coinCount = 0;
        spawnRate = 1000;
        upgradeLevel = 0;
        coinMultiplier = 1;
        currentPlatformCapacity = 100;
        currentTrackIndex = 0;
        useScientificNotation = false;

        // Update UI
        updateCoinCounter();
        updatePlatformCapacity();
        updateSpawnRate();
        music.src = shuffledTracks[currentTrackIndex];
        music.play(); // Resume playing the first track
        hideConfirmationOverlay();
    }

    // Event Listeners
    hardResetButton.addEventListener('click', showConfirmationOverlay);
    confirmResetButton.addEventListener('click', performHardReset);
    cancelResetButton.addEventListener('click', hideConfirmationOverlay);

    coinPlatform.addEventListener('mouseover', (event) => {
    if (event.target.classList.contains('coin')) {
        event.target.remove();
        coinCount += coinMultiplier; // Apply multiplier to coin gain
        updateCoinCounter();
        updatePlatformCapacity(); // Update platform capacity display
    }
});

    spawnRateUpgradeButton.addEventListener('click', () => {
        handleUpgrade();
        saveGame(); // Save game data after upgrading
    });

    coinMultiplierUpgradeButton.addEventListener('click', () => {
        increaseCoinMultiplier();
        saveGame(); // Save game data after increasing multiplier
    });

    testButton.addEventListener('click', () => {
        increaseCoinsExponentially();
        saveGame(); // Save game data after increasing multiplier
    });

    settingsButton.addEventListener('click', toggleSettingsMenu);
    closeSettingsButton.addEventListener('click', closeSettingsMenu);
    changeTrackButton.addEventListener('click', changeTrack);
    musicCheckbox.addEventListener('change', toggleMusic);
    scientificNotationCheckbox.addEventListener('change', () => {
        useScientificNotation = scientificNotationCheckbox.checked;
        updateCoinCounter(); // Update the display to reflect the change
        saveGame(); // Save game data after changing scientific notation setting
    });

    // Initialize
    loadGame(); // Load game data on initial load
    updateSpawnRate(); // Set the initial spawn rate
    shuffleTracks(); // Shuffle tracks on initial load
    updateCoinCounter(); // Update coin counter display initially
    updatePlatformCapacity(); // Update platform capacity display initially
});
